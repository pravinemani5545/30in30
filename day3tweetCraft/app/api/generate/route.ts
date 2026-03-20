import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UrlSchema } from "@/lib/validations/url";
import { parseUrl, isParseError } from "@/lib/parser";
import { generateTweets } from "@/lib/claude/generateTweets";
import { createSupabaseServer, createSupabaseServiceRole } from "@/lib/supabase/server";
import type { ParsedArticle, TweetVariation, GenerateResponse } from "@/types";
import { getDomainFromUrl, getFaviconUrl } from "@/lib/utils";
import { cleanPastedContent, countWords } from "@/lib/parser/clean";

const RequestSchema = z.object({
  url: z.string(),
  pastedContent: z.string().max(150000).optional(),
});

function buildArticleFromPaste(url: string, rawContent: string): ParsedArticle {
  const content = cleanPastedContent(rawContent);
  const domain = getDomainFromUrl(url);
  const wordCount = countWords(content);
  // Use first non-empty line as title if it looks like one (< 120 chars)
  const firstLine = content.split("\n").find((l) => l.trim().length > 0) ?? "";
  const title = firstLine.length < 120 ? firstLine.trim() : domain;
  return {
    url,
    domain,
    faviconUrl: getFaviconUrl(url),
    title,
    description: content.slice(0, 300).replace(/\n/g, " "),
    author: null,
    publishedAt: null,
    ogImageUrl: null,
    mainContent: content,
    wordCount,
    estimatedReadMinutes: Math.max(1, Math.round(wordCount / 200)),
    contentQuality: content.length > 800 ? "full" : content.length > 200 ? "limited" : "og_only",
  };
}

const DAILY_GENERATION_LIMIT = 20;

export async function POST(request: NextRequest) {
  // 1. Authenticate
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to generate tweets" }, { status: 401 });
  }

  // 2. Validate input
  const body = await request.json().catch(() => ({})) as unknown;
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const urlParsed = UrlSchema.safeParse(parsed.data.url);
  if (!urlParsed.success) {
    return NextResponse.json(
      { error: urlParsed.error.issues[0]?.message ?? "Invalid URL" },
      { status: 400 }
    );
  }
  const normalizedUrl = urlParsed.data;
  const pastedContent = parsed.data.pastedContent?.trim();

  // 3. Rate limit check
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  if ((count ?? 0) >= DAILY_GENERATION_LIMIT) {
    return NextResponse.json(
      { error: "You've hit the daily limit of 20 generations. Come back tomorrow!" },
      { status: 429 }
    );
  }

  // 4. Build article — from pasted content OR cache OR fetch
  const serviceSupabase = createSupabaseServiceRole();
  let article: ParsedArticle | null = null;
  let cached = false;

  if (pastedContent) {
    // Manual paste: skip cache entirely, build directly from pasted text
    article = buildArticleFromPaste(normalizedUrl, pastedContent);
  } else {
    // Check article cache
    const { data: cachedArticle } = await supabase
      .from("article_cache")
      .select("*")
      .eq("normalized_url", normalizedUrl)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (cachedArticle) {
      cached = true;
      article = {
        url: cachedArticle.url,
        domain: cachedArticle.domain,
        faviconUrl: getFaviconUrl(cachedArticle.url),
        title: cachedArticle.title ?? getDomainFromUrl(cachedArticle.url),
        description: cachedArticle.description ?? "",
        author: cachedArticle.author,
        publishedAt: cachedArticle.published_at,
        ogImageUrl: cachedArticle.og_image_url,
        mainContent: cachedArticle.main_content ?? "",
        wordCount: cachedArticle.word_count ?? 0,
        estimatedReadMinutes: cachedArticle.estimated_read_minutes ?? 1,
        contentQuality: cachedArticle.content_quality ?? "full",
      };
    }

    // Fetch + parse if not cached
    if (!article) {
      const parseResult = await parseUrl(normalizedUrl);
      if (isParseError(parseResult)) {
        return NextResponse.json({ error: parseResult.error }, { status: 422 });
      }
      article = parseResult;

      // Store in article_cache (service role — shared table)
      await serviceSupabase
        .from("article_cache")
        .upsert(
          {
            url: article.url,
            normalized_url: normalizedUrl,
            domain: article.domain,
            title: article.title,
            description: article.description,
            author: article.author,
            published_at: article.publishedAt,
            og_image_url: article.ogImageUrl,
            main_content: article.mainContent,
            word_count: article.wordCount,
            estimated_read_minutes: article.estimatedReadMinutes,
            content_quality: article.contentQuality,
            cached_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
          { onConflict: "normalized_url" }
        );
    }
  }

  // 6. Create generation record
  const { data: generation, error: genError } = await supabase
    .from("generations")
    .insert({
      user_id: user.id,
      article_url: article.url,
      article_title: article.title,
      article_domain: article.domain,
      article_favicon_url: article.faviconUrl,
      content_quality: article.contentQuality,
      status: "generating",
    })
    .select("id")
    .single();

  if (genError || !generation) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // 7. Call Claude
  let claudeOutput;
  const generationStart = Date.now();

  try {
    claudeOutput = await generateTweets(article, generation.id);
  } catch (err) {
    await supabase
      .from("generations")
      .update({ status: "failed", error_message: "Generation failed" })
      .eq("id", generation.id);

    if (err instanceof Error && err.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Generation timed out. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  const generationMs = Date.now() - generationStart;

  // 8. Insert tweet_variations rows
  const variationsToInsert = claudeOutput.tweets.map((tweet) => ({
    generation_id: generation.id,
    user_id: user.id,
    variation_number: tweet.variationNumber,
    tweet_type: tweet.tweetType,
    content: tweet.content,
    character_count: tweet.characterCount,
    hook_score: tweet.hookScore,
    hook_analysis: tweet.hookAnalysis,
    retweet_potential: tweet.retweetPotential,
    reply_bait: tweet.replyBait,
    saves_potential: tweet.savesPotential,
    why_this_works: tweet.whyThisWorks,
    potential_weakness: tweet.potentialWeakness,
    is_regenerated: false,
  }));

  const { data: insertedVariations, error: varError } = await supabase
    .from("tweet_variations")
    .insert(variationsToInsert)
    .select();

  if (varError || !insertedVariations) {
    await supabase
      .from("generations")
      .update({ status: "failed", error_message: "Failed to save variations" })
      .eq("id", generation.id);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // 9. Update generation to completed
  await supabase
    .from("generations")
    .update({
      status: "completed",
      tweet_variations: claudeOutput,
      article_summary: claudeOutput.articleSummary,
      key_insights: claudeOutput.keyInsights,
      generation_ms: generationMs,
    })
    .eq("id", generation.id);

  const response: GenerateResponse = {
    generationId: generation.id,
    articleTitle: article.title,
    articleDomain: article.domain,
    articleFaviconUrl: article.faviconUrl,
    articleSummary: claudeOutput.articleSummary,
    keyInsights: claudeOutput.keyInsights,
    variations: insertedVariations as TweetVariation[],
    contentQuality: article.contentQuality,
    cached,
  };

  return NextResponse.json(response);
}

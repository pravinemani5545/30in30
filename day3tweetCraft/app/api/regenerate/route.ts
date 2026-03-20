import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { regenerateTweet } from "@/lib/claude/regenerateTweet";
import { createSupabaseServer } from "@/lib/supabase/server";

const RequestSchema = z.object({
  generationId: z.string().uuid(),
  variationNumber: z.number().int().min(1).max(5),
});

const MAX_REGENERATIONS = 3;

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to regenerate tweets" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as unknown;
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { generationId, variationNumber } = parsed.data;

  // Verify user owns this generation
  const { data: generation } = await supabase
    .from("generations")
    .select("id, article_title, article_domain, tweet_variations, user_id")
    .eq("id", generationId)
    .eq("user_id", user.id)
    .single();

  if (!generation) {
    return NextResponse.json({ error: "Generation not found" }, { status: 404 });
  }

  // Get current variation
  const { data: existingVariation } = await supabase
    .from("tweet_variations")
    .select("*")
    .eq("generation_id", generationId)
    .eq("variation_number", variationNumber)
    .single();

  if (!existingVariation) {
    return NextResponse.json({ error: "Tweet variation not found" }, { status: 404 });
  }

  // Check regeneration count
  const { count } = await supabase
    .from("tweet_variations")
    .select("*", { count: "exact", head: true })
    .eq("generation_id", generationId)
    .eq("variation_number", variationNumber)
    .eq("is_regenerated", true);

  if ((count ?? 0) >= MAX_REGENERATIONS) {
    return NextResponse.json(
      { error: "Maximum regenerations reached for this tweet" },
      { status: 429 }
    );
  }

  // Get article context
  const cachedContent = generation.tweet_variations as { tweets?: Array<{ variationNumber: number; content: string }> } | null;
  const mainContent = cachedContent?.tweets?.find(
    (t) => t.variationNumber === variationNumber
  )?.content ?? "";

  // Call Claude for single regeneration
  let newTweet;
  try {
    newTweet = await regenerateTweet(
      {
        title: generation.article_title ?? "Article",
        domain: generation.article_domain ?? "",
        mainContent,
      },
      existingVariation.tweet_type,
      existingVariation.content
    );
  } catch (err) {
    console.error("Regenerate error:", err);
    const isAbort = err instanceof Error && (
      err.name === "TimeoutError" ||
      err.name === "AbortError" ||
      err.message.toLowerCase().includes("aborted") ||
      err.message.toLowerCase().includes("timed out")
    );
    if (isAbort) {
      return NextResponse.json({ error: "Generation timed out. Please try again." }, { status: 504 });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // Update the variation row
  const { data: updatedVariation, error: updateError } = await supabase
    .from("tweet_variations")
    .update({
      content: newTweet.content,
      character_count: newTweet.characterCount,
      hook_score: newTweet.hookScore,
      hook_analysis: newTweet.hookAnalysis,
      retweet_potential: newTweet.retweetPotential,
      reply_bait: newTweet.replyBait,
      saves_potential: newTweet.savesPotential,
      why_this_works: newTweet.whyThisWorks,
      potential_weakness: newTweet.potentialWeakness,
      is_regenerated: true,
    })
    .eq("id", existingVariation.id)
    .select()
    .single();

  if (updateError || !updatedVariation) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ variation: updatedVariation });
}

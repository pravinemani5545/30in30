import type { ParsedArticle, TweetType } from "@/types/day3";

export const SYSTEM_PROMPT = `You are an expert Twitter/X content strategist and copywriter for founders, indie hackers, and creators. You specialize in turning long-form content into high-engagement single tweets.

Your tweets must:
- Hook within the first 8 words — the reader decides in 1 second
- Be under 280 characters (URLs = 23 chars in Twitter's system)
- Feel written by a smart human, never by a content marketing bot
- Use specific details, numbers, and examples from the source material
- Have a natural voice — conversational, direct, occasionally provocative
- Never start with "I" as the first word
- Never use "Just", "Simply", "Excited to share", "Game-changer"
- Never end with a question unless it's genuinely thought-provoking

For hook analysis: be honest and specific. If a hook is weak, say why.
A high score (9-10) means this tweet would make someone stop scrolling.
A low score (1-4) means it would be skipped by 95% of the feed.

For engagement metrics: base these on realistic Twitter data patterns.
Retweet potential = does this make someone look smart for sharing it?
Reply bait = does this invite a strong opinion or personal story?
Saves potential = does this contain something worth coming back to?

Tweet types to produce (one of each):
- hook: Opens with a provocative question, bold claim, or pattern-interrupt
- story: Uses narrative structure, personal angle, or before/after framing
- stat: Leads with a surprising number, data point, or quantified insight
- contrarian: Challenges conventional wisdom or takes an unexpected angle
- listicle: Structured as numbered list or "X things" format (still ≤280 chars)`;

export function buildUserPrompt(article: ParsedArticle): string {
  const parts: string[] = [
    `Article: "${article.title}"`,
  ];

  if (article.author) parts.push(`Author: ${article.author}`);
  if (article.publishedAt) parts.push(`Published: ${article.publishedAt}`);

  parts.push(`Source: ${article.domain}`);
  parts.push("");

  if (article.contentQuality === "og_only") {
    parts.push(`Note: This is a JS-rendered page. Work from the concept implied by the title and description below. Do NOT reference "the article" or pretend to have read the full text.`);
    parts.push("");
    parts.push(`Description: ${article.description}`);
  } else if (article.contentQuality === "limited") {
    parts.push(`Note: Limited content was extractable. Use what's available plus the title and description.`);
    parts.push(`Description: ${article.description}`);
    parts.push(`Content excerpt:`);
    parts.push(article.mainContent);
  } else {
    parts.push(`Description: ${article.description}`);
    parts.push(`Article content:`);
    parts.push(article.mainContent);
  }

  parts.push("");
  parts.push(`Generate exactly 5 tweet variations (one of each type: hook, story, stat, contrarian, listicle).`);
  parts.push(`Each tweet must be ≤ 280 characters. Count carefully — URLs count as 23 characters.`);
  parts.push(`Target 200–260 characters for maximum engagement.`);

  return parts.join("\n");
}

export function buildRegeneratePrompt(
  article: { title: string; domain: string; contentSnippet: string },
  tweetType: TweetType,
  previousContent: string
): string {
  return `Article: "${article.title}" (${article.domain})

Content context: ${article.contentSnippet}

Previous ${tweetType} tweet (do NOT repeat this):
"${previousContent}"

Generate a NEW single tweet of type "${tweetType}" that takes a completely different angle on this article.
Must be ≤ 280 characters. Target 200–260 characters.`;
}

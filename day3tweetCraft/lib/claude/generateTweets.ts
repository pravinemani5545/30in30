import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { ClaudeGenerateOutput, ParsedArticle } from "@/types";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

const TweetVariationSchema = z.object({
  variationNumber: z.number().int().min(1).max(5),
  tweetType: z.enum(["hook", "story", "stat", "contrarian", "listicle"]),
  content: z.string().max(300),
  characterCount: z.number().int(),
  hookScore: z.number().int().min(1).max(10),
  hookAnalysis: z.string(),
  retweetPotential: z.number().int().min(1).max(10),
  replyBait: z.number().int().min(1).max(10),
  savesPotential: z.number().int().min(1).max(10),
  whyThisWorks: z.string(),
  potentialWeakness: z.string(),
});

const GenerateOutputSchema = z.object({
  articleSummary: z.string(),
  keyInsights: z.array(z.string()).min(3).max(5),
  tweets: z.array(TweetVariationSchema).length(5),
});

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

// Re-count characters server-side (Twitter: URLs = 23 chars)
function countTweetChars(content: string): number {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return content.replace(urlRegex, "x".repeat(23)).length;
}

// Truncate tweet to fit within 280 chars
function truncateToLimit(content: string): string {
  const twitterLimit = 280;
  if (countTweetChars(content) <= twitterLimit) return content;

  // Truncate at word boundary
  const words = content.split(" ");
  let result = "";
  for (const word of words) {
    const candidate = result ? result + " " + word : word;
    if (countTweetChars(candidate + "...") <= twitterLimit) {
      result = candidate;
    } else {
      break;
    }
  }
  return result + "...";
}

export async function generateTweets(
  article: ParsedArticle,
  generationId?: string
): Promise<ClaudeGenerateOutput> {
  const client = getClient();
  const startedAt = Date.now();

  const message = await client.messages.parse(
    {
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(article),
        },
      ],
      output_config: {
        format: zodOutputFormat(GenerateOutputSchema),
      },
    },
    {
      signal: AbortSignal.timeout(30000),
    }
  );

  const duration = Date.now() - startedAt;
  const result = message.parsed_output;

  if (!result) {
    throw new Error("Claude returned no structured output");
  }

  // Validate and fix character counts server-side
  const validatedTweets = result.tweets.map((tweet) => {
    const actual = countTweetChars(tweet.content);
    if (actual !== tweet.characterCount) {
      console.warn(`[claude] Character count mismatch for tweet ${tweet.variationNumber}: Claude said ${tweet.characterCount}, actual ${actual}`);
    }

    const content = truncateToLimit(tweet.content);
    const characterCount = countTweetChars(content);

    return { ...tweet, content, characterCount };
  });

  console.info("[claude] generateTweets complete", {
    generationId,
    durationMs: duration,
    contentQuality: article.contentQuality,
    hookScores: validatedTweets.map((t) => t.hookScore),
  });

  return {
    ...result,
    tweets: validatedTweets,
  };
}

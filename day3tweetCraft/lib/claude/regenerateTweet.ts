import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { TweetType } from "@/types";
import { SYSTEM_PROMPT, buildRegeneratePrompt } from "./prompts";

const SingleTweetSchema = z.object({
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

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

function countTweetChars(content: string): number {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return content.replace(urlRegex, "x".repeat(23)).length;
}

function truncateToLimit(content: string): string {
  const twitterLimit = 280;
  if (countTweetChars(content) <= twitterLimit) return content;
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

export async function regenerateTweet(
  article: { title: string; domain: string; mainContent: string },
  tweetType: TweetType,
  previousContent: string
): Promise<z.infer<typeof SingleTweetSchema>> {
  const client = getClient();

  const contentSnippet = article.mainContent.slice(0, 2000);

  const message = await client.messages.parse(
    {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildRegeneratePrompt(
            { title: article.title, domain: article.domain, contentSnippet },
            tweetType,
            previousContent
          ),
        },
      ],
      output_config: {
        format: zodOutputFormat(SingleTweetSchema),
      },
    },
    {
      signal: AbortSignal.timeout(20000),
    }
  );

  const result = message.parsed_output;
  if (!result) throw new Error("Claude returned no structured output");

  const content = truncateToLimit(result.content);
  const characterCount = countTweetChars(content);

  return { ...result, content, characterCount };
}

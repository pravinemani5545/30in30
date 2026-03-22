import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { HNStory, SummarizedStory } from "@/types";
import { SYSTEM_PROMPT, buildSummarizePrompt } from "./prompts";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const SummarySchema = z.object({
  summary: z.string(),
  relevanceScore: z.number(),
  reason: z.string(),
});

export async function summarizeStory(
  story: HNStory
): Promise<SummarizedStory> {
  try {
    const response = await getAnthropic().messages.parse(
      {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 384,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          { role: "user", content: buildSummarizePrompt(story) },
        ],
        output_config: {
          format: zodOutputFormat(SummarySchema),
        },
      },
      { signal: AbortSignal.timeout(15000) }
    );

    const parsed = response.parsed_output;

    if (!parsed) {
      return {
        ...story,
        summary: story.title,
        relevanceScore: 5,
        reason: "parse_failed",
        parseError: true,
      };
    }

    return {
      ...story,
      summary: parsed.summary,
      relevanceScore: Math.max(1, Math.min(10, parsed.relevanceScore)),
      reason: parsed.reason,
    };
  } catch (error) {
    console.warn(`Summarize failed for story ${story.id}:`, error);
    return {
      ...story,
      summary: story.title,
      relevanceScore: 5,
      reason: "summarize_failed",
      parseError: true,
    };
  }
}

export async function summarizeAllStories(
  stories: HNStory[]
): Promise<SummarizedStory[]> {
  const results = await Promise.allSettled(stories.map(summarizeStory));

  const summarized = results
    .filter(
      (r): r is PromiseFulfilledResult<SummarizedStory> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);

  // Sort by relevance score descending
  return summarized.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

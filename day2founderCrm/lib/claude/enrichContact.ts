import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { RawProfileData, EnrichmentResult } from "@/types";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/claude/prompts";

// Zod schema for structured output
const EnrichmentOutputSchema = z.object({
  person: z.object({
    fullName: z.string(),
    headline: z.string(),
    location: z.string(),
    summary: z.string(),
    keyTalkingPoints: z.array(z.string()),
  }),
  company: z.object({
    name: z.string(),
    domain: z.string(),
    industry: z.string(),
    estimatedSize: z.string(),
    description: z.string(),
    recentSignals: z.array(z.string()),
  }),
  followUpSuggestions: z
    .array(
      z.object({
        tone: z.enum(["warm", "direct", "casual"]),
        message: z.string(),
      })
    )
    .min(3)
    .max(3),
  enrichmentConfidence: z.enum(["high", "medium", "low"]),
  enrichmentNotes: z.string(),
});

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return _client;
}

export async function enrichContact(
  profile: RawProfileData,
  contactId?: string
): Promise<EnrichmentResult> {
  const client = getClient();
  const startedAt = Date.now();

  const message = await client.messages.parse(
    {
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(profile),
        },
      ],
      output_config: {
        format: zodOutputFormat(EnrichmentOutputSchema),
      },
    },
    {
      signal: AbortSignal.timeout(60000),
    }
  );

  const duration = Date.now() - startedAt;
  const result = message.parsed_output;

  if (!result) {
    throw new Error("Claude returned no structured output");
  }

  console.info("[claude] Enrichment complete", {
    contactId,
    duration,
    confidence: result.enrichmentConfidence,
  });

  return result as EnrichmentResult;
}

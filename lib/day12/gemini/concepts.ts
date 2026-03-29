import { generateJson } from "@/lib/day12/ai/gemini";
import { THUMBNAIL_SYSTEM_PROMPT, buildConceptPrompt } from "./prompts";
import {
  ThumbnailOutputSchema,
  type ThumbnailOutput,
} from "@/lib/day12/validations/concepts";
import { TONE_DRIVER_AFFINITY } from "@/lib/day12/framework/galloway";
import type { Tone, Driver } from "@/types/day12";

export async function generateConcepts(
  videoTitle: string,
  niche: string,
  tone: Tone,
  userId: string,
): Promise<ThumbnailOutput> {
  const start = Date.now();
  const userPrompt = buildConceptPrompt(videoTitle, niche, tone);

  const raw = await generateJson<unknown>(
    userPrompt,
    THUMBNAIL_SYSTEM_PROMPT,
  );

  const parsed = ThumbnailOutputSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(
      "[day12/concepts] Zod validation failed:",
      parsed.error.issues.map((i) => i.message).join(", "),
    );
    throw new Error("AI output validation failed. Please try again.");
  }

  const output = parsed.data;

  // Post-process: trim text overlay to max 4 words
  for (const concept of output.concepts) {
    if (concept.textOverlay.length > 4) {
      concept.textOverlay = concept.textOverlay.slice(0, 4);
    }
    // Trim composition steps to max 7
    if (concept.compositionSteps.length > 7) {
      concept.compositionSteps = concept.compositionSteps.slice(0, 7);
    }
  }

  // Validate predicted winner matches tone affinity
  const expectedWinner: Driver = TONE_DRIVER_AFFINITY[tone];
  if (output.predictedWinner !== expectedWinner) {
    console.warn(
      `[day12/concepts] Winner mismatch: Gemini=${output.predictedWinner}, affinity=${expectedWinner}, tone=${tone}, userId=${userId}`,
    );
    output.predictedWinner = expectedWinner;
    // Fix isPredictedWinner flags
    for (const concept of output.concepts) {
      concept.isPredictedWinner = concept.driver === expectedWinner;
    }
  }

  // Ensure exactly one winner
  const winners = output.concepts.filter((c) => c.isPredictedWinner);
  if (winners.length !== 1) {
    for (const concept of output.concepts) {
      concept.isPredictedWinner = concept.driver === expectedWinner;
    }
  }

  const elapsedMs = Date.now() - start;
  console.log(
    `[day12/concepts] Generated in ${elapsedMs}ms, tone=${tone}, niche=${niche}, userId=${userId}`,
  );

  return output;
}

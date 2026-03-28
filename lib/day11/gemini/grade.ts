import { getModelJson } from "@/lib/day10/ai/gemini";
import { GradeOutputSchema } from "@/lib/day11/validations/grade";
import {
  ADVERSARIAL_GRADER_PROMPT,
  buildGradePrompt,
} from "@/lib/day11/gemini/prompts";
import { CAMPAIGN_LAUNCH_THRESHOLD, REWRITE_TARGET_SCORE } from "@/lib/day11/scoring/rubric";
import type { GradeResult } from "@/types/day11";

export async function gradeEmail(email: string): Promise<GradeResult> {
  const model = getModelJson();
  const userPrompt = buildGradePrompt(email);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    systemInstruction: {
      role: "system",
      parts: [{ text: ADVERSARIAL_GRADER_PROMPT }],
    },
  });

  const raw = result.response.text();

  // Strip markdown fences + trailing commas
  const cleaned = raw
    .replace(/^```json\n?/, "")
    .replace(/\n?```$/, "")
    .replace(/,(\s*[}\]])/g, "$1")
    .trim();

  const parsed = JSON.parse(cleaned);
  const validated = GradeOutputSchema.parse(parsed);

  // Verify sum
  const { personalization, spam, cta, reading } = validated.dimensions;
  const computedSum =
    personalization.score + spam.score + cta.score + reading.score;
  const discrepancy = Math.abs(validated.overallScore - computedSum);

  if (discrepancy > 5) {
    throw new Error(
      `Score sum mismatch: overallScore=${validated.overallScore}, computed=${computedSum}`
    );
  }

  // Use computed sum if there's any discrepancy
  const overallScore = discrepancy > 0 ? computedSum : validated.overallScore;

  return {
    ...validated,
    overallScore,
    gatePassed: overallScore >= CAMPAIGN_LAUNCH_THRESHOLD,
    rewriteNeeded: overallScore < REWRITE_TARGET_SCORE,
  };
}

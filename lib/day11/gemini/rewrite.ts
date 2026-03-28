import { getModelJson } from "@/lib/day10/ai/gemini";
import { RewriteOutputSchema } from "@/lib/day11/validations/grade";
import {
  REWRITER_PROMPT,
  buildRewritePrompt,
} from "@/lib/day11/gemini/prompts";
import type { GradeResult, RewriteResult } from "@/types/day11";

export async function rewriteEmail(
  originalEmail: string,
  gradeResult: GradeResult
): Promise<RewriteResult> {
  const model = getModelJson();
  const userPrompt = buildRewritePrompt(originalEmail, gradeResult);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    systemInstruction: {
      role: "system",
      parts: [{ text: REWRITER_PROMPT }],
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
  const validated = RewriteOutputSchema.parse(parsed);

  // Warn if projected score is low but still return it
  if (validated.projectedScore < 75) {
    console.warn(
      `[day11/rewrite] projected score ${validated.projectedScore} below target 75`
    );
  }

  return {
    rewrittenEmail: validated.rewrittenEmail.trim(),
    projectedScore: validated.projectedScore,
    explanation: validated.explanation,
  };
}

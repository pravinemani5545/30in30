import { z } from "zod";
import { getModelJson } from "@/lib/day10/ai/gemini";
import {
  ADVERSARIAL_REVIEWER_PROMPT,
  buildReviewPrompt,
} from "@/lib/day10/gemini/prompts";
import type { CodeReviewOutput, FindingSeverity } from "@/types/day10";

const FindingSchema = z.object({
  severity: z.string().transform((v) => v.toLowerCase() as FindingSeverity),
  category: z.enum(["bug", "security", "performance", "style"]),
  title: z.string().min(1),
  lineReference: z.string().min(1),
  severityRationale: z.string().min(1),
  description: z.string().min(1),
  suggestedFix: z.string().min(1),
});

const ReviewOutputSchema = z.object({
  confirmedLanguage: z.string(),
  totalLines: z.number(),
  summary: z.string(),
  hasRlsRisk: z.boolean(),
  findings: z.array(FindingSchema),
});

const SEVERITY_ORDER: Record<FindingSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export async function reviewCode(
  code: string,
  language: string,
  userId: string
): Promise<CodeReviewOutput> {
  const start = Date.now();

  const model = getModelJson();
  const userPrompt = buildReviewPrompt(code, language);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    systemInstruction: { role: "system", parts: [{ text: ADVERSARIAL_REVIEWER_PROMPT }] },
  });

  const raw = result.response.text();

  // Strip markdown fences + trailing commas
  let cleaned = raw
    .replace(/^```json\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
  cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

  const parsed = JSON.parse(cleaned);
  const validated = ReviewOutputSchema.parse(parsed);

  // Sort findings: critical first, low last
  validated.findings.sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity as FindingSeverity] -
      SEVERITY_ORDER[b.severity as FindingSeverity]
  );

  // Cap LOW at 2
  let lowCount = 0;
  validated.findings = validated.findings.filter((f) => {
    if (f.severity === "low") {
      lowCount++;
      return lowCount <= 2;
    }
    return true;
  });

  const reviewMs = Date.now() - start;

  // Log non-sensitive data only
  console.log(
    `[day10/review] user=${userId} lang=${language} findings=${validated.findings.length} ms=${reviewMs}`
  );

  return {
    ...validated,
    findings: validated.findings as CodeReviewOutput["findings"],
  };
}

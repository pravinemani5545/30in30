import { z } from "zod";
import { getModelJson } from "@/lib/day17/ai/gemini";
import { DELIVERABILITY_EXPLANATION_PROMPT } from "./prompts";
import type { AllCheckResults, ExplanationsOutput, Grade } from "@/types/day17";

const CheckExplanationSchema = z.object({
  explanation: z.string(),
  remediation: z.string().nullable(),
});

const ExplanationsSchema = z.object({
  overallSummary: z.string(),
  checks: z.object({
    spf: CheckExplanationSchema,
    dkim: CheckExplanationSchema,
    dmarc: CheckExplanationSchema,
    mx: CheckExplanationSchema,
    domainAge: CheckExplanationSchema,
  }),
});

export async function generateExplanations(
  domain: string,
  results: AllCheckResults,
  grade: Grade,
  score: number,
): Promise<ExplanationsOutput> {
  const model = getModelJson(DELIVERABILITY_EXPLANATION_PROMPT);

  const userPrompt = `Domain: ${domain}
Overall Grade: ${grade} (${score}/100)

SPF Check:
- Passed: ${results.spf.passed}
- Warning: ${results.spf.warning}
- Raw Record: ${results.spf.rawRecord ?? "None"}
- Details: ${results.spf.details}

DKIM Check:
- Passed: ${results.dkim.passed}
- Warning: ${results.dkim.warning}
- Raw Record: ${results.dkim.rawRecord ?? "None"}
- Selector Found: ${results.dkim.selectorFound ?? "None"}
- Details: ${results.dkim.details}

DMARC Check:
- Passed: ${results.dmarc.passed}
- Warning: ${results.dmarc.warning}
- Raw Record: ${results.dmarc.rawRecord ?? "None"}
- Details: ${results.dmarc.details}

MX Check:
- Passed: ${results.mx.passed}
- Warning: ${results.mx.warning}
- Raw Record: ${results.mx.rawRecord ?? "None"}
- Details: ${results.mx.details}

Domain Age Check:
- Passed: ${results.domainAge.passed}
- Warning: ${results.domainAge.warning}
- Raw Record: ${results.domainAge.rawRecord ?? "None"}
- Details: ${results.domainAge.details}`;

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();

  // Strip markdown fences if present
  const cleaned = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  const parsed = JSON.parse(cleaned);
  const validated = ExplanationsSchema.parse(parsed);

  return validated;
}

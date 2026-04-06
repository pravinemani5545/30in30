import { z } from "zod";
import { getModelJson, getActiveModelId } from "@/lib/day18/ai/gemini";
import { CLASSIFY_CHANGE_PROMPT, OUTREACH_PROMPT } from "./prompts";
import type { ClassifyOutput } from "@/types/day18";

const ClassifySchema = z.object({
  changeType: z.enum(["pricing", "feature", "hiring", "messaging", "other"]),
  summary: z.string(),
  beforeExcerpt: z.string(),
  afterExcerpt: z.string(),
  outreachPrompt: z.string(),
});

const OutreachSchema = z.object({
  outreachAngle: z.string(),
});

/**
 * Classify a detected change using Gemini 2.5 Flash.
 * Called ONLY when hash mismatch is confirmed.
 */
export async function classifyChange(
  domain: string,
  beforeText: string,
  afterText: string,
): Promise<ClassifyOutput> {
  const model = getModelJson(CLASSIFY_CHANGE_PROMPT);

  const userPrompt = `Domain: ${domain}

PREVIOUS VERSION (excerpt):
${beforeText.slice(0, 5000)}

CURRENT VERSION (excerpt):
${afterText.slice(0, 5000)}`;

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();
  const cleaned = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  const parsed = JSON.parse(cleaned);
  return ClassifySchema.parse(parsed);
}

/**
 * Generate a personalized outreach angle for a specific change.
 * Called on-demand from the dashboard (not in cron).
 */
export async function generateOutreach(
  domain: string,
  changeSummary: string,
): Promise<string> {
  const model = getModelJson(OUTREACH_PROMPT);

  const userPrompt = `Domain: ${domain}
Change summary: ${changeSummary}`;

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();
  const cleaned = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  const parsed = JSON.parse(cleaned);
  const validated = OutreachSchema.parse(parsed);
  return validated.outreachAngle;
}

export { getActiveModelId };

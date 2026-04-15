import { getModelJson } from "@/lib/day29/ai/gemini";
import { companyEnrichmentSchema } from "@/lib/day29/validations";
import type { CompanyEnrichment } from "@/types/day29";

const SYSTEM_PROMPT = `You are a company research analyst. Given a company name or URL, generate a comprehensive company profile. Be realistic and detailed.

Return valid JSON matching this schema:
{
  "name": "string (official company name)",
  "industry": "string (primary industry)",
  "size": "string (e.g. '1,000-5,000 employees', 'Series B startup')",
  "description": "string (2-3 sentence company description)",
  "keyProducts": ["string (list of 3-5 key products or services)"],
  "painPoints": ["string (list of 3-5 likely business pain points)"],
  "recentNews": ["string (list of 2-4 plausible recent news items)"]
}`;

export async function enrichCompany(
  companyInput: string,
): Promise<CompanyEnrichment> {
  const model = getModelJson(SYSTEM_PROMPT);

  const userPrompt = `Generate a comprehensive company profile for: ${companyInput}`;

  const result = await model.generateContent(userPrompt);
  const raw = result.response.text();

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No valid JSON found in Gemini response (enrichment)");
  }
  const jsonStr = raw.slice(firstBrace, lastBrace + 1);

  const parsed = JSON.parse(jsonStr);
  return companyEnrichmentSchema.parse(parsed);
}

import { getModelJson } from "@/lib/day29/ai/gemini";
import { outreachDraftSchema } from "@/lib/day29/validations";
import type { CompanyEnrichment, OutreachDraft } from "@/types/day29";

const SYSTEM_PROMPT = `You are an expert B2B sales copywriter. Given a company profile, generate a personalized cold outreach email draft. The email should be conversational, value-driven, and reference specific details about the company. Avoid generic templates.

Return valid JSON matching this schema:
{
  "subject": "string (compelling email subject line, under 60 chars)",
  "body": "string (full email body, 150-250 words, with line breaks as \\n)",
  "personalization": ["string (list of 3-4 specific personalization hooks used)"],
  "callToAction": "string (the specific CTA at the end of the email)"
}`;

export async function generateOutreach(
  enrichment: CompanyEnrichment,
): Promise<OutreachDraft> {
  const model = getModelJson(SYSTEM_PROMPT);

  const userPrompt = `Generate a personalized outreach email for this company:

COMPANY PROFILE:
- Name: ${enrichment.name}
- Industry: ${enrichment.industry}
- Size: ${enrichment.size}
- Description: ${enrichment.description}
- Key Products: ${enrichment.keyProducts.join(", ")}
- Pain Points: ${enrichment.painPoints.join(", ")}
- Recent News: ${enrichment.recentNews.join("; ")}`;

  const result = await model.generateContent(userPrompt);
  const raw = result.response.text();

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No valid JSON found in Gemini response (outreach)");
  }
  const jsonStr = raw.slice(firstBrace, lastBrace + 1);

  const parsed = JSON.parse(jsonStr);
  return outreachDraftSchema.parse(parsed);
}

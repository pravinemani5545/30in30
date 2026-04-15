import { getModelJson } from "@/lib/day29/ai/gemini";
import { campaignPreviewSchema } from "@/lib/day29/validations";
import type {
  CompanyEnrichment,
  EmailSequence,
  CampaignPreview,
} from "@/types/day29";

const SYSTEM_PROMPT = `You are a campaign strategist. Given a company profile and an email sequence, generate a campaign preview with a creative campaign name, target persona, estimated metrics, and a concise summary.

Return valid JSON matching this schema:
{
  "campaignName": "string (creative campaign name, e.g. 'Operation Growth Engine')",
  "targetPersona": "string (specific target persona, e.g. 'VP of Engineering at mid-market SaaS')",
  "totalEmails": number,
  "estimatedDuration": "string (e.g. '12 days')",
  "keyMetrics": ["string (list of 4-6 estimated campaign metrics, e.g. 'Open rate: 35-45%')"],
  "summary": "string (3-4 sentence campaign summary explaining the approach and expected outcomes)"
}`;

export async function generateCampaign(
  enrichment: CompanyEnrichment,
  sequence: EmailSequence,
): Promise<CampaignPreview> {
  const model = getModelJson(SYSTEM_PROMPT);

  const emailSummaries = sequence.emails
    .map((e) => `Day ${e.day}: "${e.subject}" (${e.intent})`)
    .join("\n");

  const userPrompt = `Generate a campaign preview for this company and sequence:

COMPANY:
- Name: ${enrichment.name}
- Industry: ${enrichment.industry}
- Size: ${enrichment.size}
- Pain Points: ${enrichment.painPoints.join(", ")}

EMAIL SEQUENCE (${sequence.emails.length} emails):
${emailSummaries}

STRATEGY: ${sequence.strategy}`;

  const result = await model.generateContent(userPrompt);
  const raw = result.response.text();

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No valid JSON found in Gemini response (campaign)");
  }
  const jsonStr = raw.slice(firstBrace, lastBrace + 1);

  const parsed = JSON.parse(jsonStr);
  return campaignPreviewSchema.parse(parsed);
}

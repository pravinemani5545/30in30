import { getModelJson } from "@/lib/day29/ai/gemini";
import { emailSequenceSchema } from "@/lib/day29/validations";
import type {
  CompanyEnrichment,
  OutreachDraft,
  EmailSequence,
} from "@/types/day29";

const SYSTEM_PROMPT = `You are a sales email sequence strategist. Given a company profile and an initial outreach email, create a 5-email follow-up sequence. Each email should build on the previous one with different angles and increasing urgency. Use a proven cadence (days 1, 3, 5, 8, 12).

Return valid JSON matching this schema:
{
  "emails": [
    {
      "day": number,
      "subject": "string (email subject)",
      "body": "string (full email body, 100-200 words, with line breaks as \\n)",
      "intent": "string (e.g. 'initial outreach', 'value add', 'social proof', 'urgency', 'breakup')"
    }
  ],
  "strategy": "string (2-3 sentence description of the overall sequence strategy)"
}`;

export async function generateSequence(
  enrichment: CompanyEnrichment,
  outreach: OutreachDraft,
): Promise<EmailSequence> {
  const model = getModelJson(SYSTEM_PROMPT);

  const userPrompt = `Create a 5-email follow-up sequence for this company and initial outreach:

COMPANY:
- Name: ${enrichment.name}
- Industry: ${enrichment.industry}
- Pain Points: ${enrichment.painPoints.join(", ")}

INITIAL OUTREACH:
- Subject: ${outreach.subject}
- Body: ${outreach.body}
- CTA: ${outreach.callToAction}
- Personalization Hooks: ${outreach.personalization.join(", ")}`;

  const result = await model.generateContent(userPrompt);
  const raw = result.response.text();

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No valid JSON found in Gemini response (sequence)");
  }
  const jsonStr = raw.slice(firstBrace, lastBrace + 1);

  const parsed = JSON.parse(jsonStr);
  return emailSequenceSchema.parse(parsed);
}

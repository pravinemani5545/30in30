import { getModelJson } from "@/lib/day15/ai/gemini";
import {
  SEQUENCE_SYSTEM_PROMPT,
  buildSequencePrompt,
} from "@/lib/day15/gemini/prompts";
import { SequenceOutputSchema } from "@/lib/day15/validations/sequences";
import { detectFollowupLanguage } from "@/lib/day15/sequence/detector";
import { SEQUENCE_EMAIL_ORDER } from "@/lib/day15/sequence/arc";
import type { SequenceOutput } from "@/types/day15";

export async function generateSequence(
  persona: string,
  valueProp: string,
  socialProof: string,
  observation?: string,
): Promise<SequenceOutput> {
  const model = getModelJson(SEQUENCE_SYSTEM_PROMPT);
  const userPrompt = buildSequencePrompt(
    persona,
    valueProp,
    socialProof,
    observation,
  );

  const result = await model.generateContent(userPrompt);
  const raw = result.response.text();

  // Fence strip
  const cleaned = raw
    .replace(/^```json\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  const parsed = JSON.parse(cleaned);
  const validated = SequenceOutputSchema.parse(parsed);

  // Verify correct email order
  for (let i = 0; i < 5; i++) {
    if (validated.emails[i].emailType !== SEQUENCE_EMAIL_ORDER[i]) {
      throw new Error(
        `Email ${i + 1} has wrong type: expected ${SEQUENCE_EMAIL_ORDER[i]}, got ${validated.emails[i].emailType}`,
      );
    }
  }

  // Post-process: run followup detector + recount words
  const emails = validated.emails.map((email) => ({
    ...email,
    hasFollowupLanguage: detectFollowupLanguage(email.body),
    wordCount: email.body.split(/\s+/).filter(Boolean).length,
  }));

  return {
    sequenceSummary: validated.sequenceSummary,
    pivotAngle: validated.pivotAngle,
    emails,
  };
}

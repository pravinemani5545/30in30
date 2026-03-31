import { getModelJson } from "@/lib/day13/ai/gemini";
import { ICP_SYNTHESIS_PROMPT, buildSynthesisPrompt } from "@/lib/day13/gemini/prompts";
import { SynthesisOutputSchema } from "@/lib/day13/validations/profiles";
import type { SynthesisOutput } from "@/types/day13";

export async function synthesiseICP(
  companyName: string,
  answers: Record<string, string>,
): Promise<SynthesisOutput> {
  const model = getModelJson(ICP_SYNTHESIS_PROMPT);
  const userPrompt = buildSynthesisPrompt(companyName, answers);

  const result = await model.generateContent(userPrompt);
  const raw = result.response.text();

  // Fence strip + parse
  const clean = raw
    .replace(/^```json\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  const parsed = JSON.parse(clean);

  // Trim objection map to 3 max
  if (Array.isArray(parsed.objectionMap) && parsed.objectionMap.length > 3) {
    parsed.objectionMap = parsed.objectionMap.slice(0, 3);
  }

  // Zod validate
  const validated = SynthesisOutputSchema.parse(parsed);
  return validated;
}

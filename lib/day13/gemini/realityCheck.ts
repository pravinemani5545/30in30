import { getModelText } from "@/lib/day13/ai/gemini";
import { REALITY_CHECK_PROMPT, buildRealityCheckPrompt } from "@/lib/day13/gemini/prompts";
import type { SynthesisOutput } from "@/types/day13";

const REALITY_CHECK_QUESTION =
  "Does this match the customers who have paid you money, or the customers you hope will pay you?";

export async function generateRealityCheck(
  synthesis: SynthesisOutput,
  answers: Record<string, string>,
): Promise<string> {
  const model = getModelText(REALITY_CHECK_PROMPT);
  const userPrompt = buildRealityCheckPrompt(synthesis, answers);

  const result = await model.generateContent(userPrompt);
  let text = result.response.text().trim();

  // Ensure the reality check question is present at the end
  if (!text.includes(REALITY_CHECK_QUESTION)) {
    text = `${text}\n\n${REALITY_CHECK_QUESTION}`;
  }

  return text;
}

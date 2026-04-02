import { getModelJson } from "@/lib/day14/ai/gemini";
import {
  HOOK_VALIDATION_PROMPT,
  buildHookValidationPrompt,
} from "./prompts";
import { HookValidationResultSchema } from "@/lib/day14/validations/scripts";

interface HookValidationResult {
  quality: "strong" | "weak";
  reasoning: string;
  hookText: string;
}

export async function validateHook(
  hookText: string,
): Promise<HookValidationResult> {
  const model = getModelJson(HOOK_VALIDATION_PROMPT);
  const result = await model.generateContent(
    buildHookValidationPrompt(hookText),
  );
  const raw = result.response.text();
  const clean = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  const parsed = JSON.parse(clean);
  return HookValidationResultSchema.parse(parsed);
}

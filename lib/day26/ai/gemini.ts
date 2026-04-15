import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerEnv } from "@/lib/env";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (genAI) return genAI;
  const env = getServerEnv();
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for Day 26");
  }
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return genAI;
}

const DEFAULT_MODEL = "gemini-2.5-flash";

function getModelId(): string {
  const env = getServerEnv();
  return env.GEMINI_MODEL ?? DEFAULT_MODEL;
}

/**
 * Execute a single agent: Gemini call with system prompt + user input.
 * Returns natural language text (NOT JSON mode).
 */
export async function executeAgent(
  systemPrompt: string,
  input: string,
): Promise<string> {
  const model = getGenAI().getGenerativeModel({
    model: getModelId(),
    generationConfig: {
      maxOutputTokens: 2048,
    },
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(input);
  const text = result.response.text();

  if (!text || text.trim().length === 0) {
    throw new Error("Agent returned empty response");
  }

  return text.trim();
}

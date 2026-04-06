import { GoogleGenAI } from "@google/genai";
import { getServerEnv } from "@/lib/env";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (genAI) return genAI;
  const env = getServerEnv();
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for Day 19");
  }
  genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  return genAI;
}

const DEFAULT_MODEL = "gemini-2.5-flash";

function getModelId(): string {
  const env = getServerEnv();
  return env.GEMINI_MODEL ?? DEFAULT_MODEL;
}

export async function generateJson(
  systemInstruction: string,
  userPrompt: string,
): Promise<string> {
  const ai = getGenAI();
  const response = await ai.models.generateContent({
    model: getModelId(),
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      maxOutputTokens: 65536,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });
  return response.text ?? "";
}

export function getActiveModelId(): string {
  return getModelId();
}

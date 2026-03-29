import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerEnv } from "@/lib/env";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (genAI) return genAI;
  const env = getServerEnv();
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for Day 12");
  }
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return genAI;
}

const DEFAULT_MODEL = "gemini-2.5-flash";

function getModelId(): string {
  const env = getServerEnv();
  return env.GEMINI_MODEL ?? DEFAULT_MODEL;
}

export function getModelJson(systemInstruction?: string, overrideModel?: string) {
  return getGenAI().getGenerativeModel({
    model: overrideModel ?? getModelId(),
    generationConfig: { responseMimeType: "application/json" },
    ...(systemInstruction ? { systemInstruction } : {}),
  });
}

export async function generateJson<T>(
  userPrompt: string,
  systemInstruction?: string,
  model?: string,
): Promise<T> {
  const result = await getModelJson(systemInstruction, model).generateContent(
    userPrompt,
  );
  const raw = result.response.text();
  const clean = raw
    .replace(/^```json\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
  return JSON.parse(clean) as T;
}

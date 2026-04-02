import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerEnv } from "@/lib/env";

let genAI: GoogleGenerativeAI | null = null;

function getGeminiApiKey() {
  const env = getServerEnv();
  return env.GEMINI_API_KEY ?? env.GOOGLE_GENERATIVE_AI_API_KEY ?? null;
}

function getGenAI() {
  if (genAI) return genAI;
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "A Gemini API key is required for Day 14 (set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY)",
    );
  }
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

const DEFAULT_MODEL = "gemini-2.5-flash";

function getModelId(): string {
  const env = getServerEnv();
  return env.GEMINI_MODEL ?? DEFAULT_MODEL;
}

export function getModelJson(systemInstruction: string) {
  return getGenAI().getGenerativeModel({
    model: getModelId(),
    generationConfig: { responseMimeType: "application/json" },
    systemInstruction,
  });
}

export function getModelText(systemInstruction: string) {
  return getGenAI().getGenerativeModel({
    model: getModelId(),
    systemInstruction,
  });
}

export function getActiveModelId(): string {
  return getModelId();
}

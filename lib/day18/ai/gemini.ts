import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerEnv } from "@/lib/env";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (genAI) return genAI;
  const env = getServerEnv();
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for Day 18");
  }
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
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

export function getActiveModelId(): string {
  return getModelId();
}

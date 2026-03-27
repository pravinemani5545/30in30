import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerEnv } from "@/lib/env";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (genAI) return genAI;
  const env = getServerEnv();
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for Day 10");
  }
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return genAI;
}

const DEFAULT_MODEL = "gemini-2.5-flash-preview-05-20";

function getModelId(): string {
  const env = getServerEnv();
  return env.GEMINI_MODEL ?? DEFAULT_MODEL;
}

export function getModel(overrideModel?: string) {
  return getGenAI().getGenerativeModel({
    model: overrideModel ?? getModelId(),
  });
}

export function getModelJson(overrideModel?: string) {
  return getGenAI().getGenerativeModel({
    model: overrideModel ?? getModelId(),
    generationConfig: { responseMimeType: "application/json" },
  });
}

export async function generateText(
  prompt: string,
  model?: string
): Promise<string> {
  const result = await getModel(model).generateContent(prompt);
  return result.response.text();
}

export async function generateJson<T>(
  prompt: string,
  model?: string
): Promise<T> {
  const result = await getModelJson(model).generateContent(prompt);
  const raw = result.response.text();
  const clean = raw
    .replace(/^```json\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
  return JSON.parse(clean) as T;
}

import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGemini() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

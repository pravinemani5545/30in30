import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerEnv } from "@/lib/env";
import { classifyResultSchema } from "@/lib/day21/validations";
import type { ClassifyResult } from "@/types/day21";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (genAI) return genAI;
  const env = getServerEnv();
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required for Day 21");
  }
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return genAI;
}

const DEFAULT_MODEL = "gemini-2.5-flash";

function getModelId(): string {
  const env = getServerEnv();
  return env.GEMINI_MODEL ?? DEFAULT_MODEL;
}

export function getActiveModelId(): string {
  return getModelId();
}

const SYSTEM_PROMPT = `You are an expert email reply classifier for sales and outreach teams.

Given an email reply, classify it into exactly ONE of these 5 categories:

1. "interested" — The person expresses interest, wants to learn more, asks for a demo, agrees to a meeting, or gives a positive signal.
2. "not_now" — The person declines but leaves the door open (e.g. "not right now", "maybe later", "check back in Q2").
3. "question" — The person asks a question about the product, pricing, features, or next steps without clearly committing.
4. "out_of_office" — Auto-reply or manual OOO message indicating the person is away.
5. "unsubscribe" — The person wants to be removed from the list, asks to stop emailing, or expresses annoyance/anger.

Return a JSON object with:
- "category": one of the 5 categories above
- "confidence": a number between 0 and 1 indicating how confident you are
- "reasoning": a brief 1-2 sentence explanation of why you chose this category

Be precise. When in doubt between categories, pick the one that best matches the primary intent of the reply.`;

export async function classifyReply(
  replyText: string,
  sender?: string,
): Promise<ClassifyResult> {
  const model = getGenAI().getGenerativeModel({
    model: getModelId(),
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 1024,
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  const userPrompt = sender
    ? `Sender: ${sender}\n\nReply:\n${replyText}`
    : `Reply:\n${replyText}`;

  const result = await model.generateContent(userPrompt);
  const raw = result.response.text();

  // Extract JSON: first { to last }
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in Gemini response");
  }

  const jsonStr = raw.slice(start, end + 1);
  const parsed = JSON.parse(jsonStr);
  return classifyResultSchema.parse(parsed);
}

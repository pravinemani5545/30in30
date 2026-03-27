import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, buildQueryPrompt } from "./prompts";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  return genAI;
}

interface AnswerResult {
  answer: string | null;
  noRelevantContent: boolean;
}

/**
 * Call Gemini 2.0 Flash with grounded context and return the answer.
 * Handles NO_RELEVANT_CONTENT detection as a second empty-retrieval path.
 */
export async function getAnswer(
  contextString: string,
  question: string
): Promise<AnswerResult> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
  });

  const userPrompt = buildQueryPrompt(contextString, question);
  const result = await model.generateContent(userPrompt);
  const text = result.response.text().trim();

  if (text === "NO_RELEVANT_CONTENT") {
    return { answer: null, noRelevantContent: true };
  }

  return { answer: text, noRelevantContent: false };
}

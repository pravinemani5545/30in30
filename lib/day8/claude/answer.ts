import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildQueryPrompt } from "./prompts";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

interface AnswerResult {
  answer: string | null;
  noRelevantContent: boolean;
}

/**
 * Call Claude Sonnet with grounded context and return the answer.
 * Handles NO_RELEVANT_CONTENT detection as a second empty-retrieval path.
 */
export async function getAnswer(
  contextString: string,
  question: string
): Promise<AnswerResult> {
  const anthropic = getClient();
  const userPrompt = buildQueryPrompt(contextString, question);

  const response = await anthropic.messages.create(
    {
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    },
    { signal: AbortSignal.timeout(30000) }
  );

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  if (text.trim() === "NO_RELEVANT_CONTENT") {
    return { answer: null, noRelevantContent: true };
  }

  return { answer: text, noRelevantContent: false };
}

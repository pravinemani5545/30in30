import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import type { HNStory, SummarizedStory } from "@/types";
import { SYSTEM_PROMPT, buildSummarizePrompt } from "./prompts";

function getGemini() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING },
    relevanceScore: { type: SchemaType.NUMBER },
    reason: { type: SchemaType.STRING },
  },
  required: ["summary", "relevanceScore", "reason"],
};

export async function summarizeStory(
  story: HNStory
): Promise<SummarizedStory> {
  try {
    const model = getGemini().getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const result = await model.generateContent(buildSummarizePrompt(story));
    const parsed = JSON.parse(result.response.text());

    if (!parsed) {
      return {
        ...story,
        summary: story.title,
        relevanceScore: 5,
        reason: "parse_failed",
        parseError: true,
      };
    }

    return {
      ...story,
      summary: parsed.summary,
      relevanceScore: Math.max(1, Math.min(10, parsed.relevanceScore)),
      reason: parsed.reason,
    };
  } catch (error) {
    console.warn(`Summarize failed for story ${story.id}:`, error);
    return {
      ...story,
      summary: story.title,
      relevanceScore: 5,
      reason: "summarize_failed",
      parseError: true,
    };
  }
}

export async function summarizeAllStories(
  stories: HNStory[]
): Promise<SummarizedStory[]> {
  const results = await Promise.allSettled(stories.map(summarizeStory));

  const summarized = results
    .filter(
      (r): r is PromiseFulfilledResult<SummarizedStory> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);

  // Sort by relevance score descending
  return summarized.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

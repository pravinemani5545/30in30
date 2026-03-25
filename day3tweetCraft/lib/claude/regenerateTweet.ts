import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from "@google/generative-ai";
import type { TweetType } from "@/types";
import { SYSTEM_PROMPT, buildRegeneratePrompt } from "./prompts";

interface SingleTweetOutput {
  tweetType: TweetType;
  content: string;
  characterCount: number;
  hookScore: number;
  hookAnalysis: string;
  retweetPotential: number;
  replyBait: number;
  savesPotential: number;
  whyThisWorks: string;
  potentialWeakness: string;
}

const singleTweetSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    tweetType: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["hook", "story", "stat", "contrarian", "listicle"],
    },
    content: { type: SchemaType.STRING },
    characterCount: { type: SchemaType.INTEGER },
    hookScore: { type: SchemaType.INTEGER },
    hookAnalysis: { type: SchemaType.STRING },
    retweetPotential: { type: SchemaType.INTEGER },
    replyBait: { type: SchemaType.INTEGER },
    savesPotential: { type: SchemaType.INTEGER },
    whyThisWorks: { type: SchemaType.STRING },
    potentialWeakness: { type: SchemaType.STRING },
  },
  required: [
    "tweetType",
    "content",
    "characterCount",
    "hookScore",
    "hookAnalysis",
    "retweetPotential",
    "replyBait",
    "savesPotential",
    "whyThisWorks",
    "potentialWeakness",
  ],
};

function getGemini() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

function countTweetChars(content: string): number {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return content.replace(urlRegex, "x".repeat(23)).length;
}

function truncateToLimit(content: string): string {
  const twitterLimit = 280;
  if (countTweetChars(content) <= twitterLimit) return content;
  const words = content.split(" ");
  let result = "";
  for (const word of words) {
    const candidate = result ? result + " " + word : word;
    if (countTweetChars(candidate + "...") <= twitterLimit) {
      result = candidate;
    } else {
      break;
    }
  }
  return result + "...";
}

export async function regenerateTweet(
  article: { title: string; domain: string; mainContent: string },
  tweetType: TweetType,
  previousContent: string
): Promise<SingleTweetOutput> {
  const gemini = getGemini();

  const contentSnippet = article.mainContent.slice(0, 2000);

  const model = gemini.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: singleTweetSchema,
    },
  });

  const result = await model.generateContent(
    buildRegeneratePrompt(
      { title: article.title, domain: article.domain, contentSnippet },
      tweetType,
      previousContent
    )
  );

  const parsed = JSON.parse(result.response.text()) as SingleTweetOutput;
  if (!parsed) throw new Error("Gemini returned no structured output");

  const content = truncateToLimit(parsed.content);
  const characterCount = countTweetChars(content);

  return { ...parsed, content, characterCount };
}

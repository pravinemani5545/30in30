import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { ClaudeGenerateOutput, ParsedArticle } from "@/types";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

const tweetVariationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    variationNumber: { type: SchemaType.INTEGER },
    tweetType: {
      type: SchemaType.STRING,
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
    "variationNumber",
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

const generateOutputSchema = {
  type: SchemaType.OBJECT,
  properties: {
    articleSummary: { type: SchemaType.STRING },
    keyInsights: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    tweets: {
      type: SchemaType.ARRAY,
      items: tweetVariationSchema,
    },
  },
  required: ["articleSummary", "keyInsights", "tweets"],
};

function getGemini() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

// Re-count characters server-side (Twitter: URLs = 23 chars)
function countTweetChars(content: string): number {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return content.replace(urlRegex, "x".repeat(23)).length;
}

// Truncate tweet to fit within 280 chars
function truncateToLimit(content: string): string {
  const twitterLimit = 280;
  if (countTweetChars(content) <= twitterLimit) return content;

  // Truncate at word boundary
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

export async function generateTweets(
  article: ParsedArticle,
  generationId?: string
): Promise<ClaudeGenerateOutput> {
  const gemini = getGemini();
  const startedAt = Date.now();

  const model = gemini.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: generateOutputSchema,
    },
  });

  const result = await model.generateContent(buildUserPrompt(article));
  const duration = Date.now() - startedAt;

  const parsed = JSON.parse(result.response.text()) as ClaudeGenerateOutput;

  if (!parsed || !parsed.tweets) {
    throw new Error("Gemini returned no structured output");
  }

  // Validate and fix character counts server-side
  const validatedTweets = parsed.tweets.map((tweet) => {
    const actual = countTweetChars(tweet.content);
    if (actual !== tweet.characterCount) {
      console.warn(`[gemini] Character count mismatch for tweet ${tweet.variationNumber}: Gemini said ${tweet.characterCount}, actual ${actual}`);
    }

    const content = truncateToLimit(tweet.content);
    const characterCount = countTweetChars(content);

    return { ...tweet, content, characterCount };
  });

  console.info("[gemini] generateTweets complete", {
    generationId,
    durationMs: duration,
    contentQuality: article.contentQuality,
    hookScores: validatedTweets.map((t) => t.hookScore),
  });

  return {
    ...parsed,
    tweets: validatedTweets,
  };
}

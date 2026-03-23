import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { PitchAnalysisSchema, type PitchAnalysis } from "@/types";

const SYSTEM_PROMPT = `You are a brutally honest startup pitch critic with 20 years of experience evaluating thousands of startup one-liners for YC, a16z, and Techstars. You do not give false encouragement. You identify exactly what is wrong and why it fails to communicate, then show exactly how to fix it.

Score the pitch on five dimensions (0-20 each, total 0-100):
- Clarity (0-20): Can a stranger understand what this does in 5 seconds?
- Specificity (0-20): Does it name the actual customer and actual problem?
- Differentiation (0-20): Does it imply why this is different or better?
- Audience fit (0-20): Is the language right for investors/customers/press?
- Memorability (0-20): Will they remember it in 24 hours?

For the critique: be direct, specific, and reference the actual words used. Do not say "consider" or "perhaps" — say what is wrong and why.

For each improvement: rewrite the pitch entirely. Then explain your reasoning in one sentence. Then name the single most important thing you changed.

You MUST return exactly 3 improvements.

The average score for a founder's first draft is 23/100. Be calibrated. Most pitches are bad. A score above 70 is genuinely rare.`;

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    score: { type: SchemaType.NUMBER, description: "Overall score 0-100" },
    verdict: { type: SchemaType.STRING, description: "One punchy sentence summary" },
    dimension_scores: {
      type: SchemaType.OBJECT,
      properties: {
        clarity: { type: SchemaType.NUMBER },
        specificity: { type: SchemaType.NUMBER },
        differentiation: { type: SchemaType.NUMBER },
        audience_fit: { type: SchemaType.NUMBER },
        memorability: { type: SchemaType.NUMBER },
      },
      required: ["clarity", "specificity", "differentiation", "audience_fit", "memorability"],
    },
    critique: { type: SchemaType.STRING, description: "2-4 sentences, direct and specific" },
    improvements: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          rewrite: { type: SchemaType.STRING },
          reasoning: { type: SchemaType.STRING },
          what_changed: { type: SchemaType.STRING },
        },
        required: ["rewrite", "reasoning", "what_changed"],
      },
    },
  },
  required: ["score", "verdict", "dimension_scores", "critique", "improvements"],
};

function getGemini() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

export async function analyzePitch(
  pitch: string,
  context?: string
): Promise<PitchAnalysis> {
  const userContent = context
    ? `Analyze this startup one-liner: "${pitch}"\n\nContext: ${context}`
    : `Analyze this startup one-liner: "${pitch}"`;

  const model = getGemini().getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const result = await model.generateContent(userContent);
  const text = result.response.text();
  const parsed = PitchAnalysisSchema.parse(JSON.parse(text));
  return parsed;
}

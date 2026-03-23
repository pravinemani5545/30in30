import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { RawProfileData, EnrichmentResult } from "@/types";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/claude/prompts";

// Gemini response schema (equivalent to the previous Zod schema)
const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    person: {
      type: SchemaType.OBJECT,
      properties: {
        fullName: { type: SchemaType.STRING },
        headline: { type: SchemaType.STRING },
        location: { type: SchemaType.STRING },
        summary: { type: SchemaType.STRING },
        keyTalkingPoints: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: ["fullName", "headline", "location", "summary", "keyTalkingPoints"],
    },
    company: {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING },
        domain: { type: SchemaType.STRING },
        industry: { type: SchemaType.STRING },
        estimatedSize: { type: SchemaType.STRING },
        description: { type: SchemaType.STRING },
        recentSignals: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: ["name", "domain", "industry", "estimatedSize", "description", "recentSignals"],
    },
    followUpSuggestions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          tone: {
            type: SchemaType.STRING,
            enum: ["warm", "direct", "casual"],
          },
          message: { type: SchemaType.STRING },
        },
        required: ["tone", "message"],
      },
    },
    enrichmentConfidence: {
      type: SchemaType.STRING,
      enum: ["high", "medium", "low"],
    },
    enrichmentNotes: { type: SchemaType.STRING },
  },
  required: ["person", "company", "followUpSuggestions", "enrichmentConfidence", "enrichmentNotes"],
};

function getGemini() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

export async function enrichContact(
  profile: RawProfileData,
  contactId?: string
): Promise<EnrichmentResult> {
  const startedAt = Date.now();

  const model = getGemini().getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const result = await model.generateContent(buildUserPrompt(profile));
  const duration = Date.now() - startedAt;

  const parsed = JSON.parse(result.response.text()) as EnrichmentResult;

  if (!parsed) {
    throw new Error("Gemini returned no structured output");
  }

  console.info("[gemini] Enrichment complete", {
    contactId,
    duration,
    confidence: parsed.enrichmentConfidence,
  });

  return parsed;
}

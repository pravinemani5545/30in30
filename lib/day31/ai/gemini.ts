import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerEnv } from "@/lib/env";
import { extractionResultSchema } from "@/lib/day31/validations/products";
import type { ExtractionResult } from "@/types/day31";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (genAI) return genAI;
  const env = getServerEnv();
  const apiKey = env.GEMINI_API_KEY || env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is required for Day 31 PriceTracker",
    );
  }
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

function getModelId(): string {
  const env = getServerEnv();
  return env.GEMINI_MODEL ?? "gemini-2.5-flash";
}

const SYSTEM_PROMPT = `You are a price extraction assistant. You receive HTML from a product page. Extract the current price and stock status.

Rules:
- Return the CURRENT price, not the original/was price
- If you see a sale price and a regular price, return the sale price
- For price ranges (e.g. '$20-$30'), return the lower price
- For 'from $X' pricing, return X
- If no clear price exists or you are uncertain: return null for price
- For availability: 'in_stock', 'out_of_stock', or 'unknown'
- Signs of out_of_stock: 'Sold Out', 'Out of Stock', 'Unavailable', disabled Add to Cart button, 'Notify me when available'
- If you cannot determine availability with confidence: return 'unknown'
- NEVER estimate or guess. Return null when uncertain.

Return JSON with this shape:
{"price": number | null, "currency": string | null, "availability": "in_stock" | "out_of_stock" | "unknown", "product_name": string | null, "confidence": "high" | "medium" | "low"}`;

const NULL_RESULT: ExtractionResult = {
  price: null,
  currency: null,
  availability: "unknown",
  product_name: null,
  confidence: "low",
};

export async function extractPriceData(
  cleanedHtml: string,
): Promise<ExtractionResult> {
  if (!cleanedHtml) return NULL_RESULT;

  try {
    const model = getGenAI().getGenerativeModel({
      model: getModelId(),
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 1024,
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(
      `Extract the price and availability from this product page HTML:\n\n${cleanedHtml}`,
    );

    const raw = result.response.text();

    // Extract JSON from response — Gemini may wrap it in markdown or prefix with text
    let jsonStr = raw.trim();
    // Strip markdown code fences
    jsonStr = jsonStr.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    // Find first { and last } to extract JSON object
    const firstBrace = jsonStr.indexOf("{");
    const lastBrace = jsonStr.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(jsonStr);

    // Normalize availability — Gemini sometimes returns "In Stock" instead of "in_stock"
    if (typeof parsed.availability === "string") {
      const av = parsed.availability.toLowerCase().trim();
      if (av === "in stock" || av === "in_stock" || av === "instock") {
        parsed.availability = "in_stock";
      } else if (
        av === "out of stock" ||
        av === "out_of_stock" ||
        av === "outofstock" ||
        av === "sold out" ||
        av === "sold_out"
      ) {
        parsed.availability = "out_of_stock";
      } else {
        parsed.availability = "unknown";
      }
    }

    // Normalize currency — accept "$" as "USD"
    if (parsed.currency === "$") parsed.currency = "USD";
    if (parsed.currency === "C$" || parsed.currency === "CAD") parsed.currency = "CAD";

    const validated = extractionResultSchema.parse(parsed);
    return validated;
  } catch {
    return NULL_RESULT;
  }
}

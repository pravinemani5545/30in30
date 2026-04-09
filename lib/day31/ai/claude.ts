import Anthropic from "@anthropic-ai/sdk";
import { getServerEnv } from "@/lib/env";
import { extractionResultSchema } from "@/lib/day31/validations/products";
import type { ExtractionResult } from "@/types/day31";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  const env = getServerEnv();
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is required for Day 31 PriceTracker");
  }
  client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  return client;
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

Return ONLY this JSON (no markdown fences, no extra text):
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

  const env = getServerEnv();
  const model = env.CLAUDE_MODEL ?? "claude-sonnet-4-6";
  const anthropic = getClient();

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Extract the price and availability from this product page HTML:\n\n${cleanedHtml}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Strip markdown fences if present
    const jsonStr = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(jsonStr);
    const validated = extractionResultSchema.parse(parsed);
    return validated;
  } catch {
    return NULL_RESULT;
  }
}

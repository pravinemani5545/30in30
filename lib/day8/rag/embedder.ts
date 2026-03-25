import OpenAI from "openai";

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMENSIONS = 1536;
export const EMBEDDING_BATCH_SIZE = 100;

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

/**
 * Embed a batch of text strings using text-embedding-3-small.
 * Splits into sub-batches of EMBEDDING_BATCH_SIZE and processes in parallel.
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  const client = getClient();
  const batches: string[][] = [];

  for (let i = 0; i < texts.length; i += EMBEDDING_BATCH_SIZE) {
    batches.push(texts.slice(i, i + EMBEDDING_BATCH_SIZE));
  }

  const results = await Promise.allSettled(
    batches.map(async (batch) => {
      const response = await client.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch,
        dimensions: EMBEDDING_DIMENSIONS,
      });
      return response.data.map((d) => d.embedding);
    })
  );

  const embeddings: number[][] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      embeddings.push(...result.value);
    } else {
      console.error("Embedding batch failed:", result.reason);
      throw new Error(
        `Embedding failed: ${result.reason instanceof Error ? result.reason.message : "Unknown error"}`
      );
    }
  }

  // Cost estimation logging
  const totalChars = texts.reduce((sum, t) => sum + t.length, 0);
  const estimatedTokens = Math.ceil(totalChars / 4);
  const estimatedCost = (estimatedTokens / 1_000_000) * 0.02;
  console.log(
    `[embedder] ${texts.length} texts, ~${estimatedTokens} tokens, ~$${estimatedCost.toFixed(4)}`
  );

  return embeddings;
}

/**
 * Embed a single text string (for query embedding).
 */
export async function embedSingle(text: string): Promise<number[]> {
  const client = getClient();
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return response.data[0].embedding;
}

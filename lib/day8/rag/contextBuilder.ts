import type { RetrievedChunk, RAGContext } from "@/types/day8";

/** Maximum tokens of retrieved content to send to Claude.
 *  Fix 3: prevents context overflow and maintains answer coherence.
 *  Leaves room for system prompt (~500), question (~50), answer (~500). */
export const MAX_CONTEXT_TOKENS = 6000;

/** Approximate conversion: 4 chars ≈ 1 token */
const TOKENS_PER_CHAR = 0.25;

function estimateTokens(text: string): number {
  return Math.ceil(text.length * TOKENS_PER_CHAR);
}

/**
 * Build a context string from retrieved chunks within a token budget.
 * 1. Sort by similarity DESC (highest first)
 * 2. Accumulate chunks until budget exceeded
 * 3. Re-sort selected chunks by page number ASC for coherent reading order
 * 4. Build labeled context string with relevance indicators
 */
export function buildContext(chunks: RetrievedChunk[]): RAGContext {
  if (chunks.length === 0) {
    return {
      selectedChunks: [],
      contextString: "",
      totalTokensEstimate: 0,
      droppedCount: 0,
    };
  }

  // Step 1: Sort by similarity descending
  const sorted = [...chunks].sort((a, b) => b.similarity - a.similarity);

  // Step 2: Accumulate within budget
  const selected: RetrievedChunk[] = [];
  let totalTokens = 0;

  for (const chunk of sorted) {
    const chunkTokens = estimateTokens(chunk.content);
    if (totalTokens + chunkTokens > MAX_CONTEXT_TOKENS && selected.length > 0) {
      break;
    }
    selected.push(chunk);
    totalTokens += chunkTokens;
  }

  const droppedCount = chunks.length - selected.length;

  if (droppedCount > 0) {
    console.warn(
      `[contextBuilder] Dropped ${droppedCount} chunks to fit budget ` +
        `(${totalTokens} tokens used of ${MAX_CONTEXT_TOKENS} max)`
    );
  }

  // Step 3: Re-sort by page number for coherent reading order
  selected.sort((a, b) => a.pageNumber - b.pageNumber);

  // Step 4: Build context string
  const sections = selected.map((chunk) => {
    const relevance = chunk.similarity >= 0.85 ? "high" : "medium";
    const pageLabel =
      chunk.pageStart === chunk.pageEnd
        ? `Page ${chunk.pageNumber}`
        : `Pages ${chunk.pageStart}-${chunk.pageEnd}`;

    return `[${pageLabel}] (relevance: ${relevance})\n${chunk.content}`;
  });

  const contextString = sections.join("\n\n");

  return {
    selectedChunks: selected,
    contextString,
    totalTokensEstimate: totalTokens,
    droppedCount,
  };
}

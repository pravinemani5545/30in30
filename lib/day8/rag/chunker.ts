import type { PageContent, Chunk } from "@/types/day8";

/** Number of tokens per chunk (approximately 375 words) */
export const CHUNK_SIZE_TOKENS = 500;
/** Overlap between consecutive chunks (approximately 75 words) */
export const OVERLAP_TOKENS = 100;
/** Tokens to advance on each step */
export const STEP_SIZE = CHUNK_SIZE_TOKENS - OVERLAP_TOKENS; // 400

interface TokenWithPage {
  token: string;
  pageNumber: number;
  charOffset: number;
}

/**
 * Chunk a parsed PDF document using a sliding window with token overlap.
 * Fix 1: 100-token overlap prevents boundary answer gaps.
 * Tokens are approximated as whitespace-separated words.
 */
export function chunkDocument(pages: PageContent[]): Chunk[] {
  // Build flat token array with page tracking
  const allTokens: TokenWithPage[] = [];
  let globalCharOffset = 0;

  for (const page of pages) {
    const words = page.text.split(/\s+/).filter((w) => w.length > 0);
    for (const word of words) {
      allTokens.push({
        token: word,
        pageNumber: page.pageNumber,
        charOffset: globalCharOffset,
      });
      globalCharOffset += word.length + 1; // +1 for the space
    }
  }

  if (allTokens.length === 0) return [];

  const chunks: Chunk[] = [];
  let chunkIndex = 0;
  let start = 0;

  while (start < allTokens.length) {
    const end = Math.min(start + CHUNK_SIZE_TOKENS, allTokens.length);
    const chunkTokens = allTokens.slice(start, end);

    // Determine page numbers in this chunk
    const pageNumbers = chunkTokens.map((t) => t.pageNumber);
    const pageStart = Math.min(...pageNumbers);
    const pageEnd = Math.max(...pageNumbers);

    // Primary page = page with the majority of tokens
    const pageCounts = new Map<number, number>();
    for (const pn of pageNumbers) {
      pageCounts.set(pn, (pageCounts.get(pn) ?? 0) + 1);
    }
    let majorityPage = pageStart;
    let maxCount = 0;
    for (const [page, count] of pageCounts) {
      if (count > maxCount || (count === maxCount && page < majorityPage)) {
        majorityPage = page;
        maxCount = count;
      }
    }

    const content = chunkTokens.map((t) => t.token).join(" ");
    const charStart = chunkTokens[0].charOffset;
    const lastToken = chunkTokens[chunkTokens.length - 1];
    const charEnd = lastToken.charOffset + lastToken.token.length;

    chunks.push({
      chunkIndex,
      pageNumber: majorityPage,
      pageStart,
      pageEnd,
      charStart,
      charEnd,
      tokenCount: chunkTokens.length,
      content,
    });

    chunkIndex++;

    // Advance by STEP_SIZE (not CHUNK_SIZE) — this creates the overlap
    if (end >= allTokens.length) break;
    start += STEP_SIZE;
  }

  return chunks;
}

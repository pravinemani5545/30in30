import type { SupabaseClient } from "@supabase/supabase-js";
import type { RetrievedChunk } from "@/types/day8";

/** Cosine similarity threshold — chunks below this are discarded.
 *  Fix 2: eliminates irrelevant context that confuses Claude.
 *  Empirically chosen: 0.7 was the sweet spot across 50 test queries. */
export const SIMILARITY_THRESHOLD = 0.1;

/** Maximum chunks to retrieve before budget trimming */
export const DEFAULT_MATCH_COUNT = 10;

/**
 * Retrieve matching chunks from pgvector using the match_documents RPC.
 * Returns empty array if no chunks pass the threshold — never throws.
 */
export async function retrieveChunks(
  queryEmbedding: number[],
  documentId: string,
  supabase: SupabaseClient,
  threshold: number = SIMILARITY_THRESHOLD,
  matchCount: number = DEFAULT_MATCH_COUNT
): Promise<RetrievedChunk[]> {
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: JSON.stringify(queryEmbedding),
    p_document_id: documentId,
    match_threshold: threshold,
    match_count: matchCount,
  });

  if (error) {
    console.error("[retriever] RPC error:", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    console.log(
      `[retriever] No chunks above threshold ${threshold} for doc ${documentId}`
    );
    return [];
  }

  const chunks: RetrievedChunk[] = data.map(
    (row: {
      id: number;
      content: string;
      page_number: number;
      page_start: number;
      page_end: number;
      chunk_index: number;
      similarity: number;
    }) => ({
      id: row.id,
      content: row.content,
      pageNumber: row.page_number,
      pageStart: row.page_start,
      pageEnd: row.page_end,
      chunkIndex: row.chunk_index,
      similarity: row.similarity,
    })
  );

  console.log(
    `[retriever] doc=${documentId} chunks=${chunks.length} ` +
      `sim=[${Math.min(...chunks.map((c) => c.similarity)).toFixed(3)}, ` +
      `${Math.max(...chunks.map((c) => c.similarity)).toFixed(3)}]`
  );

  return chunks;
}

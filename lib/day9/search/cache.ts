import type { SupabaseClient } from "@supabase/supabase-js";
import type { SearchResult } from "@/types/day9";

const CACHE_TTL_HOURS = 24;

/**
 * Compute a deterministic cache key from person + company.
 * Uses SHA-256 to produce a hex digest.
 */
export async function computeCacheKey(
  person: string,
  company: string
): Promise<string> {
  const input = `${person.trim().toLowerCase()}|${company.trim().toLowerCase()}`;
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface CachedRow {
  id: string;
  raw_results: SearchResult[];
  query_count: number;
}

/**
 * Look up cached research results that haven't expired.
 * Returns null on cache miss or error.
 */
export async function getCachedResults(
  cacheKey: string,
  supabase: SupabaseClient
): Promise<{ results: SearchResult[]; queryCount: number } | null> {
  const { data, error } = await supabase
    .from("research_cache")
    .select("id, raw_results, query_count")
    .eq("cache_key", cacheKey)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[cache] Lookup error:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  const row = data as CachedRow;
  console.log(`[cache] Hit for key=${cacheKey.slice(0, 12)}...`);
  return { results: row.raw_results, queryCount: row.query_count };
}

/**
 * Store research results in the cache with a 24-hour TTL.
 */
export async function setCachedResults(
  cacheKey: string,
  person: string,
  company: string,
  results: SearchResult[],
  queryCount: number,
  supabase: SupabaseClient
): Promise<void> {
  const expiresAt = new Date(
    Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabase.from("research_cache").insert({
    cache_key: cacheKey,
    person_name: person,
    company_name: company,
    raw_results: results,
    query_count: queryCount,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("[cache] Insert error:", error.message);
    return;
  }

  console.log(
    `[cache] Stored key=${cacheKey.slice(0, 12)}... results=${results.length} ttl=${CACHE_TTL_HOURS}h`
  );
}

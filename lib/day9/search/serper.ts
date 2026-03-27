import type { SearchQuery, SearchResult, AggregatedResults } from "@/types/day9";
import { aggregateResults } from "./aggregate";

const SERPER_URL = "https://google.serper.dev/search";
const TIMEOUT_MS = 5000;

interface SerperOrganicResult {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

interface SerperResponse {
  organic: SerperOrganicResult[];
}

/**
 * Execute a single search query against the Serper API.
 * Returns empty array on error (graceful degradation).
 */
async function executeQuery(query: SearchQuery): Promise<SearchResult[]> {
  try {
    const response = await fetch(SERPER_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query.query,
        gl: "us",
        hl: "en",
        num: 5,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.warn(
        `[serper] Query "${query.query}" failed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = (await response.json()) as SerperResponse;

    if (!data.organic || !Array.isArray(data.organic)) {
      console.warn(`[serper] No organic results for "${query.query}"`);
      return [];
    }

    return data.organic.map(
      (item: SerperOrganicResult): SearchResult => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        date: item.date ?? null,
        queryType: query.type,
      })
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.warn(`[serper] Query "${query.query}" error: ${message}`);
    return [];
  }
}

/**
 * Execute all search queries in parallel.
 * Uses Promise.allSettled so one failure doesn't block others.
 */
export async function searchAll(
  queries: SearchQuery[]
): Promise<AggregatedResults> {
  const settled = await Promise.allSettled(
    queries.map((q) => executeQuery(q))
  );

  let partial = false;
  const resultSets: SearchResult[][] = [];

  for (const result of settled) {
    if (result.status === "fulfilled") {
      resultSets.push(result.value);
    } else {
      console.warn(`[serper] Settled rejection: ${result.reason}`);
      partial = true;
    }
  }

  // Check if any fulfilled queries returned empty (treated as partial)
  if (resultSets.some((set) => set.length === 0)) {
    partial = true;
  }

  return aggregateResults(resultSets, queries.length, partial);
}

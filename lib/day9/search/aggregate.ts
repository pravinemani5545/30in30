import type { SearchResult, AggregatedResults } from "@/types/day9";

const NEWS_DOMAINS = new Set([
  "techcrunch.com",
  "bloomberg.com",
  "reuters.com",
  "theverge.com",
  "wired.com",
  "cnbc.com",
  "forbes.com",
  "businessinsider.com",
]);

const MAX_PER_DOMAIN = 2;
const MAX_RESULTS = 10;

/** Extract the hostname from a URL, stripping `www.` prefix */
function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Score a search result for ranking */
function scoreResult(result: SearchResult): number {
  let score = 0;

  // +2 for current year date
  if (result.date && result.date.includes(String(new Date().getFullYear()))) {
    score += 2;
  }

  // +1 for linkedin query type
  if (result.queryType === "linkedin") {
    score += 1;
  }

  // +1 for known news domains
  const domain = extractDomain(result.url);
  if (NEWS_DOMAINS.has(domain)) {
    score += 1;
  }

  return score;
}

/**
 * Aggregate search results from multiple queries.
 * Deduplicates by exact URL and caps per-domain results.
 * Scores and ranks results, returning the top 10.
 */
export function aggregateResults(
  resultSets: SearchResult[][],
  queryCount: number,
  partial: boolean
): AggregatedResults {
  // Flatten all results
  const flat = resultSets.flat();

  // Dedup by exact URL
  const seenUrls = new Set<string>();
  const deduped: SearchResult[] = [];
  for (const result of flat) {
    if (!seenUrls.has(result.url)) {
      seenUrls.add(result.url);
      deduped.push(result);
    }
  }

  // Dedup by domain: max MAX_PER_DOMAIN results from same domain
  const domainCounts = new Map<string, number>();
  const domainFiltered: SearchResult[] = [];
  for (const result of deduped) {
    const domain = extractDomain(result.url);
    const count = domainCounts.get(domain) ?? 0;
    if (count < MAX_PER_DOMAIN) {
      domainCounts.set(domain, count + 1);
      domainFiltered.push(result);
    }
  }

  // Score and sort descending
  const scored = domainFiltered.map((result) => ({
    result,
    score: scoreResult(result),
  }));
  scored.sort((a, b) => b.score - a.score);

  // Take top MAX_RESULTS
  const topResults = scored.slice(0, MAX_RESULTS).map((s) => s.result);

  return {
    results: topResults,
    queryCount,
    partial,
  };
}

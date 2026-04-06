import type { FetchResult } from "@/types/day18";

/**
 * Fetch a page with a realistic User-Agent and 10s timeout.
 * Never throws — returns { html: '', error } on failure.
 */
export async function fetchPage(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CompanyTracker/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    if (!res.ok) {
      return { html: "", error: `HTTP ${res.status} ${res.statusText}` };
    }

    const html = await res.text();
    return { html };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { html: "", error: message };
  } finally {
    clearTimeout(timeout);
  }
}

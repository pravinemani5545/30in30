export interface FetchResult {
  html: string;
  error?: string;
}

export async function fetchProductPage(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PriceTracker/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return { html: "", error: `HTTP ${res.status}` };
    }

    const html = await res.text();
    return { html };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Timeout after 10s"
          : err.message
        : "Unknown fetch error";
    return { html: "", error: message };
  } finally {
    clearTimeout(timeout);
  }
}

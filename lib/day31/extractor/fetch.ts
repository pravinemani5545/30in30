export interface FetchResult {
  html: string;
  error?: string;
}

export async function fetchProductPage(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      redirect: "follow",
    });

    if (res.status === 403) {
      return { html: "", error: "Site blocked access (403). You can still add this product manually." };
    }

    if (!res.ok) {
      return { html: "", error: `HTTP ${res.status}` };
    }

    const html = await res.text();
    return { html };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Timeout after 15s"
          : err.message
        : "Unknown fetch error";
    return { html: "", error: message };
  } finally {
    clearTimeout(timeout);
  }
}

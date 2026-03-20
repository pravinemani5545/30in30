const MAX_RESPONSE_BYTES = 2 * 1024 * 1024; // 2MB

export interface FetchResult {
  html: string;
  finalUrl: string;
}

export interface FetchError {
  error: string;
  status?: number;
}

export async function fetchHtml(url: string): Promise<FetchResult | FetchError> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TweetCraft/1.0; +https://tweetcraft.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return { error: "Request timed out. The page took too long to respond." };
    }
    return { error: "Couldn't reach that URL. Please check the link and try again." };
  }

  if (!response.ok) {
    const statusMessages: Record<number, string> = {
      403: "Couldn't fetch that page. It may require login or block automated access.",
      404: "That page doesn't exist (404). Please check the URL.",
      429: "That site is rate-limiting requests. Please try again in a moment.",
      500: "The target site returned a server error. Please try again.",
      503: "The target site is temporarily unavailable. Please try again.",
    };
    return {
      error: statusMessages[response.status] ?? `The page returned an error (${response.status}).`,
      status: response.status,
    };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
    return { error: "That URL doesn't point to a web page (wrong content type)." };
  }

  // Check content-length header before reading body
  const contentLength = response.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_BYTES) {
    return { error: "That page is too large to process." };
  }

  // Stream the body with a size cap
  const reader = response.body?.getReader();
  if (!reader) return { error: "Could not read the page content." };

  const chunks: Uint8Array[] = [];
  let bytesRead = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytesRead += value.length;
    if (bytesRead > MAX_RESPONSE_BYTES) {
      reader.cancel();
      break;
    }
    chunks.push(value);
  }

  const html = new TextDecoder().decode(
    new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], [] as number[]))
  );

  return { html, finalUrl: response.url };
}

export function isFetchError(result: FetchResult | FetchError): result is FetchError {
  return "error" in result;
}

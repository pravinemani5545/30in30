import { browserFetchPage } from "./browser-fetch";
import { bestbuyCAFetch, isBestBuyCA } from "./bestbuy-fetch";

export interface FetchResult {
  html: string;
  error?: string;
}

// Sites that need headless browser (JS-rendered prices)
const BROWSER_REQUIRED_HOSTS = ["apple.com"];

function needsBrowser(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return BROWSER_REQUIRED_HOSTS.some(
      (h) => hostname === h || hostname.endsWith("." + h),
    );
  } catch {
    return false;
  }
}

async function simpleFetch(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
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
      return { html: "", error: "blocked_403" };
    }

    if (!res.ok) {
      return { html: "", error: `HTTP ${res.status}` };
    }

    const html = await res.text();

    // Detect JS-rendered shells (tiny HTML with no price data)
    if (html.length < 1000 || isJsShell(html)) {
      return { html: "", error: "js_rendered" };
    }

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

function isJsShell(html: string): boolean {
  const hasNoScript = /<noscript/i.test(html);
  const hasReactRoot = /id="(root|__next|app)"/i.test(html);
  const hasNoPrice = !/\$[\d,]+\.?\d*/i.test(html);
  return (hasNoScript || hasReactRoot) && hasNoPrice;
}

export async function fetchProductPage(url: string): Promise<FetchResult> {
  // Best Buy Canada → use their public JSON API
  if (isBestBuyCA(url)) {
    return bestbuyCAFetch(url);
  }

  // Known browser-required sites → go straight to Puppeteer
  if (needsBrowser(url)) {
    return browserFetchPage(url);
  }

  // Try simple fetch first
  const result = await simpleFetch(url);

  // If blocked or JS-rendered, fall back to browser
  if (result.error === "blocked_403" || result.error === "js_rendered") {
    const browserResult = await browserFetchPage(url);
    if (browserResult.html) {
      return browserResult;
    }
    return {
      html: "",
      error:
        result.error === "blocked_403"
          ? "Site blocked access. Browser fallback also failed."
          : "JS-rendered site. Browser fallback also failed.",
    };
  }

  return result;
}

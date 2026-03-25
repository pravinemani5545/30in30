import type { PreviewResponse } from "@/types/day3";
import { getDomainFromUrl, getFaviconUrl } from "@/lib/day3/utils";

export async function fetchPreview(url: string): Promise<PreviewResponse | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TweetCraft/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });

    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return null;

    // Read only up to first 50KB (head tag should be within first few KB)
    const reader = response.body?.getReader();
    if (!reader) return null;

    let html = "";
    let bytesRead = 0;
    const MAX_HEAD_BYTES = 50 * 1024;

    while (bytesRead < MAX_HEAD_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
      bytesRead += value.length;
      if (html.includes("</head>")) {
        reader.cancel();
        break;
      }
    }

    // Simple regex extraction for speed (no cheerio needed for head-only)
    const getMeta = (attr: string, value: string): string => {
      const re = new RegExp(
        `<meta\\s+[^>]*${attr}=["']${value}["'][^>]*content=["']([^"']*)["']`,
        "i"
      );
      const re2 = new RegExp(
        `<meta\\s+[^>]*content=["']([^"'"]*)["'][^>]*${attr}=["']${value}["']`,
        "i"
      );
      return (re.exec(html)?.[1] ?? re2.exec(html)?.[1] ?? "").trim();
    };

    const title =
      getMeta("property", "og:title") ||
      getMeta("name", "twitter:title") ||
      /<title[^>]*>([^<]+)<\/title>/i.exec(html)?.[1]?.trim() ||
      getDomainFromUrl(url);

    const description =
      getMeta("property", "og:description") ||
      getMeta("name", "twitter:description") ||
      getMeta("name", "description") ||
      "";

    const ogImageUrl =
      getMeta("property", "og:image") || getMeta("name", "twitter:image") || null;

    // Rough word estimate from description for read time
    const wordCount = Math.max(
      description.split(/\s+/).length * 10, // assume description is ~10% of article
      200
    );
    const estimatedReadMinutes = Math.max(1, Math.round(wordCount / 200));

    return {
      title,
      description: description.slice(0, 200),
      domain: getDomainFromUrl(url),
      faviconUrl: getFaviconUrl(url),
      estimatedReadMinutes,
      ogImageUrl,
    };
  } catch {
    return null;
  }
}

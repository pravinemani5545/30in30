/**
 * Extract clean text from HTML for hashing.
 * Strips scripts, styles, nav, footer, and HTML tags.
 * Normalizes whitespace. Caps at 50K chars.
 *
 * Why not hash raw HTML: cookie banners, CSRF tokens, analytics scripts,
 * and timestamps change on every page load. Hashing raw HTML would
 * produce false positives on virtually every page.
 */
export function extractText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50_000);
}

/**
 * Check if the extracted text is too short (likely JS-rendered SPA).
 */
export function isLikelyJSRendered(text: string): boolean {
  return text.length < 100;
}

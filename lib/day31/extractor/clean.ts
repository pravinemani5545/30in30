const STRIP_TAGS = ["script", "style", "noscript", "svg", "iframe"];
const KEEP_ATTRS = [
  "class",
  "id",
  "data-price",
  "data-product",
  "data-sku",
  "itemprop",
  "content",
  "aria-label",
];

export function cleanHtml(html: string): string {
  let cleaned = html;

  // Strip unwanted tags and their content
  for (const tag of STRIP_TAGS) {
    const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`, "gi");
    cleaned = cleaned.replace(regex, "");
  }

  // Strip HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

  // Strip attributes except useful ones
  cleaned = cleaned.replace(/<(\w+)\s+([^>]*)>/g, (_match, tag, attrs) => {
    const kept: string[] = [];
    for (const attr of KEEP_ATTRS) {
      const attrRegex = new RegExp(`${attr}\\s*=\\s*["'][^"']*["']`, "i");
      const found = (attrs as string).match(attrRegex);
      if (found) kept.push(found[0]);
    }
    return kept.length > 0 ? `<${tag} ${kept.join(" ")}>` : `<${tag}>`;
  });

  // Find first currency symbol or price pattern and centre around it
  // Support $, C$, CAD, EUR, GBP, plus common price patterns
  const currencyIndex = cleaned.search(
    /[$\u20AC\u00A3\u00A5]|CAD|CDN|price|Price|PRICE/,
  );

  if (currencyIndex >= 0) {
    const start = Math.max(0, currencyIndex - 7500);
    const end = Math.min(cleaned.length, currencyIndex + 7500);
    cleaned = cleaned.slice(start, end);
  } else if (cleaned.length > 50_000) {
    // No currency found and very long — just take first 15k
    cleaned = cleaned.slice(0, 15_000);
  }

  // Cap at 15k chars
  if (cleaned.length > 15_000) {
    cleaned = cleaned.slice(0, 15_000);
  }

  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Lower threshold — some sites have minimal HTML with JSON-LD price data
  if (cleaned.length < 100) return "";

  return cleaned;
}

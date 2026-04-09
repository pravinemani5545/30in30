const STRIP_TAGS = ["script", "style", "nav", "footer", "header", "noscript"];
const KEEP_ATTRS = ["class", "id", "data-price", "itemprop", "content"];

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
  cleaned = cleaned.replace(/<(\w+)\s+([^>]*)>/g, (match, tag, attrs) => {
    const kept: string[] = [];
    for (const attr of KEEP_ATTRS) {
      const attrRegex = new RegExp(`${attr}\\s*=\\s*["'][^"']*["']`, "i");
      const found = attrs.match(attrRegex);
      if (found) kept.push(found[0]);
    }
    return kept.length > 0 ? `<${tag} ${kept.join(" ")}>` : `<${tag}>`;
  });

  // Find first currency symbol and centre around it
  const currencyIndex = cleaned.search(/[$\u20AC\u00A3\u00A5]/);
  if (currencyIndex === -1) {
    // No currency found in first 50k chars — likely not a product page
    if (cleaned.length > 50_000) return "";
    // Still try with whatever we have
  }

  if (currencyIndex >= 0) {
    const start = Math.max(0, currencyIndex - 7500);
    const end = Math.min(cleaned.length, currencyIndex + 7500);
    cleaned = cleaned.slice(start, end);
  }

  // Cap at 15k chars
  if (cleaned.length > 15_000) {
    cleaned = cleaned.slice(0, 15_000);
  }

  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // If too short after cleaning, likely JS-rendered
  if (cleaned.length < 200) return "";

  return cleaned;
}

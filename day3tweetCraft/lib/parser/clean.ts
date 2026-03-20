const MAX_CONTENT_CHARS = 8000;

// Common navigation/footer patterns to strip
const NOISE_PATTERNS = [
  /cookie\s*policy/gi,
  /privacy\s*policy/gi,
  /terms\s*(of\s*service|and\s*conditions)/gi,
  /all\s*rights\s*reserved/gi,
  /copyright\s*©?\s*\d{4}/gi,
  /subscribe\s*(to\s*(our|the))?\s*newsletter/gi,
  /click\s*here\s*to\s*(read|learn|see)/gi,
  /read\s*more\s*articles/gi,
  /follow\s*us\s*on/gi,
  /share\s*this\s*article/gi,
];

export function cleanText(rawText: string): string {
  let text = rawText;

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Remove noise patterns
  for (const pattern of NOISE_PATTERNS) {
    text = text.replace(pattern, "");
  }

  // Collapse again after removals
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

export function truncateToLimit(text: string): string {
  if (text.length <= MAX_CONTENT_CHARS) return text;

  // Try to truncate at a sentence boundary
  const truncated = text.slice(0, MAX_CONTENT_CHARS);
  const lastPeriod = truncated.lastIndexOf(". ");
  if (lastPeriod > MAX_CONTENT_CHARS * 0.8) {
    return truncated.slice(0, lastPeriod + 1);
  }

  // Fall back to word boundary
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

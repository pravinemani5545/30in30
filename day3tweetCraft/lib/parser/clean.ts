const MAX_CONTENT_CHARS = 8000;
const MAX_PASTE_CHARS = 15000;

// ─── Fetched content (cheerio-extracted) ─────────────────────────────────────

const INLINE_NOISE_PATTERNS = [
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
  text = text.replace(/\s+/g, " ").trim();
  for (const pattern of INLINE_NOISE_PATTERNS) {
    text = text.replace(pattern, "");
  }
  return text.replace(/\s+/g, " ").trim();
}

// ─── Pasted content (raw Cmd+A browser paste) ────────────────────────────────

// Lines that are exactly these (case-insensitive) — pure UI chrome
const EXACT_NOISE = new Set([
  "home", "about", "blog", "contact", "search", "menu", "close", "open menu",
  "sign in", "sign up", "log in", "log out", "login", "logout", "register",
  "get started", "get the app", "get app", "open in app", "open app",
  "write", "write a story", "start writing",
  "subscribe", "unsubscribe", "follow", "unfollow", "following",
  "share", "tweet", "retweet", "copy link", "copy", "like", "save", "bookmark",
  "read more", "load more", "see more", "view more", "show more",
  "next", "previous", "prev", "back", "continue reading",
  "advertisement", "sponsored", "ad", "promoted",
  "accept", "accept all", "accept cookies", "decline", "manage preferences",
  "facebook", "twitter", "linkedin", "instagram", "youtube", "tiktok", "reddit",
  "·", "•", "|", "—", "–", "...", "…", "↓", "↑",
  "free", "new", "updated",
  "dark mode", "light mode",
  "notifications", "settings", "profile",
  "upgrade", "go pro", "premium",
  // Medium-specific
  "top highlight", "top story", "member only",
  "cancel", "respond", "reply",
  "enter your email",
  "remember me for faster sign in",
]);

// Lines matching these patterns are noise regardless of surrounding content
const NOISE_LINE_PATTERNS = [
  /^©\s*\d{4}/,
  /^copyright\s*©?\s*\d{4}/i,
  /all rights reserved/i,
  /privacy policy/i,
  /terms (of service|and conditions|of use)/i,
  /cookie (policy|settings|notice|banner)/i,
  /we use cookies/i,
  /^\d+\s*min(ute)?\s*read$/i,           // "5 min read" as a standalone line
  /^\d+\s*min(ute)?\s*read\s*·/i,        // "5 min read · Jan 15"
  /^share (this|on|via)\b/i,
  /^follow us\b/i,
  /^(related|more|recommended)( articles?| posts?| stories?| reads?)?:?$/i,
  /^you (might|may|could|should) also (like|enjoy|read|check out)/i,
  /^more from (the )?author/i,
  /^written by\s*$/i,
  /^sign up (for|to get|to receive)\b/i,
  /^subscribe to (our|the|this)\b/i,
  /^(leave|write|add|post) a (reply|comment|response)/i,
  /^(\d+) (comment|response)(s)?\s*$/i,
  // Medium-specific
  /^get .{1,40}'s stories in your inbox$/i,
  /^join medium (for free)?\b/i,
  /^more from .{1,60}$/i,
  /^recommended from medium$/i,
  /^written by\b/i,
  /^\d+\s*(followers?|following)\s*$/i,
  /^in\s+[A-Z].{1,60}by\b/,                // "In Publication by Author"
  /^tags?:\s/i,
  /^topics?:\s/i,
  /^categor(y|ies):\s/i,
  /^published (in|by|on)\s*·/i,
  /distraction-free reading/i,
  /^get unlimited access/i,
  /^become a member/i,
  /^already a member\?/i,
];

// Once we see one of these as a standalone line (with content already accumulated),
// everything after is footer — stop reading
const FOOTER_TRIGGER_LINES = new Set([
  "about", "help", "careers", "press", "legal", "status",
  "privacy", "terms", "sitemap", "contact us",
  "about us", "help center", "support",
  // Medium comment / recommended sections
  "responses", "write a response", "what are your thoughts?",
  "recommended from medium", "more from medium",
]);

export function cleanPastedContent(raw: string): string {
  const lines = raw.split(/\r?\n/);
  const result: string[] = [];
  let footerReached = false;
  let blankRun = 0;

  for (const line of lines) {
    if (footerReached) break;

    const trimmed = line.trim();

    // Blank line handling — collapse runs > 2
    if (!trimmed) {
      blankRun++;
      if (blankRun <= 2) result.push("");
      continue;
    }
    blankRun = 0;

    // Check for footer trigger (only once we have real content)
    const substantiveLines = result.filter((l) => l.length > 60).length;
    if (substantiveLines >= 3 && FOOTER_TRIGGER_LINES.has(trimmed.toLowerCase())) {
      footerReached = true;
      break;
    }

    // Skip exact UI chrome
    if (EXACT_NOISE.has(trimmed.toLowerCase())) continue;

    // Skip noise line patterns
    if (NOISE_LINE_PATTERNS.some((p) => p.test(trimmed))) continue;

    // Skip pure-number lines (pagination, counters)
    if (/^\d+$/.test(trimmed)) continue;

    // Skip lines with no letters at all (pure symbols/emoji runs)
    if (!/[a-zA-Z]/.test(trimmed) && trimmed.length < 10) continue;

    result.push(trimmed);
  }

  // Remove consecutive duplicate lines (nav items often repeat)
  const deduped = result.filter((line, i) => line !== result[i - 1]);

  // Join, collapse any remaining 3+ blank lines, trim
  const joined = deduped.join("\n").replace(/\n{3,}/g, "\n\n").trim();

  return truncateAtSentence(joined, MAX_PASTE_CHARS);
}

// Extract headings + first sentence of each paragraph + stat sentences.
// Reduces a 15,000-char article to ~4,000 chars while keeping all key points.
function compressToKeyContent(text: string): string {
  const TARGET_CHARS = 5000;
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const out: string[] = [];
  let total = 0;

  for (const line of lines) {
    if (total >= TARGET_CHARS) break;

    // Short lines (< 100 chars, doesn't end with period) are headings/titles — keep whole
    const isHeading = line.length < 100 && !/\.\s*$/.test(line);
    if (isHeading) {
      out.push(line);
      total += line.length + 1;
      continue;
    }

    // For long paragraph lines: take first sentence
    const firstSentence = extractFirstSentence(line);
    out.push(firstSentence);
    total += firstSentence.length + 1;

    // Also grab any sentence with a number/stat (highly tweetable)
    if (total < TARGET_CHARS) {
      const statSentence = extractStatSentence(line);
      if (statSentence && statSentence !== firstSentence) {
        out.push(statSentence);
        total += statSentence.length + 1;
      }
    }
  }

  return out.join("\n").trim();
}

function extractFirstSentence(text: string): string {
  const match = text.match(/^.+?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text.slice(0, 200).trim();
}

function extractStatSentence(text: string): string | null {
  // Sentences containing numbers, percentages, or "$" are usually the most tweetable
  const sentences = text.split(/(?<=[.!?])\s+/);
  const stat = sentences.find(
    (s, i) => i > 0 && /\d+[%k+]?|\$\d|#\d/.test(s) && s.length > 20
  );
  return stat?.trim() ?? null;
}

function truncateAtSentence(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const truncated = text.slice(0, limit);
  const lastPeriod = truncated.lastIndexOf(". ");
  if (lastPeriod > limit * 0.8) return truncated.slice(0, lastPeriod + 1);
  const lastNewline = truncated.lastIndexOf("\n");
  if (lastNewline > limit * 0.8) return truncated.slice(0, lastNewline);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
}

// ─── Shared utilities ─────────────────────────────────────────────────────────

export function truncateToLimit(text: string): string {
  return truncateAtSentence(text, MAX_CONTENT_CHARS);
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

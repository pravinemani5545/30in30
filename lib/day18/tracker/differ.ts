/**
 * Find the first meaningful difference between old and new text.
 * Returns before/after excerpts (max 200 chars each).
 *
 * Simple approach: split into sentences, find first that differs.
 */
export function extractDiff(
  oldText: string,
  newText: string,
): { before: string; after: string } {
  const oldSentences = splitSentences(oldText);
  const newSentences = splitSentences(newText);

  const maxLen = Math.max(oldSentences.length, newSentences.length);

  for (let i = 0; i < maxLen; i++) {
    const oldS = oldSentences[i] ?? "";
    const newS = newSentences[i] ?? "";

    if (oldS !== newS) {
      return {
        before: oldS.slice(0, 200),
        after: newS.slice(0, 200),
      };
    }
  }

  // No sentence-level diff found — return truncated starts
  return {
    before: oldText.slice(0, 200),
    after: newText.slice(0, 200),
  };
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

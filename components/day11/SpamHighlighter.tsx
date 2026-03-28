"use client";

interface SpamHighlighterProps {
  text: string;
  spamWords: string[];
}

export function SpamHighlighter({ text, spamWords }: SpamHighlighterProps) {
  if (spamWords.length === 0) {
    return <span>{text}</span>;
  }

  // Build a regex that matches any of the spam words (case-insensitive)
  const escaped = spamWords.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");

  const parts = text.split(pattern);

  return (
    <span>
      {parts.map((part, i) => {
        const isSpam = spamWords.some(
          (w) => w.toLowerCase() === part.toLowerCase()
        );
        if (isSpam) {
          return (
            <mark
              key={i}
              className="rounded-sm px-0.5"
              style={{ backgroundColor: "rgb(239 68 68 / 0.19)", color: "inherit" }}
            >
              {part}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

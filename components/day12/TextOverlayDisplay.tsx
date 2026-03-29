"use client";

import { SectionCopyButton } from "./SectionCopyButton";

export function TextOverlayDisplay({ words }: { words: string[] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold tracking-[0.1em]"
          style={{ color: "var(--text-tertiary)" }}
        >
          TEXT OVERLAY
        </span>
        <SectionCopyButton text={words.join(" ")} />
      </div>
      <p
        className="text-xl font-bold leading-tight"
        style={{ color: "var(--foreground)" }}
      >
        {words.join(" ")}
      </p>
    </div>
  );
}

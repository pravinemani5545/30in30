"use client";

import { SectionCopyButton } from "./SectionCopyButton";

export function ABHypothesis({ text }: { text: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold tracking-[0.1em]"
          style={{ color: "var(--text-tertiary)" }}
        >
          A/B HYPOTHESIS
        </span>
        <SectionCopyButton text={text} />
      </div>
      <p
        className="text-[13px] italic leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {text}
      </p>
    </div>
  );
}

"use client";

import { SectionCopyButton } from "./SectionCopyButton";

export function CompositionSteps({ steps }: { steps: string[] }) {
  const copyText = steps.map((s, i) => `${i + 1}. ${s}`).join("\n");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold tracking-[0.1em]"
          style={{ color: "var(--text-tertiary)" }}
        >
          COMPOSITION
        </span>
        <SectionCopyButton text={copyText} />
      </div>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed">
            <span
              className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full text-[11px] font-bold"
              style={{
                backgroundColor: "rgb(232 160 32 / 0.12)",
                color: "#E8A020",
              }}
            >
              {i + 1}
            </span>
            <span style={{ color: "var(--foreground)" }}>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

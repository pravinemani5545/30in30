"use client";

import type { FindingSeverity } from "@/types/day10";

const SEVERITY_STYLES: Record<
  FindingSeverity,
  { bg: string; text: string; label: string }
> = {
  critical: {
    bg: "var(--severity-critical-bg)",
    text: "var(--severity-critical-text)",
    label: "CRITICAL",
  },
  high: {
    bg: "var(--severity-high-bg)",
    text: "var(--severity-high-text)",
    label: "HIGH",
  },
  medium: {
    bg: "var(--severity-medium-bg)",
    text: "var(--severity-medium-text)",
    label: "MEDIUM",
  },
  low: {
    bg: "var(--severity-low-bg)",
    text: "var(--severity-low-text)",
    label: "LOW",
  },
};

export function SeverityBadge({ severity }: { severity: FindingSeverity }) {
  const style = SEVERITY_STYLES[severity];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider"
      style={{
        background: style.bg,
        color: style.text,
        borderRadius: 4,
      }}
    >
      {style.label}
    </span>
  );
}

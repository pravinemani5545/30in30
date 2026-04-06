"use client";

import type { EffortLevel } from "@/types/day19";

const EFFORT_COLORS: Record<EffortLevel, string> = {
  high: "var(--effort-high)",
  medium: "var(--effort-medium)",
  low: "var(--effort-low)",
};

const EFFORT_SHORT: Record<EffortLevel, string> = {
  high: "HIGH",
  medium: "MED",
  low: "LOW",
};

export function EffortBadge({ level }: { level: EffortLevel }) {
  const color = EFFORT_COLORS[level];
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 font-bold uppercase tracking-wider"
      style={{
        fontSize: 10,
        fontFamily: "var(--font-sans)",
        color,
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
      }}
    >
      {EFFORT_SHORT[level]}
    </span>
  );
}

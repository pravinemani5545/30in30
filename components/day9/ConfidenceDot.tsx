"use client";

import type { ConfidenceLevel } from "@/types/day9";

const COLORS: Record<ConfidenceLevel, string> = {
  verified: "bg-[#22C55E]",
  likely: "bg-[#E8A020]",
  uncertain: "bg-[#EF4444]",
};

const LABELS: Record<ConfidenceLevel, string> = {
  verified: "Verified — recent, reliable sources",
  likely: "Likely — inferred from context",
  uncertain: "Uncertain — limited or conflicting data",
};

export function ConfidenceDot({ level }: { level: ConfidenceLevel }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${COLORS[level]} shrink-0`}
      title={LABELS[level]}
    />
  );
}

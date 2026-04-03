"use client";

import { estimateCost } from "@/lib/day16/voiceover/cost";

interface CostEstimateProps {
  charCount: number;
}

const tierColors: Record<string, string> = {
  low: "var(--cost-low)",
  mid: "var(--cost-mid)",
  high: "var(--cost-high)",
};

export function CostEstimate({ charCount }: CostEstimateProps) {
  if (charCount === 0) return null;

  const { estimate, tier } = estimateCost(charCount);

  return (
    <span
      className="text-xs font-semibold"
      style={{ color: tierColors[tier] }}
    >
      {estimate} estimated
    </span>
  );
}

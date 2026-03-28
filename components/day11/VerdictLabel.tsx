"use client";

import {
  getScoreRange,
  SCORE_RANGE_LABELS,
} from "@/lib/day11/scoring/rubric";

interface VerdictLabelProps {
  score: number;
}

const RANGE_COLORS: Record<string, string> = {
  fail: "#EF4444",
  marginal: "#F97316",
  good: "#E8A020",
  strong: "#22C55E",
};

export function VerdictLabel({ score }: VerdictLabelProps) {
  const range = getScoreRange(score);

  return (
    <p
      className="mt-2 text-center text-xs font-sans font-bold uppercase tracking-wider"
      style={{ color: RANGE_COLORS[range], letterSpacing: "0.08em" }}
    >
      {SCORE_RANGE_LABELS[range]}
    </p>
  );
}

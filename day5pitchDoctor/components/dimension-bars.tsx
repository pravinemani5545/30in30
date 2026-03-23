"use client";

import type { DimensionScores } from "@/types";
import { scoreColor } from "@/lib/utils";

interface DimensionBarsProps {
  scores: DimensionScores;
  totalScore: number;
}

const DIMENSION_LABELS: Record<keyof DimensionScores, string> = {
  clarity: "Clarity",
  specificity: "Specificity",
  differentiation: "Differentiation",
  audience_fit: "Audience Fit",
  memorability: "Memorability",
};

export function DimensionBars({ scores, totalScore }: DimensionBarsProps) {
  const color = scoreColor(totalScore);

  return (
    <div className="space-y-3 w-full">
      {(Object.entries(DIMENSION_LABELS) as [keyof DimensionScores, string][]).map(
        ([key, label]) => {
          const value = scores[key];
          const pct = (value / 20) * 100;

          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-mono)] text-sm text-text-secondary">
                  {label}
                </span>
                <span
                  className="font-[family-name:var(--font-mono)] text-sm font-bold"
                  style={{ color }}
                >
                  {value}/20
                </span>
              </div>
              <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

"use client";

import { CAMPAIGN_LAUNCH_THRESHOLD } from "@/lib/day11/scoring/rubric";

interface ThresholdLineProps {
  score: number;
}

export function ThresholdLine({ score }: ThresholdLineProps) {
  const passed = score >= CAMPAIGN_LAUNCH_THRESHOLD;

  return (
    <div className="relative my-3 flex items-center gap-3">
      <div
        className="h-px flex-1"
        style={{ backgroundColor: "var(--accent)" }}
      />
      <span
        className="text-xs font-sans font-bold shrink-0"
        style={{ color: "var(--accent)", fontSize: "10px", letterSpacing: "0.08em" }}
      >
        {CAMPAIGN_LAUNCH_THRESHOLD} THRESHOLD
      </span>
      <div
        className="h-px flex-1"
        style={{ backgroundColor: "var(--accent)" }}
      />
      {!passed && (
        <span
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs"
          style={{ color: "#EF4444", fontSize: "10px" }}
        >
          BELOW
        </span>
      )}
    </div>
  );
}

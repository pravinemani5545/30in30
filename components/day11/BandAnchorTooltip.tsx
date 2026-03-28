"use client";

import type { DimensionKey } from "@/types/day11";
import { BAND_ANCHORS } from "@/lib/day11/scoring/rubric";

interface BandAnchorTooltipProps {
  dimension: DimensionKey;
}

export function BandAnchorTooltip({ dimension }: BandAnchorTooltipProps) {
  const anchors = BAND_ANCHORS[dimension];

  return (
    <div
      className="rounded-md border p-3 text-xs"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        maxWidth: "320px",
      }}
    >
      <p
        className="mb-2 font-sans font-bold uppercase"
        style={{ fontSize: "10px", letterSpacing: "0.08em", color: "var(--text-secondary)" }}
      >
        Scoring bands
      </p>
      <div className="space-y-1.5">
        {anchors.map((anchor) => (
          <div key={anchor.range} className="flex gap-2">
            <span
              className="shrink-0 font-sans font-bold"
              style={{ color: "var(--text-secondary)", minWidth: "36px" }}
            >
              {anchor.range}
            </span>
            <span
              className="font-sans italic"
              style={{ color: "var(--text-tertiary)", lineHeight: "1.4" }}
            >
              {anchor.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

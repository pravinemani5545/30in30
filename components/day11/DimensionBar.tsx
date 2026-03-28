"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DimensionKey } from "@/types/day11";
import {
  DIMENSION_LABELS,
  DIMENSION_COLORS,
  DIMENSION_MAX,
} from "@/lib/day11/scoring/rubric";
import { BandAnchorTooltip } from "./BandAnchorTooltip";

interface DimensionBarProps {
  dimension: DimensionKey;
  score: number;
  finding: string;
  delay?: number;
}

export function DimensionBar({
  dimension,
  score,
  finding,
  delay = 0,
}: DimensionBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const color = DIMENSION_COLORS[dimension];
  const pct = (score / DIMENSION_MAX) * 100;

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full text-left cursor-pointer"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span
            className="font-sans font-bold uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "var(--text-secondary)",
            }}
          >
            {DIMENSION_LABELS[dimension]}
          </span>
          <span
            className="ml-auto font-sans font-bold"
            style={{ fontSize: "22px", color }}
          >
            {score}
            <span
              className="font-normal"
              style={{ fontSize: "13px", color: "var(--text-tertiary)" }}
            >
              /{DIMENSION_MAX}
            </span>
          </span>
        </div>

        <div
          className="h-1.5 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--surface-raised)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
          />
        </div>

        <p
          className="mt-1.5 font-sans"
          style={{
            fontSize: "13px",
            lineHeight: "1.6",
            color: "var(--text-secondary)",
          }}
        >
          {finding}
        </p>
      </button>

      {showTooltip && (
        <div className="absolute left-0 top-full z-10 mt-1">
          <BandAnchorTooltip dimension={dimension} />
        </div>
      )}
    </div>
  );
}

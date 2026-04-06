"use client";

import { motion } from "framer-motion";
import type { Grade } from "@/types/day17";
import { GRADE_LABELS } from "@/types/day17";

const GRADE_COLORS: Record<Grade, string> = {
  A: "var(--grade-a)",
  B: "var(--grade-b)",
  C: "var(--grade-c)",
  D: "var(--grade-d)",
  F: "var(--grade-f)",
};

interface GradeBadgeProps {
  grade: Grade;
  score: number;
}

export function GradeBadge({ grade, score }: GradeBadgeProps) {
  const color = GRADE_COLORS[grade];

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 120,
          height: 120,
          backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
          border: `2px solid ${color}`,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 72,
            lineHeight: 1,
            color,
          }}
        >
          {grade}
        </span>
      </div>
      <p
        className="text-sm font-semibold"
        style={{ color }}
      >
        {score} / 100
      </p>
      <p
        className="text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {GRADE_LABELS[grade]}
      </p>
    </motion.div>
  );
}

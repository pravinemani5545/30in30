"use client";

import type { ReplyCategory } from "@/types/day21";

const CATEGORY_COLORS: Record<ReplyCategory, string> = {
  interested: "#22C55E",
  not_now: "#E8A020",
  question: "#8B5CF6",
  out_of_office: "#06B6D4",
  unsubscribe: "#EF4444",
};

const CATEGORY_LABELS: Record<ReplyCategory, string> = {
  interested: "Interested",
  not_now: "Not Now",
  question: "Question",
  out_of_office: "Out of Office",
  unsubscribe: "Unsubscribe",
};

export function CategoryBadge({ category }: { category: ReplyCategory }) {
  const color = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];

  return (
    <span
      className="inline-block px-2 py-0.5"
      style={{
        fontFamily: "var(--font-day21-mono)",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        color,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: 0,
      }}
    >
      {label}
    </span>
  );
}

"use client";

import type { FindingCategory } from "@/types/day10";

export function CategoryBadge({ category }: { category: FindingCategory }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider"
      style={{
        background: "var(--surface-raised)",
        color: "var(--text-secondary)",
        borderRadius: 4,
      }}
    >
      {category}
    </span>
  );
}

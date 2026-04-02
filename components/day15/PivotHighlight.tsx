"use client";

import { Star } from "lucide-react";

export function PivotHighlight() {
  return (
    <div
      className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-semibold"
      style={{
        background: "var(--accent-subtle)",
        color: "var(--accent)",
      }}
    >
      <Star size={12} fill="currentColor" />
      The Pivot — most under-used technique in outbound
    </div>
  );
}

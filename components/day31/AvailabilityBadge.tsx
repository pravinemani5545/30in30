"use client";

import type { AvailabilityStatus } from "@/types/day31";

const STYLES: Record<
  AvailabilityStatus,
  { color: string; bg: string; border: string; label: string }
> = {
  in_stock: {
    color: "#00FF41",
    bg: "rgba(0, 255, 65, 0.08)",
    border: "rgba(0, 255, 65, 0.2)",
    label: "IN STOCK",
  },
  out_of_stock: {
    color: "#ff4444",
    bg: "rgba(255, 68, 68, 0.08)",
    border: "rgba(255, 68, 68, 0.15)",
    label: "OUT OF STOCK",
  },
  unknown: {
    color: "#555",
    bg: "#131313",
    border: "#2a2a2a",
    label: "UNKNOWN",
  },
};

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
}

export function AvailabilityBadge({ status }: AvailabilityBadgeProps) {
  const s = STYLES[status];
  return (
    <span
      style={{
        fontFamily: "var(--font-day31-mono)",
        fontSize: "11px",
        letterSpacing: "1px",
        textTransform: "uppercase",
        color: s.color,
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        padding: "2px 8px",
        display: "inline-block",
      }}
    >
      {s.label}
    </span>
  );
}

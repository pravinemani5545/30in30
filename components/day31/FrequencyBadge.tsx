"use client";

import type { CheckFrequency } from "@/types/day31";
import { FREQUENCY_LABELS } from "@/types/day31";

interface FrequencyBadgeProps {
  frequency: CheckFrequency;
}

export function FrequencyBadge({ frequency }: FrequencyBadgeProps) {
  return (
    <span
      style={{
        fontFamily: "var(--font-day31-mono)",
        fontSize: "11px",
        color: "#555",
        backgroundColor: "#131313",
        border: "1px solid #2a2a2a",
        padding: "2px 8px",
        display: "inline-block",
      }}
    >
      {FREQUENCY_LABELS[frequency]}
    </span>
  );
}

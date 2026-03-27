"use client";

import type { FindingSeverity } from "@/types/day10";

interface SeveritySummaryBarProps {
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  onSeverityClick: (severity: FindingSeverity) => void;
}

const SEGMENTS: Array<{
  severity: FindingSeverity;
  label: string;
  color: string;
  bg: string;
}> = [
  {
    severity: "critical",
    label: "CRITICAL",
    color: "var(--severity-critical-text)",
    bg: "var(--severity-critical-bg)",
  },
  {
    severity: "high",
    label: "HIGH",
    color: "var(--severity-high-text)",
    bg: "var(--severity-high-bg)",
  },
  {
    severity: "medium",
    label: "MEDIUM",
    color: "var(--severity-medium-text)",
    bg: "var(--severity-medium-bg)",
  },
  {
    severity: "low",
    label: "LOW",
    color: "var(--severity-low-text)",
    bg: "var(--severity-low-bg)",
  },
];

export function SeveritySummaryBar({
  criticalCount,
  highCount,
  mediumCount,
  lowCount,
  onSeverityClick,
}: SeveritySummaryBarProps) {
  const counts: Record<FindingSeverity, number> = {
    critical: criticalCount,
    high: highCount,
    medium: mediumCount,
    low: lowCount,
  };

  return (
    <div className="flex flex-wrap gap-2">
      {SEGMENTS.map((seg) => {
        const count = counts[seg.severity];
        if (count === 0) return null;
        return (
          <button
            key={seg.severity}
            onClick={() => onSeverityClick(seg.severity)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-opacity hover:opacity-80"
            style={{
              background: seg.bg,
              color: seg.color,
              borderRadius: 4,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: seg.color }}
            />
            {count} {seg.label}
          </button>
        );
      })}
    </div>
  );
}

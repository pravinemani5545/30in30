"use client";

import type { Finding, FindingSeverity } from "@/types/day10";
import { SeverityBadge } from "./SeverityBadge";
import { CategoryBadge } from "./CategoryBadge";
import { LineReference } from "./LineReference";
import { SuggestedFix } from "./SuggestedFix";

const BORDER_COLORS: Record<FindingSeverity, string> = {
  critical: "var(--severity-critical-border)",
  high: "var(--severity-high-border)",
  medium: "var(--severity-medium-border)",
  low: "var(--severity-low-border)",
};

const BG_TINTS: Record<FindingSeverity, string | undefined> = {
  critical: "var(--severity-critical-bg)",
  high: "var(--severity-high-bg)",
  medium: undefined,
  low: undefined,
};

export function FindingCard({ finding }: { finding: Finding }) {
  return (
    <div
      className="p-4"
      style={{
        borderLeft: `3px solid ${BORDER_COLORS[finding.severity]}`,
        background: BG_TINTS[finding.severity] ?? "var(--surface)",
        borderRadius: "0 4px 4px 0",
      }}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <SeverityBadge severity={finding.severity} />
        <CategoryBadge category={finding.category} />
        <LineReference reference={finding.lineReference} />
      </div>

      <h3
        className="text-[14px] font-semibold mb-2"
        style={{ color: "var(--foreground)" }}
      >
        {finding.title}
      </h3>

      <p
        className="text-[13px] leading-relaxed mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {finding.description}
      </p>

      <p
        className="text-[13px] leading-relaxed mb-1"
        style={{ color: "var(--text-tertiary)" }}
      >
        <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>
          Why {finding.severity}:
        </span>{" "}
        {finding.severityRationale}
      </p>

      <SuggestedFix code={finding.suggestedFix} />
    </div>
  );
}

"use client";

import { getScoreRange } from "@/lib/day11/scoring/rubric";

interface HistoryItem {
  id: string;
  overall_score: number;
  gate_passed: boolean;
  original_email: string;
  created_at: string;
}

interface HistoryStripProps {
  grades: HistoryItem[];
  onSelect: (id: string) => void;
  activeId?: string;
}

const RANGE_COLORS: Record<string, string> = {
  fail: "#EF4444",
  marginal: "#F97316",
  good: "#E8A020",
  strong: "#22C55E",
};

export function HistoryStrip({ grades, onSelect, activeId }: HistoryStripProps) {
  if (grades.length === 0) return null;

  return (
    <div
      className="border-t px-4 py-3"
      style={{ borderColor: "var(--border)" }}
    >
      <p
        className="font-sans font-bold uppercase mb-2"
        style={{
          fontSize: "10px",
          letterSpacing: "0.08em",
          color: "var(--text-tertiary)",
        }}
      >
        History
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {grades.map((g) => {
          const range = getScoreRange(g.overall_score);
          const color = RANGE_COLORS[range];
          const isActive = g.id === activeId;
          const snippet = g.original_email.slice(0, 40).trim();
          const date = new Date(g.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onSelect(g.id)}
              className="shrink-0 rounded-md border px-3 py-2 text-left transition-colors"
              style={{
                borderColor: isActive ? color : "var(--border)",
                background: isActive ? `${color}10` : "var(--surface)",
                minWidth: "160px",
                maxWidth: "200px",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-sans"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {date}
                </span>
                <span
                  className="text-xs font-sans font-bold ml-auto"
                  style={{ color }}
                >
                  {g.overall_score}/100
                </span>
              </div>
              <p
                className="text-xs font-sans truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {snippet}...
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

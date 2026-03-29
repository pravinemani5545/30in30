"use client";

import { Plus } from "lucide-react";
import { getScoreRange } from "@/lib/day11/scoring/rubric";

interface HistoryItem {
  id: string;
  overall_score: number;
  gate_passed: boolean;
  original_email: string;
  created_at: string;
}

interface HistorySidebarProps {
  grades: HistoryItem[];
  onSelect: (id: string) => void;
  onNew: () => void;
  activeId?: string;
}

const RANGE_COLORS: Record<string, string> = {
  fail: "#EF4444",
  marginal: "#F97316",
  good: "#E8A020",
  strong: "#22C55E",
};

export function HistorySidebar({
  grades,
  onSelect,
  onNew,
  activeId,
}: HistorySidebarProps) {
  return (
    <div
      className="border-r h-full flex flex-col"
      style={{ borderColor: "var(--border)" }}
    >
      {/* New grade button */}
      <div className="p-3">
        <button
          type="button"
          onClick={onNew}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-sans font-bold text-xs transition-colors"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--background)",
          }}
        >
          <Plus size={14} />
          New Grade
        </button>
      </div>

      {/* Header */}
      <div className="px-3 pb-2">
        <p
          className="font-sans font-bold uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.08em",
            color: "var(--text-tertiary)",
          }}
        >
          History {grades.length > 0 && `(${grades.length})`}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1.5">
        {grades.length === 0 ? (
          <p
            className="text-xs font-sans px-1 py-4 text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            Graded emails appear here.
          </p>
        ) : (
          grades.map((g) => {
            const range = getScoreRange(g.overall_score);
            const color = RANGE_COLORS[range];
            const isActive = g.id === activeId;
            const snippet = g.original_email.slice(0, 50).trim();
            const date = new Date(g.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelect(g.id)}
                className="w-full rounded-md border px-2.5 py-2 text-left transition-colors"
                style={{
                  borderColor: isActive ? color : "var(--border)",
                  background: isActive ? `${color}10` : "transparent",
                }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className="text-xs font-sans"
                    style={{ color: "var(--text-tertiary)", fontSize: "11px" }}
                  >
                    {date}
                  </span>
                  <span
                    className="text-xs font-sans font-bold"
                    style={{ color }}
                  >
                    {g.overall_score}
                  </span>
                </div>
                <p
                  className="font-sans truncate"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    lineHeight: "1.4",
                  }}
                >
                  {snippet}...
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

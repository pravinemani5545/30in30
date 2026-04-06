"use client";

import { Clock, ArrowRight } from "lucide-react";
import type { CheckHistoryItem, Grade } from "@/types/day17";

const GRADE_COLORS: Record<Grade, string> = {
  A: "var(--grade-a)",
  B: "var(--grade-b)",
  C: "var(--grade-c)",
  D: "var(--grade-d)",
  F: "var(--grade-f)",
};

interface CheckHistoryProps {
  history: CheckHistoryItem[];
  loading: boolean;
  onSelect: (id: string) => void;
}

export function CheckHistory({ history, loading, onSelect }: CheckHistoryProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-md skeleton-pulse"
            style={{ background: "var(--surface-raised)" }}
          />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
        No checks yet. Enter a domain above to get started.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((item) => {
        const color = GRADE_COLORS[item.overall_grade as Grade];
        const date = new Date(item.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="flex items-center gap-3 w-full rounded-md border px-3 py-2.5 text-left transition-colors hover:opacity-80"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <span
              className="flex items-center justify-center rounded-full text-xs font-bold shrink-0"
              style={{
                width: 32,
                height: 32,
                background: `color-mix(in srgb, ${color} 15%, transparent)`,
                border: `1.5px solid ${color}`,
                color,
                fontFamily: "var(--font-serif)",
                fontSize: 18,
              }}
            >
              {item.overall_grade}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--foreground)" }}
              >
                {item.domain}
              </p>
              <p
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                <Clock size={10} />
                {date}
              </p>
            </div>
            <ArrowRight
              size={14}
              style={{ color: "var(--text-tertiary)" }}
            />
          </button>
        );
      })}
    </div>
  );
}

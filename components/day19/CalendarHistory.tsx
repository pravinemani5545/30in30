"use client";

import { Trash2, Calendar, AlertTriangle } from "lucide-react";
import type { CalendarListItem } from "@/types/day19";

interface Props {
  calendars: CalendarListItem[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export function CalendarHistory({
  calendars,
  onSelect,
  onDelete,
  selectedId,
}: Props) {
  if (calendars.length === 0) return null;

  return (
    <div>
      <h3
        className="text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        Previous Calendars
      </h3>
      <div className="space-y-1.5">
        {calendars.map((cal) => (
          <div
            key={cal.id}
            className="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors hover:opacity-80"
            style={{
              borderColor:
                selectedId === cal.id ? "var(--accent)" : "var(--border)",
              backgroundColor:
                selectedId === cal.id
                  ? "var(--accent-subtle)"
                  : "var(--surface)",
            }}
            onClick={() => onSelect(cal.id)}
          >
            <Calendar size={14} style={{ color: "var(--text-tertiary)" }} />
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--foreground)" }}
              >
                {cal.month_label}
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                {cal.post_count} posts · {cal.pillars.slice(0, 2).join(", ")}
                {cal.pillars.length > 2 ? ` +${cal.pillars.length - 2}` : ""}
              </p>
            </div>
            {(cal.constraint_violations > 0 || cal.generic_output_warning) && (
              <AlertTriangle
                size={12}
                style={{ color: "var(--accent)", flexShrink: 0 }}
              />
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cal.id);
              }}
              className="p-1 rounded hover:opacity-70 cursor-pointer"
              style={{ color: "var(--text-tertiary)" }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

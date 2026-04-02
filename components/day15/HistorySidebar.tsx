"use client";

import { Clock, Trash2, AlertTriangle } from "lucide-react";
import type { SequenceHistoryItem } from "@/types/day15";

interface HistorySidebarProps {
  items: SequenceHistoryItem[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
}

export function HistorySidebar({
  items,
  loading,
  selectedId,
  onSelect,
  onDelete,
  deleting,
}: HistorySidebarProps) {
  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 rounded skeleton-pulse"
            style={{ background: "var(--surface-raised)" }}
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 p-6">
        <Clock size={20} style={{ color: "var(--text-tertiary)" }} />
        <p className="text-xs text-center" style={{ color: "var(--text-tertiary)" }}>
          Generated sequences will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      <p
        className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider"
        style={{ color: "var(--text-tertiary)" }}
      >
        History
      </p>
      {items.map((item) => (
        <div
          key={item.id}
          className="group flex items-center justify-between rounded-md px-2 py-2 cursor-pointer transition-colors"
          style={{
            background:
              selectedId === item.id
                ? "var(--surface-raised)"
                : "transparent",
          }}
          onClick={() => onSelect(item.id)}
        >
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-medium truncate"
              style={{ color: "var(--foreground)" }}
            >
              {item.persona.length > 40
                ? item.persona.slice(0, 40) + "..."
                : item.persona}
            </p>
            <div className="flex items-center gap-1.5">
              <p
                className="text-[10px]"
                style={{ color: "var(--text-tertiary)" }}
              >
                {new Date(item.created_at).toLocaleDateString()}
              </p>
              {item.has_followup_warning && (
                <AlertTriangle
                  size={10}
                  style={{ color: "var(--error)" }}
                />
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 rounded p-1 transition-opacity hover:opacity-70"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

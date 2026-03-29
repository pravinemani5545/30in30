"use client";

import { Trash2 } from "lucide-react";
import type { ThumbnailConceptSummary } from "@/types/day12";
import { DRIVERS } from "@/lib/day12/framework/galloway";

interface HistoryItemProps {
  item: ThumbnailConceptSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  deleting: boolean;
}

export function HistoryItem({
  item,
  isActive,
  onSelect,
  onDelete,
  deleting,
}: HistoryItemProps) {
  const date = new Date(item.created_at);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <button
      onClick={onSelect}
      className="w-full text-left px-3 py-2.5 rounded-md border transition-colors group"
      style={{
        backgroundColor: isActive
          ? "var(--surface-raised)"
          : "transparent",
        borderColor: isActive ? "var(--border)" : "transparent",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            className="text-[13px] font-medium truncate"
            style={{ color: "var(--foreground)" }}
          >
            {item.video_title.length > 40
              ? item.video_title.slice(0, 40) + "..."
              : item.video_title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-[10px] font-bold tracking-[0.08em] px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "rgb(232 160 32 / 0.08)",
                color: "var(--text-tertiary)",
              }}
            >
              {item.niche}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "var(--text-tertiary)" }}
            >
              {dateStr}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity hover:bg-white/5"
          aria-label="Delete"
        >
          <Trash2
            className="h-3.5 w-3.5"
            style={{ color: "var(--text-tertiary)" }}
          />
        </button>
      </div>
    </button>
  );
}

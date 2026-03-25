"use client";

import { Trash2 } from "lucide-react";
import type { GenerationListItem } from "@/types/day3";
import { formatDate } from "@/lib/day3/utils";

interface HistoryItemProps {
  item: GenerationListItem;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function HistoryItem({ item, isActive, onClick, onDelete }: HistoryItemProps) {
  return (
    <div
      className="group flex items-start gap-2 p-2.5 rounded-lg cursor-pointer transition-colors"
      style={{
        background: isActive ? "var(--accent-muted)" : "transparent",
        border: `1px solid ${isActive ? "rgba(232,160,32,0.25)" : "transparent"}`,
      }}
      onClick={onClick}
    >
      {item.article_favicon_url && (
        <img
          src={item.article_favicon_url}
          alt={item.article_domain ?? ""}
          width={14}
          height={14}
          className="mt-0.5 rounded-sm flex-shrink-0"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      )}

      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-medium truncate"
          style={{ color: isActive ? "var(--accent)" : "var(--text-primary)" }}
        >
          {item.article_title ?? item.article_domain ?? "Untitled"}
        </p>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {formatDate(item.created_at)}
          {item.top_hook_score != null && (
            <span className="ml-1" style={{ color: "var(--accent)" }}>
              · {item.top_hook_score}/10
            </span>
          )}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
        style={{ color: "var(--text-tertiary)" }}
        title="Delete"
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
}

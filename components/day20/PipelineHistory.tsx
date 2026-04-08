"use client";

import { Clock, Trash2 } from "lucide-react";
import type { RepurposedContentListItem } from "@/types/day20";

interface PipelineHistoryProps {
  items: RepurposedContentListItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PipelineHistory({
  items,
  activeId,
  onSelect,
  onDelete,
}: PipelineHistoryProps) {
  if (items.length === 0) {
    return (
      <div
        className="p-4"
        style={{
          fontFamily: "var(--font-day20-mono)",
          fontSize: "13px",
          color: "#555",
        }}
      >
        {">"} no pipelines run yet
        <span
          className="inline-block w-2 h-3.5 ml-0.5 align-middle"
          style={{
            background: "#00FF41",
            animation: "cursor-blink 1s infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = item.id === activeId;
        const title =
          item.source_text.slice(0, 40).trim() +
          (item.source_text.length > 40 ? "..." : "");
        const date = new Date(item.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <div
            key={item.id}
            className="group flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all"
            style={{
              border: isActive
                ? "1px solid rgba(0,255,65,0.2)"
                : "1px solid transparent",
              background: isActive ? "rgba(0,255,65,0.03)" : "transparent",
            }}
            onClick={() => onSelect(item.id)}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = "rgba(0,255,65,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = "transparent";
              }
            }}
          >
            <div className="min-w-0 flex-1">
              <p
                className="truncate"
                style={{
                  fontFamily: "var(--font-day20-body)",
                  fontSize: "13px",
                  color: isActive ? "#eeeeee" : "#999",
                }}
              >
                {title}
              </p>
              <div
                className="flex items-center gap-1.5 mt-1"
                style={{
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "10px",
                  color: "#555",
                }}
              >
                <Clock className="w-3 h-3" />
                <span>{date}</span>
                <span style={{ color: "#2a2a2a" }}>|</span>
                <span>{item.word_count}w</span>
                {item.had_voice_calibration && (
                  <>
                    <span style={{ color: "#2a2a2a" }}>|</span>
                    <span style={{ color: "#00FF41" }}>VOICE</span>
                  </>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#555",
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

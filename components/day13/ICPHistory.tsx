"use client";

import type { ICPProfileSummary } from "@/types/day13";
import { Trash2 } from "lucide-react";

interface Props {
  items: ICPProfileSummary[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  deleting: boolean;
}

export function ICPHistory({
  items,
  loading,
  selectedId,
  onSelect,
  onDelete,
  deleting,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 rounded-md skeleton-pulse"
            style={{ backgroundColor: "var(--surface-raised)" }}
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="space-y-1">
      <p
        className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2"
        style={{ color: "var(--text-tertiary)" }}
      >
        History
      </p>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors group"
          style={{
            backgroundColor:
              selectedId === item.id
                ? "var(--surface-raised)"
                : "transparent",
          }}
          onClick={() => onSelect(item.id)}
        >
          <div className="min-w-0">
            <p
              className="text-sm truncate"
              style={{ color: "var(--foreground)" }}
            >
              {item.company_name}
            </p>
            <p
              className="text-[11px]"
              style={{ color: "var(--text-tertiary)" }}
            >
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            type="button"
            disabled={deleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 transition-opacity"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

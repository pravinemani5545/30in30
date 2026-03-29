"use client";

import { Clock } from "lucide-react";
import type { ThumbnailConceptSummary } from "@/types/day12";
import { HistoryItem } from "./HistoryItem";
import { useDeleteConcept } from "@/hooks/day12/useDeleteConcept";

interface HistorySidebarProps {
  items: ThumbnailConceptSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDeleted: (id: string) => void;
  loading: boolean;
}

export function HistorySidebar({
  items,
  activeId,
  onSelect,
  onDeleted,
  loading,
}: HistorySidebarProps) {
  const { deleteConcept, deleting } = useDeleteConcept(onDeleted);

  return (
    <aside
      className="w-full lg:w-[280px] flex-shrink-0 border-r lg:border-r lg:border-b-0 border-b overflow-y-auto"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <Clock
          className="h-4 w-4"
          style={{ color: "var(--text-tertiary)" }}
        />
        <span
          className="text-[13px] font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          History
        </span>
      </div>
      <div className="p-2 space-y-0.5">
        {loading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 rounded skeleton-pulse"
                style={{ backgroundColor: "var(--surface-raised)" }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p
            className="text-[12px] px-3 py-4 text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            No generations yet
          </p>
        ) : (
          items.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onSelect={() => onSelect(item.id)}
              onDelete={() => deleteConcept(item.id)}
              deleting={deleting === item.id}
            />
          ))
        )}
      </div>
    </aside>
  );
}

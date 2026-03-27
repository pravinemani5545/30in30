"use client";

import { User, Building2, Clock, Trash2 } from "lucide-react";
import type { BriefingSummary } from "@/types/day9";

interface HistorySidebarProps {
  briefings: BriefingSummary[];
  activeBriefingId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function HistorySidebar({
  briefings,
  activeBriefingId,
  onSelect,
  onDelete,
  isLoading,
}: HistorySidebarProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-16 rounded bg-[var(--surface)] skeleton-pulse"
          />
        ))}
      </div>
    );
  }

  if (briefings.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-[var(--text-tertiary)]">
          No briefings yet
        </p>
        <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
          Generate your first intelligence brief
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      {briefings.map((b) => {
        const isActive = b.id === activeBriefingId;
        const date = new Date(b.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const isPending = b.status !== "complete" && b.status !== "failed";

        return (
          <button
            key={b.id}
            onClick={() => onSelect(b.id)}
            className={`w-full text-left px-4 py-3 border-b border-[var(--border)] transition-colors group ${
              isActive
                ? "bg-[var(--surface-raised)]"
                : "hover:bg-[var(--surface)]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[var(--text-tertiary)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--foreground)] truncate">
                    {b.person_name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3 h-3 text-[var(--text-tertiary)] shrink-0" />
                  <span className="text-[12px] text-[var(--text-secondary)] truncate">
                    {b.company_name}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1 line-clamp-1">
                  {b.meeting_context}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[var(--text-tertiary)]" />
                  <span className="text-[11px] text-[var(--text-tertiary)]">
                    {date}
                  </span>
                </div>
                {isPending && (
                  <span className="text-[10px] text-[#E8A020]">
                    {b.status}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(b.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-[var(--text-tertiary)] hover:text-[#EF4444] transition-all"
                  title="Delete briefing"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

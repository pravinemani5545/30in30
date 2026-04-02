"use client";

import { Trash2 } from "lucide-react";
import { HookBadge } from "./HookBadge";
import type { ScriptSummary, HookQuality } from "@/types/day14";

interface ScriptLibraryItemProps {
  script: ScriptSummary;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ScriptLibraryItem({
  script,
  isActive,
  onSelect,
  onDelete,
}: ScriptLibraryItemProps) {
  const date = new Date(script.created_at);
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <button
      type="button"
      onClick={() => onSelect(script.id)}
      className="group w-full rounded-md px-3 py-2.5 text-left transition-colors"
      style={{
        background: isActive
          ? "var(--surface-raised, #1A1A1A)"
          : "transparent",
        border: `1px solid ${isActive ? "var(--border)" : "transparent"}`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className="line-clamp-2 text-sm"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {script.topic}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(script.id);
          }}
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: "var(--text-tertiary, #555250)" }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <span
          className="text-xs"
          style={{ color: "var(--text-tertiary, #555250)" }}
        >
          {script.target_duration}min · {dateStr}
        </span>
        {script.hook_quality && (
          <HookBadge quality={script.hook_quality as HookQuality} />
        )}
      </div>
    </button>
  );
}

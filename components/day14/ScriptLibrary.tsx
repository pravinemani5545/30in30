"use client";

import { ScrollText } from "lucide-react";
import { ScriptLibraryItem } from "./ScriptLibraryItem";
import type { ScriptSummary } from "@/types/day14";

interface ScriptLibraryProps {
  scripts: ScriptSummary[];
  loading: boolean;
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ScriptLibrary({
  scripts,
  loading,
  activeId,
  onSelect,
  onDelete,
}: ScriptLibraryProps) {
  return (
    <div className="flex h-full flex-col">
      <div
        className="flex items-center gap-2 border-b px-4 py-3"
        style={{ borderColor: "var(--border)" }}
      >
        <ScrollText className="h-4 w-4" style={{ color: "var(--accent)" }} />
        <span
          className="text-xs font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
        >
          Script Library
        </span>
        <span
          className="ml-auto text-xs"
          style={{ color: "var(--text-tertiary, #555250)" }}
        >
          {scripts.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-16 animate-pulse rounded-md"
                style={{ background: "var(--surface-raised, #1A1A1A)" }}
              />
            ))}
          </div>
        ) : scripts.length === 0 ? (
          <p
            className="p-4 text-center text-xs"
            style={{ color: "var(--text-tertiary, #555250)" }}
          >
            No scripts yet. Generate your first one.
          </p>
        ) : (
          <div className="space-y-1">
            {scripts.map((s) => (
              <ScriptLibraryItem
                key={s.id}
                script={s}
                isActive={s.id === activeId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

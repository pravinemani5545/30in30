"use client";

import { X, FileText } from "lucide-react";

interface ScriptBannerProps {
  scriptTitle: string;
  onDismiss: () => void;
}

export function ScriptBanner({ scriptTitle, onDismiss }: ScriptBannerProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-[var(--accent)] bg-[var(--accent-subtle)] px-3 py-2">
      <FileText className="h-4 w-4 shrink-0 text-[var(--accent)]" />
      <span className="flex-1 truncate text-sm text-[var(--accent)]">
        From script: {scriptTitle}
      </span>
      <button
        onClick={onDismiss}
        className="shrink-0 rounded p-0.5 text-[var(--accent)] hover:bg-[var(--accent-subtle)]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

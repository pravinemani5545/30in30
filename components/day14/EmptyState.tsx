"use client";

import { FileText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: "var(--surface-raised, #1A1A1A)" }}
      >
        <FileText className="h-6 w-6" style={{ color: "var(--accent)" }} />
      </div>
      <h3
        className="mb-1 text-base font-medium"
        style={{
          color: "var(--foreground)",
          fontFamily: "var(--font-serif)",
        }}
      >
        No script loaded
      </h3>
      <p
        className="max-w-xs text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Enter a video topic and duration above to generate a script, or select
        one from the library.
      </p>
    </div>
  );
}

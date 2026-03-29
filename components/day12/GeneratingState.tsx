"use client";

import { Loader2 } from "lucide-react";

export function GeneratingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Loader2
        className="h-8 w-8 animate-spin"
        style={{ color: "var(--accent)" }}
      />
      <div className="text-center space-y-1">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--foreground)" }}
        >
          Generating thumbnail concepts...
        </p>
        <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
          Analysing three psychological drivers for your niche
        </p>
      </div>
    </div>
  );
}

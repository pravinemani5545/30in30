"use client";

import { Loader2 } from "lucide-react";

export function GeneratingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Loader2
        size={32}
        className="animate-spin"
        style={{ color: "var(--accent)" }}
      />
      <div className="text-center space-y-1">
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          Generating your 5-email sequence...
        </p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          All 5 emails in one call for arc coherence. Takes 20-30 seconds.
        </p>
      </div>
    </div>
  );
}

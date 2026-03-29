"use client";

import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        className="flex items-center justify-center h-12 w-12 rounded-full"
        style={{ backgroundColor: "rgb(232 160 32 / 0.10)" }}
      >
        <Sparkles className="h-6 w-6" style={{ color: "var(--accent)" }} />
      </div>
      <div className="text-center space-y-1 max-w-sm">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--foreground)" }}
        >
          Your thumbnail is a billboard on a highway doing 60mph
        </p>
        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Enter your video title, niche, and tone above to generate three
          competing thumbnail concepts using Paddy Galloway&apos;s framework.
        </p>
      </div>
    </div>
  );
}

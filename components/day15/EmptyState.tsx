"use client";

import { Mail } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Mail size={40} style={{ color: "var(--text-tertiary)" }} />
      <div className="text-center space-y-1">
        <p
          className="text-lg"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--foreground)",
          }}
        >
          5-Email Outbound Sequence
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Enter your persona, value prop, and social proof to generate a
          complete five-email sequence with the psychological arc built in.
        </p>
      </div>
    </div>
  );
}

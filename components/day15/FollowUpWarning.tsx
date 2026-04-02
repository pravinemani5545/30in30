"use client";

import { AlertTriangle } from "lucide-react";

export function FollowUpWarning() {
  return (
    <div
      className="flex items-center gap-2 rounded px-3 py-2 text-xs font-medium"
      style={{
        background: "rgb(239 68 68 / 0.12)",
        color: "var(--error)",
        border: "1px solid var(--error)",
      }}
    >
      <AlertTriangle size={14} />
      Detected follow-up language in this email — edit before sending
    </div>
  );
}

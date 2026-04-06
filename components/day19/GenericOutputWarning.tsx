"use client";

import { AlertTriangle } from "lucide-react";

export function GenericOutputWarning() {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg border"
      style={{
        backgroundColor: "color-mix(in srgb, var(--accent) 8%, transparent)",
        borderColor: "var(--accent)",
      }}
    >
      <AlertTriangle
        size={16}
        style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}
      />
      <p className="text-xs" style={{ color: "var(--accent)" }}>
        Some topics may be too generic — consider strengthening your unique angle
        and regenerating.
      </p>
    </div>
  );
}

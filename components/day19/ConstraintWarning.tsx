"use client";

import { AlertTriangle } from "lucide-react";

interface Props {
  violations: number;
}

export function ConstraintWarning({ violations }: Props) {
  if (violations === 0) return null;

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg border"
      style={{
        backgroundColor: "color-mix(in srgb, var(--error) 8%, transparent)",
        borderColor: "color-mix(in srgb, var(--error) 40%, transparent)",
      }}
    >
      <AlertTriangle
        size={16}
        style={{ color: "var(--error)", flexShrink: 0, marginTop: 2 }}
      />
      <p className="text-xs" style={{ color: "var(--error)" }}>
        {violations} day{violations > 1 ? "s" : ""} exceed the 2 high-effort
        posts per 7-day window limit. These are highlighted in the calendar.
      </p>
    </div>
  );
}

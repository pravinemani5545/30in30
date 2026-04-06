"use client";

import type { ContentFormat } from "@/types/day19";
import { FORMAT_LABELS } from "@/types/day19";

const FORMAT_COLORS: Record<ContentFormat, string> = {
  video: "var(--format-video)",
  thread: "var(--format-thread)",
  essay: "var(--format-essay)",
  short: "var(--format-short)",
  newsletter: "var(--format-newsletter)",
};

export function FormatBadge({ format }: { format: ContentFormat }) {
  const color = FORMAT_COLORS[format];
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-px font-semibold uppercase tracking-wide leading-none"
      style={{
        fontSize: 9,
        fontFamily: "var(--font-sans)",
        color,
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
      }}
    >
      {FORMAT_LABELS[format]}
    </span>
  );
}

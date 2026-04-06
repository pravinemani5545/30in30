"use client";

import type { Platform } from "@/types/day19";

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: "var(--platform-youtube)",
  x: "var(--platform-x)",
  newsletter: "var(--platform-newsletter)",
  linkedin: "var(--platform-linkedin)",
};

const SHORT_LABELS: Record<Platform, string> = {
  youtube: "YT",
  x: "X",
  newsletter: "NL",
  linkedin: "LI",
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  const color = PLATFORM_COLORS[platform];
  return (
    <span
      className="inline-flex items-center rounded-full px-1.5 py-px font-bold uppercase tracking-wide leading-none"
      style={{
        fontSize: 8,
        fontFamily: "var(--font-sans)",
        color,
        backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      }}
    >
      {SHORT_LABELS[platform]}
    </span>
  );
}

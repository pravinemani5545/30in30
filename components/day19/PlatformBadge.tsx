"use client";

import type { Platform } from "@/types/day19";
import { PLATFORM_LABELS } from "@/types/day19";

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: "var(--platform-youtube)",
  x: "var(--platform-x)",
  newsletter: "var(--platform-newsletter)",
  linkedin: "var(--platform-linkedin)",
};

export function PlatformBadge({ platform }: { platform: Platform }) {
  const color = PLATFORM_COLORS[platform];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-bold uppercase tracking-wider"
      style={{
        fontSize: 10,
        fontFamily: "var(--font-sans)",
        color,
        backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      }}
    >
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

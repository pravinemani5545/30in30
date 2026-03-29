"use client";

import type { Driver } from "@/types/day12";

const DRIVER_CONFIG: Record<
  Driver,
  { label: string; bg: string; text: string }
> = {
  curiosity_gap: {
    label: "CURIOSITY GAP",
    bg: "rgb(139 92 246 / 0.15)",
    text: "#8B5CF6",
  },
  pattern_interrupt: {
    label: "PATTERN INTERRUPT",
    bg: "rgb(6 182 212 / 0.15)",
    text: "#06B6D4",
  },
  emotion_signal: {
    label: "EMOTION SIGNAL",
    bg: "rgb(249 115 22 / 0.15)",
    text: "#F97316",
  },
};

export function DriverBadge({ driver }: { driver: Driver }) {
  const config = DRIVER_CONFIG[driver];

  return (
    <div
      className="w-full py-2 px-3 rounded-t-md"
      style={{ backgroundColor: config.bg }}
    >
      <span
        className="text-[10px] font-bold tracking-[0.12em]"
        style={{ color: config.text, fontFamily: "var(--font-sans)" }}
      >
        {config.label}
      </span>
    </div>
  );
}

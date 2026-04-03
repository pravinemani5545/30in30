"use client";

import { MAX_CHARACTERS } from "@/lib/day16/voiceover/cost";

interface CharacterCountBarProps {
  count: number;
}

export function CharacterCountBar({ count }: CharacterCountBarProps) {
  const percentage = Math.min((count / MAX_CHARACTERS) * 100, 100);
  const barColor =
    percentage >= 100
      ? "var(--cost-high)"
      : percentage >= 75
        ? "var(--cost-mid)"
        : "var(--cost-low)";

  return (
    <div className="space-y-1">
      <div className="h-1 w-full rounded-full bg-[var(--border)]">
        <div
          className="h-1 rounded-full transition-all duration-200"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="flex justify-between font-mono text-[11px]">
        <span
          className="font-semibold"
          style={{ color: barColor }}
        >
          {count.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
        </span>
        <span className="text-[var(--text-tertiary)]">characters</span>
      </div>
    </div>
  );
}

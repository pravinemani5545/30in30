"use client";

import { motion } from "framer-motion";

interface WordCountBarProps {
  current: number;
  target: number;
}

export function WordCountBar({ current, target }: WordCountBarProps) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const ratio = target > 0 ? current / target : 0;

  const barColor =
    ratio >= 0.9
      ? "var(--wc-at)"
      : ratio >= 0.7
        ? "var(--wc-near)"
        : "var(--wc-under)";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span
          className="font-bold tabular-nums"
          style={{ color: barColor, fontFamily: "var(--font-sans)" }}
        >
          {current.toLocaleString()} / {target.toLocaleString()} words
        </span>
        <span style={{ color: "var(--text-secondary)" }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: "var(--surface-raised, #1A1A1A)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

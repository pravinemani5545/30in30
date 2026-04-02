"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertTriangle, Loader2 } from "lucide-react";
import type { HookQuality } from "@/types/day14";

interface HookBadgeProps {
  quality: HookQuality | null;
  reasoning?: string | null;
}

const CONFIG: Record<
  HookQuality,
  { label: string; color: string; icon: typeof Check }
> = {
  strong: { label: "STRONG HOOK", color: "var(--hook-strong)", icon: Check },
  weak: { label: "WEAK HOOK", color: "var(--hook-weak)", icon: AlertTriangle },
  pending: { label: "VALIDATING HOOK...", color: "var(--hook-pending)", icon: Loader2 },
};

export function HookBadge({ quality, reasoning }: HookBadgeProps) {
  const state = quality ?? "pending";
  const { label, color, icon: Icon } = CONFIG[state];
  const isPending = state === "pending";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="group relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
        style={{
          border: `1px solid ${color}`,
          color,
        }}
      >
        <Icon
          className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`}
        />
        <span
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {label}
        </span>
        {reasoning && !isPending && (
          <div
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-md px-3 py-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background: "var(--surface-raised, #1A1A1A)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {reasoning}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

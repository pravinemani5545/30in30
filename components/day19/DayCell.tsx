"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { PostItem } from "@/types/day19";
import { PostCard } from "./PostCard";

interface Props {
  dayNumber: number;
  posts: PostItem[];
  index: number;
  selected: boolean;
  onSelect: (dayNumber: number) => void;
}

export const DayCell = memo(function DayCell({
  dayNumber,
  posts,
  index,
  selected,
  onSelect,
}: Props) {
  const hasViolation = posts.some((p) => p.windowViolation);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(dayNumber)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="min-h-[80px] rounded-lg border p-1.5 text-left cursor-pointer transition-colors hover:border-[var(--accent)]"
      style={{
        backgroundColor: hasViolation
          ? "color-mix(in srgb, var(--error) 5%, var(--background))"
          : "var(--background)",
        borderColor: selected ? "var(--accent)" : "var(--border)",
        borderWidth: selected ? 2 : 1,
      }}
    >
      <p
        className="font-bold mb-1"
        style={{ fontSize: 9, color: "var(--text-tertiary)" }}
      >
        DAY {dayNumber}
      </p>
      <div className="space-y-1">
        {posts.map((post, i) => (
          <PostCard key={`${post.dayNumber}-${post.platform}-${i}`} post={post} />
        ))}
      </div>
    </motion.button>
  );
});

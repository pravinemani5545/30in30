"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { PostItem } from "@/types/day19";
import { PostCard } from "./PostCard";

interface Props {
  dayNumber: number;
  posts: PostItem[];
  index: number;
}

export const DayCell = memo(function DayCell({ dayNumber, posts, index }: Props) {
  const hasViolation = posts.some((p) => p.windowViolation);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="min-h-[100px] rounded-lg border p-2"
      style={{
        backgroundColor: hasViolation
          ? "color-mix(in srgb, var(--error) 5%, var(--background))"
          : "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="text-[11px] font-bold mb-1.5"
        style={{ color: "var(--text-tertiary)" }}
      >
        DAY {dayNumber}
      </p>
      <div className="space-y-1.5">
        {posts.map((post, i) => (
          <PostCard key={`${post.dayNumber}-${post.platform}-${i}`} post={post} />
        ))}
      </div>
    </motion.div>
  );
});

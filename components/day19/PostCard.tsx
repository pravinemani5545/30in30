"use client";

import { memo } from "react";
import type { PostItem } from "@/types/day19";
import { PlatformBadge } from "./PlatformBadge";
import { EffortBadge } from "./EffortBadge";

interface Props {
  post: PostItem;
}

export const PostCard = memo(function PostCard({ post }: Props) {
  return (
    <div
      className="rounded-md border p-2 transition-colors group relative"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: post.windowViolation
          ? "var(--error)"
          : "var(--border)",
        borderLeftWidth: post.effortLevel === "high" ? 3 : 1,
        borderLeftColor:
          post.effortLevel === "high"
            ? "var(--effort-high)"
            : undefined,
      }}
    >
      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
        <PlatformBadge platform={post.platform} />
        <EffortBadge level={post.effortLevel} />
      </div>
      <p
        className="text-xs leading-snug line-clamp-2"
        style={{ color: "var(--foreground)", fontFamily: "var(--font-sans)" }}
      >
        {post.topic}
      </p>

      {/* Tooltip on hover */}
      <div
        className="absolute z-50 left-0 right-0 top-full mt-1 p-3 rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none"
        style={{
          backgroundColor: "var(--surface-raised)",
          borderColor: "var(--border)",
        }}
      >
        <p
          className="text-xs font-medium mb-1"
          style={{ color: "var(--foreground)" }}
        >
          {post.topic}
        </p>
        <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
          {post.postingTime} · {post.format}
        </p>
        {post.rationale && (
          <p
            className="text-[10px] mt-1 italic"
            style={{ color: "var(--text-tertiary)" }}
          >
            {post.rationale}
          </p>
        )}
      </div>
    </div>
  );
});

"use client";

import { X } from "lucide-react";
import type { PostItem } from "@/types/day19";
import { PlatformBadge } from "./PlatformBadge";
import { EffortBadge } from "./EffortBadge";
import { FormatBadge } from "./FormatBadge";
import { RepurposingMap } from "./RepurposingMap";
import { PLATFORM_LABELS } from "@/types/day19";

interface Props {
  dayNumber: number;
  posts: PostItem[];
  allPosts: PostItem[];
  onClose: () => void;
}

export function DayDetail({ dayNumber, posts, allPosts, onClose }: Props) {
  if (posts.length === 0) return null;

  const dayOfWeek = posts[0]?.dayOfWeek ?? "";

  return (
    <div
      className="rounded-lg border p-4 mt-2"
      style={{
        backgroundColor: "var(--surface-raised)",
        borderColor: "var(--accent)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-sm font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Day {dayNumber} · {dayOfWeek}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:opacity-70 cursor-pointer"
          style={{ color: "var(--text-tertiary)" }}
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {posts.map((post, i) => (
          <div
            key={`${post.dayNumber}-${post.platform}-${i}`}
            className="rounded-lg border p-3"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: post.windowViolation
                ? "var(--error)"
                : "var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {PLATFORM_LABELS[post.platform]}
              </span>
              <FormatBadge format={post.format} />
              <EffortBadge level={post.effortLevel} />
              <span
                className="text-[10px] ml-auto"
                style={{ color: "var(--text-tertiary)" }}
              >
                {post.postingTime}
              </span>
            </div>

            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--foreground)" }}
            >
              {post.topic}
            </p>

            {post.rationale && (
              <p
                className="text-xs italic"
                style={{ color: "var(--text-tertiary)" }}
              >
                {post.rationale}
              </p>
            )}

            <RepurposingMap post={post} allPosts={allPosts} />
          </div>
        ))}
      </div>
    </div>
  );
}

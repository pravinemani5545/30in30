"use client";

import { memo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { PostItem } from "@/types/day19";
import { PlatformBadge } from "./PlatformBadge";
import { EffortBadge } from "./EffortBadge";
import { FormatBadge } from "./FormatBadge";
import { RepurposingMap } from "./RepurposingMap";

interface Props {
  post: PostItem;
  allPosts: PostItem[];
}

export const ListRow = memo(function ListRow({ post, allPosts }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasRepurposing =
    (post.repurposingMap?.derivedPosts?.length ?? 0) > 0 ||
    post.repurposingMap?.parentDayNumber != null;

  return (
    <div
      className="border-b last:border-b-0 transition-colors"
      style={{
        borderColor: "var(--border)",
        backgroundColor: post.windowViolation
          ? "color-mix(in srgb, var(--error) 5%, transparent)"
          : "transparent",
      }}
    >
      <button
        type="button"
        onClick={() => hasRepurposing && setExpanded(!expanded)}
        className="w-full grid grid-cols-[40px_1fr_90px_80px_70px_90px_24px] gap-2 items-center px-3 py-2.5 text-left cursor-pointer hover:bg-[var(--surface)]"
      >
        <span
          className="text-[11px] font-bold"
          style={{ color: "var(--text-tertiary)" }}
        >
          {post.dayNumber}
        </span>
        <span
          className="text-[13px] font-medium truncate"
          style={{ color: "var(--foreground)" }}
        >
          {post.topic}
        </span>
        <PlatformBadge platform={post.platform} />
        <FormatBadge format={post.format} />
        <EffortBadge level={post.effortLevel} />
        <span
          className="text-[11px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          {post.postingTime}
        </span>
        <span style={{ color: "var(--text-tertiary)" }}>
          {hasRepurposing ? (
            expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <span className="w-[14px]" />
          )}
        </span>
      </button>
      {expanded && hasRepurposing && (
        <div className="px-3 pb-3">
          <RepurposingMap post={post} allPosts={allPosts} />
        </div>
      )}
    </div>
  );
});

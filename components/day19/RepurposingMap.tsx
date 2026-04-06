"use client";

import { ArrowRight } from "lucide-react";
import type { PostItem } from "@/types/day19";
import { PlatformBadge } from "./PlatformBadge";
import type { Platform } from "@/types/day19";

const DERIVATION_LABELS: Record<string, string> = {
  thread_from_video: "Extract key argument",
  newsletter_from_video: "Expand with data",
  short_from_thread: "Single insight",
  short_from_video: "Quick take",
};

interface Props {
  post: PostItem;
  allPosts: PostItem[];
}

export function RepurposingMap({ post, allPosts }: Props) {
  const hasDerived = post.repurposingMap?.derivedPosts?.length;
  const hasParent = post.repurposingMap?.parentDayNumber;

  if (!hasDerived && !hasParent) return null;

  // If this is a source post, show derived posts
  if (hasDerived) {
    return (
      <div
        className="flex items-center gap-2 flex-wrap mt-2 pt-2 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <span
          className="text-[11px] italic"
          style={{ color: "var(--text-secondary)" }}
        >
          Repurposed to:
        </span>
        {post.repurposingMap!.derivedPosts.map((d, i) => (
          <div key={i} className="flex items-center gap-1">
            <ArrowRight
              size={12}
              style={{ color: "var(--accent)" }}
            />
            <PlatformBadge platform={d.platform as Platform} />
            <span
              className="text-[10px]"
              style={{ color: "var(--text-tertiary)" }}
            >
              Day {d.dayNumber} · {DERIVATION_LABELS[d.derivationType] ?? d.derivationType}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // If this is a derived post, show parent
  if (hasParent) {
    const parent = allPosts.find(
      (p) => p.dayNumber === post.repurposingMap!.parentDayNumber,
    );
    if (!parent) return null;

    return (
      <div
        className="flex items-center gap-2 mt-2 pt-2 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <span
          className="text-[11px] italic"
          style={{ color: "var(--text-secondary)" }}
        >
          Derived from Day {parent.dayNumber}:
        </span>
        <PlatformBadge platform={parent.platform} />
        <span
          className="text-[10px] truncate max-w-[200px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          {parent.topic}
        </span>
      </div>
    );
  }

  return null;
}

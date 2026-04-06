"use client";

import type { PostItem, Platform, EffortLevel } from "@/types/day19";
import { PLATFORM_LABELS, EFFORT_LABELS } from "@/types/day19";
import { PLATFORMS, EFFORT_LEVELS } from "@/lib/day19/calendar/arc";
import { ListRow } from "./ListRow";

interface Props {
  posts: PostItem[];
  allPosts: PostItem[];
  platformFilter: Platform | "all";
  effortFilter: EffortLevel | "all";
  onPlatformFilter: (v: Platform | "all") => void;
  onEffortFilter: (v: EffortLevel | "all") => void;
}

export function ListView({
  posts,
  allPosts,
  platformFilter,
  effortFilter,
  onPlatformFilter,
  onEffortFilter,
}: Props) {
  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider mr-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Platform:
          </span>
          <FilterPill
            label="All"
            active={platformFilter === "all"}
            onClick={() => onPlatformFilter("all")}
          />
          {PLATFORMS.map((p) => (
            <FilterPill
              key={p}
              label={PLATFORM_LABELS[p]}
              active={platformFilter === p}
              onClick={() => onPlatformFilter(p)}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider mr-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Effort:
          </span>
          <FilterPill
            label="All"
            active={effortFilter === "all"}
            onClick={() => onEffortFilter("all")}
          />
          {EFFORT_LEVELS.map((e) => (
            <FilterPill
              key={e}
              label={EFFORT_LABELS[e]}
              active={effortFilter === e}
              onClick={() => onEffortFilter(e)}
            />
          ))}
        </div>
      </div>

      {/* Table header */}
      <div
        className="grid grid-cols-[40px_1fr_90px_80px_70px_90px_24px] gap-2 px-3 py-2 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {["Day", "Topic", "Platform", "Format", "Effort", "Time", ""].map(
          (h) => (
            <span
              key={h}
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              {h}
            </span>
          ),
        )}
      </div>

      {/* Rows */}
      <div>
        {posts.length === 0 ? (
          <p
            className="text-center py-8 text-sm"
            style={{ color: "var(--text-tertiary)" }}
          >
            No posts match the current filters.
          </p>
        ) : (
          posts.map((post, i) => (
            <ListRow
              key={`${post.dayNumber}-${post.platform}-${i}`}
              post={post}
              allPosts={allPosts}
            />
          ))
        )}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors"
      style={{
        backgroundColor: active ? "var(--accent)" : "var(--surface)",
        color: active ? "var(--background)" : "var(--text-secondary)",
        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
      }}
    >
      {label}
    </button>
  );
}

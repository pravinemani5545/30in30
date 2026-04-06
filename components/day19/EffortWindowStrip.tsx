"use client";

import type { PostItem } from "@/types/day19";

const EFFORT_DOT_COLORS = {
  high: "var(--effort-high)",
  medium: "var(--effort-medium)",
  low: "var(--effort-low)",
};

interface Props {
  posts: PostItem[];
}

export function EffortWindowStrip({ posts }: Props) {
  // Build a map: day -> highest effort level
  const dayEffort = new Map<number, "high" | "medium" | "low">();
  for (const post of posts) {
    const current = dayEffort.get(post.dayNumber);
    if (!current || effortRank(post.effortLevel) > effortRank(current)) {
      dayEffort.set(post.dayNumber, post.effortLevel);
    }
  }

  // Check which days have violations
  const violatingDays = new Set(
    posts.filter((p) => p.windowViolation).map((p) => p.dayNumber),
  );

  return (
    <div
      className="rounded-lg border p-3"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        30-Day Effort Distribution
      </p>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const effort = dayEffort.get(day);
          const isViolation = violatingDays.has(day);
          const isWeekBoundary = day > 1 && (day - 1) % 7 === 0;

          return (
            <div key={day} className="flex items-center">
              {isWeekBoundary && (
                <div
                  className="w-px h-5 mx-0.5"
                  style={{ backgroundColor: "var(--border)" }}
                />
              )}
              <div className="flex flex-col items-center gap-0.5">
                <div
                  className="w-2.5 h-2.5 rounded-full transition-colors"
                  style={{
                    backgroundColor: effort
                      ? EFFORT_DOT_COLORS[effort]
                      : "var(--border)",
                  }}
                  title={`Day ${day}: ${effort ?? "no posts"}`}
                />
                {isViolation && (
                  <div
                    className="w-2.5 h-0.5 rounded-full"
                    style={{ backgroundColor: "var(--error)" }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-2">
        {(["low", "medium", "high"] as const).map((level) => (
          <div key={level} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: EFFORT_DOT_COLORS[level] }}
            />
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              {level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function effortRank(level: string): number {
  if (level === "high") return 3;
  if (level === "medium") return 2;
  return 1;
}

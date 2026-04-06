"use client";

import { useState } from "react";
import type { PostItem } from "@/types/day19";
import { DayCell } from "./DayCell";
import { DayDetail } from "./DayDetail";

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface Props {
  posts: PostItem[];
}

export function CalendarGrid({ posts }: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Group posts by day number
  const byDay = new Map<number, PostItem[]>();
  for (const post of posts) {
    const existing = byDay.get(post.dayNumber) ?? [];
    existing.push(post);
    byDay.set(post.dayNumber, existing);
  }

  function handleSelect(dayNumber: number) {
    setSelectedDay((prev) => (prev === dayNumber ? null : dayNumber));
  }

  const selectedPosts = selectedDay ? byDay.get(selectedDay) ?? [] : [];

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold uppercase tracking-widest py-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid: 5 weeks */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }, (_, i) => {
          const dayNumber = i + 1;
          if (dayNumber > 30) {
            return (
              <div
                key={`empty-${i}`}
                className="min-h-[80px] rounded-lg"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--surface) 30%, transparent)",
                }}
              />
            );
          }
          const dayPosts = byDay.get(dayNumber) ?? [];
          return (
            <DayCell
              key={dayNumber}
              dayNumber={dayNumber}
              posts={dayPosts}
              index={i}
              selected={selectedDay === dayNumber}
              onSelect={handleSelect}
            />
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedDay && selectedPosts.length > 0 && (
        <DayDetail
          dayNumber={selectedDay}
          posts={selectedPosts}
          allPosts={posts}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {/* Week labels */}
      <div className="grid grid-cols-5 gap-1 mt-2">
        {Array.from({ length: 5 }, (_, w) => {
          const start = w * 7 + 1;
          const end = Math.min(start + 6, 30);
          return (
            <div
              key={w}
              className="text-center text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              Week {w + 1} · Days {start}-{end}
            </div>
          );
        })}
      </div>
    </div>
  );
}

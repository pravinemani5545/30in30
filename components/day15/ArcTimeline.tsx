"use client";

import { EMAIL_TYPES, SEQUENCE_EMAIL_ORDER } from "@/lib/day15/sequence/arc";
import type { EmailType } from "@/types/day15";

interface ArcTimelineProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ArcTimeline({ activeIndex, onSelect }: ArcTimelineProps) {
  return (
    <div className="w-full overflow-x-auto py-4">
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-center justify-between relative px-4">
        {/* Connecting line */}
        <div
          className="absolute top-1/2 left-8 right-8 h-px -translate-y-1/2"
          style={{ background: "var(--border)" }}
        />

        {SEQUENCE_EMAIL_ORDER.map((type, i) => {
          const meta = EMAIL_TYPES[type];
          const isActive = i === activeIndex;
          return (
            <button
              key={type}
              onClick={() => onSelect(i)}
              className="relative z-10 flex flex-col items-center gap-1.5 transition-transform"
              style={{
                transform: isActive ? "scale(1.15)" : "scale(1)",
              }}
            >
              <div
                className="rounded-full transition-all"
                style={{
                  width: isActive ? 16 : 12,
                  height: isActive ? 16 : 12,
                  background: isActive
                    ? meta.colour
                    : "var(--surface-raised)",
                  border: isActive
                    ? "none"
                    : `2px solid ${meta.colour}`,
                }}
              />
              <span
                className="text-[10px] font-bold uppercase"
                style={{
                  color: isActive ? meta.colour : "var(--text-tertiary)",
                }}
              >
                Day {meta.sendDay}
              </span>
              <span
                className="text-[10px] whitespace-nowrap"
                style={{
                  color: isActive
                    ? "var(--foreground)"
                    : "var(--text-secondary)",
                }}
              >
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile: horizontal scrollable */}
      <div className="flex sm:hidden items-center gap-4 px-4 overflow-x-auto">
        {SEQUENCE_EMAIL_ORDER.map((type, i) => {
          const meta = EMAIL_TYPES[type];
          const isActive = i === activeIndex;
          return (
            <button
              key={type}
              onClick={() => onSelect(i)}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <div
                className="rounded-full"
                style={{
                  width: isActive ? 14 : 10,
                  height: isActive ? 14 : 10,
                  background: isActive
                    ? meta.colour
                    : "var(--surface-raised)",
                  border: isActive
                    ? "none"
                    : `2px solid ${meta.colour}`,
                }}
              />
              <span
                className="text-[9px] font-bold uppercase"
                style={{
                  color: isActive ? meta.colour : "var(--text-tertiary)",
                }}
              >
                Day {meta.sendDay}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

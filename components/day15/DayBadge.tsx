"use client";

export function DayBadge({
  day,
  colour,
}: {
  day: number;
  colour: string;
}) {
  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{
        background: `color-mix(in srgb, ${colour} 15%, transparent)`,
        color: colour,
      }}
    >
      Day {day}
    </span>
  );
}

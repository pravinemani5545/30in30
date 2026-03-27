"use client";

import type { TalkingPoint as TalkingPointType } from "@/types/day9";

export function TalkingPoint({
  point,
  index,
}: {
  point: TalkingPointType;
  index: number;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-sm font-medium text-[var(--foreground)]">
        <span className="text-[#E8A020] mr-1.5">{index + 1}.</span>
        <span className="font-semibold">{point.point}</span>
      </p>
      <p className="text-sm leading-[1.65] text-[var(--foreground)] mt-1 pl-5">
        {point.explanation}
      </p>
      {point.source && (
        <p className="text-[11px] text-[var(--text-tertiary)] mt-1 pl-5">
          {point.source}
        </p>
      )}
    </div>
  );
}

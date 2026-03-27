"use client";

import type { Objection } from "@/types/day9";

export function ObjectionCard({ objection }: { objection: Objection }) {
  return (
    <div className="mb-3 last:mb-0 rounded border border-[var(--border)] overflow-hidden">
      {/* Objection */}
      <div className="px-3 py-2.5 border-l-[3px] border-l-[#EF4444] bg-[#EF444408]">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#EF4444] mb-1">
          They might say
        </p>
        <p className="text-sm italic text-[var(--foreground)] leading-[1.65]">
          &ldquo;{objection.objection}&rdquo;
        </p>
      </div>
      {/* Response */}
      <div className="px-3 py-2.5 border-l-[3px] border-l-[#22C55E] bg-[#22C55E08]">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#22C55E] mb-1">
          You could respond
        </p>
        <p className="text-sm font-medium text-[var(--foreground)] leading-[1.65]">
          {objection.response}
        </p>
      </div>
    </div>
  );
}

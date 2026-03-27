"use client";

import type { Briefing } from "@/types/day9";
import { VerifyWarningBadge } from "./VerifyWarningBadge";
import { CacheStatusBadge } from "./CacheStatusBadge";

export function BriefingHeader({ briefing }: { briefing: Briefing }) {
  const date = new Date(briefing.created_at).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="briefing-header pb-4 mb-6 border-b border-[var(--border)]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-[28px] text-[var(--foreground)] leading-tight">
            {briefing.person_name}
          </h1>
          <p className="text-[16px] font-medium text-[var(--text-secondary)] mt-1">
            @ {briefing.company_name}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="text-[11px] font-mono text-[var(--text-tertiary)]">
            {date}
          </div>
          <CacheStatusBadge
            wasCached={briefing.was_cached}
            cacheHitAt={briefing.cache_hit_at}
          />
        </div>
      </div>

      {/* Meeting context */}
      <div className="mt-4 px-3 py-2 rounded border border-[#E8A02030] bg-[#E8A02010] text-[13px] text-[var(--foreground)]">
        <span className="text-[#E8A020] font-medium">Meeting context:</span>{" "}
        {briefing.meeting_context}
      </div>

      {/* Verify warning + data quality */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <VerifyWarningBadge />
        {briefing.data_quality === "limited" && briefing.data_quality_note && (
          <span className="text-[12px] text-[#EF4444]">
            Limited data — {briefing.data_quality_note}
          </span>
        )}
      </div>
    </div>
  );
}

"use client";

import type { ConfidenceLevel } from "@/types/day9";
import { ConfidenceDot } from "./ConfidenceDot";

interface BriefingSectionProps {
  title: string;
  accentColor: string;
  children: React.ReactNode;
  confidence?: ConfidenceLevel;
  notes?: string | null;
  className?: string;
}

export function BriefingSection({
  title,
  accentColor,
  children,
  confidence,
  notes,
  className = "",
}: BriefingSectionProps) {
  return (
    <div
      className={`briefing-section border-l-[3px] pl-4 py-3 ${className}`}
      style={{ borderColor: accentColor }}
    >
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
          {title}
        </h3>
        {confidence && <ConfidenceDot level={confidence} />}
      </div>
      <div className="text-sm leading-[1.65] text-[var(--foreground)]">
        {children}
      </div>
      {notes && (
        <div className="mt-3 px-3 py-2 rounded text-[13px] bg-[#E8A02010] border border-[#E8A02030] text-[#E8A020]">
          {notes}
        </div>
      )}
    </div>
  );
}

"use client";

import type { PainPointHierarchy as PainPointHierarchyType } from "@/types/day13";
import { ICPSection } from "./ICPSection";

interface Props {
  data: PainPointHierarchyType;
}

function PainLevel({
  level,
  label,
  text,
}: {
  level: number;
  label: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
        style={{
          backgroundColor: "rgb(239 68 68 / 0.12)",
          color: "var(--section-painpoints)",
        }}
      >
        {level}
      </div>
      <div>
        <span
          className="text-[11px] font-medium uppercase tracking-wide block"
          style={{ color: "var(--text-tertiary)" }}
        >
          {label}
        </span>
        <p
          className="text-sm mt-0.5"
          style={{ color: "var(--foreground)", lineHeight: "1.65" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export function PainPointHierarchy({ data }: Props) {
  return (
    <ICPSection title="Pain Point Hierarchy" borderColor="var(--section-painpoints)">
      <div className="space-y-4">
        <PainLevel level={1} label="Surface Pain" text={data.surfacePain} />
        <PainLevel level={2} label="Real Pain" text={data.realPain} />
        <PainLevel level={3} label="Urgent Pain" text={data.urgentPain} />
        <div
          className="pt-3 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="text-[11px] font-medium uppercase tracking-wide"
            style={{ color: "var(--text-tertiary)" }}
          >
            Trigger Event
          </span>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--foreground)", lineHeight: "1.65" }}
          >
            {data.triggerEvent}
          </p>
        </div>
      </div>
    </ICPSection>
  );
}

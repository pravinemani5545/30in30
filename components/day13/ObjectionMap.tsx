"use client";

import type { ObjectionEntry } from "@/types/day13";
import { ICPSection } from "./ICPSection";

interface Props {
  data: ObjectionEntry[];
}

export function ObjectionMap({ data }: Props) {
  return (
    <ICPSection title="Objection Map" borderColor="var(--section-objections)">
      <div className="space-y-4">
        {data.map((entry, i) => (
          <div
            key={i}
            className="space-y-2 pb-4 last:pb-0 border-b last:border-b-0"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <span
                className="text-[11px] font-medium uppercase tracking-wide"
                style={{ color: "var(--text-tertiary)" }}
              >
                Objection
              </span>
              <p
                className="text-sm"
                style={{ color: "var(--foreground)", lineHeight: "1.65" }}
              >
                &ldquo;{entry.statedObjection}&rdquo;
              </p>
            </div>
            <div>
              <span
                className="text-[11px] font-medium uppercase tracking-wide"
                style={{ color: "var(--text-tertiary)" }}
              >
                Underlying Fear
              </span>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)", lineHeight: "1.65" }}
              >
                {entry.underlyingFear}
              </p>
            </div>
            <div>
              <span
                className="text-[11px] font-medium uppercase tracking-wide"
                style={{ color: "var(--section-objections)" }}
              >
                Counter-Frame
              </span>
              <p
                className="text-sm"
                style={{ color: "var(--foreground)", lineHeight: "1.65" }}
              >
                {entry.counterFrame}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ICPSection>
  );
}

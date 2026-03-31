"use client";

import type { FirmographicProfile as FirmographicProfileType } from "@/types/day13";
import { ICPSection } from "./ICPSection";

interface Props {
  data: FirmographicProfileType;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="text-[11px] font-medium uppercase tracking-wide"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </span>
      <span
        className="text-sm"
        style={{
          color: "var(--foreground)",
          lineHeight: "1.65",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function FirmographicProfile({ data }: Props) {
  return (
    <ICPSection title="Firmographic Profile" borderColor="var(--section-firmographic)">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Company Size" value={data.companySizeRange} />
        <Field label="Industry / Vertical" value={data.industryVertical} />
        <Field label="Growth Stage" value={data.growthStage} />
        <Field label="Revenue Range" value={data.revenueRange} />
        <Field label="Geography" value={data.geography} />
        {data.techStackSignals.length > 0 && (
          <Field
            label="Tech Stack Signals"
            value={data.techStackSignals.join(", ")}
          />
        )}
      </div>
      {data.notes && (
        <p
          className="mt-3 text-xs italic"
          style={{ color: "var(--text-secondary)" }}
        >
          {data.notes}
        </p>
      )}
    </ICPSection>
  );
}

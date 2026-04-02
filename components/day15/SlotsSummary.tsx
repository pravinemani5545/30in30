"use client";

import { Tag } from "lucide-react";

const SLOT_DESCRIPTIONS: Record<string, string> = {
  first_name: "Prospect's first name",
  company_name: "Their company name",
  persona_role: "Their job function or title",
  value_prop_short: "One-line value proposition",
  social_proof_company: "Company in the proof point",
  social_proof_result: "Specific outcome from proof point",
  observation: "Company-specific observation",
  sender_name: "Your name",
  sender_company: "Your company name",
};

export function SlotsSummary({ slots }: { slots: string[] }) {
  if (slots.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p
        className="text-[10px] font-bold uppercase tracking-wider"
        style={{ color: "var(--text-tertiary)" }}
      >
        Personalization slots
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {slots.map((slot) => (
          <div
            key={slot}
            className="flex items-center gap-1.5 text-xs"
          >
            <Tag size={10} style={{ color: "var(--accent)" }} />
            <span style={{ color: "var(--accent)" }} className="font-bold">
              {`{{${slot}}}`}
            </span>
            <span style={{ color: "var(--text-secondary)" }}>
              {SLOT_DESCRIPTIONS[slot] ?? slot}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

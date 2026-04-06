"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { CompanyChange } from "@/types/day18";

interface OutreachPromptBoxProps {
  change: CompanyChange;
  onGenerate: (
    changeId: string,
  ) => Promise<{ outreachAngle?: string; error?: string }>;
}

export function OutreachPromptBox({ change, onGenerate }: OutreachPromptBoxProps) {
  const [outreach, setOutreach] = useState<string | null>(
    change.outreach_prompt,
  );
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const result = await onGenerate(change.id);
    if (result.outreachAngle) {
      setOutreach(result.outreachAngle);
    }
    setLoading(false);
  }

  if (outreach) {
    return (
      <div
        className="rounded-md p-3 border"
        style={{
          background: "var(--accent-subtle)",
          borderColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
        }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles size={12} style={{ color: "var(--accent)" }} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "var(--accent)" }}
          >
            Outreach opportunity
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
          {outreach}
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs transition-colors mt-1"
      style={{ color: "var(--accent)" }}
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Sparkles size={12} />
      )}
      {loading ? "Generating..." : "Generate outreach angle"}
    </button>
  );
}

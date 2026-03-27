"use client";

import { Search, Bot, CheckCircle2, Loader2, Circle } from "lucide-react";
import type { BriefingStatus } from "@/types/day9";

interface ResearchStatusProps {
  searchSteps: [boolean, boolean, boolean];
  synthesisComplete: boolean;
  status: BriefingStatus;
  personName: string;
  companyName: string;
  errorMessage: string | null;
}

interface StepConfig {
  label: string;
  done: boolean;
  active: boolean;
}

export function ResearchStatus({
  searchSteps,
  synthesisComplete,
  status,
  personName,
  companyName,
  errorMessage,
}: ResearchStatusProps) {
  const year = new Date().getFullYear();
  const isSearching = status === "searching" || status === "queued";
  const isSynthesising = status === "synthesising";

  const steps: StepConfig[] = [
    {
      label: `Searching "${personName} ${companyName}"...`,
      done: searchSteps[0],
      active: isSearching && !searchSteps[0],
    },
    {
      label: `Searching "${personName} LinkedIn"...`,
      done: searchSteps[1],
      active: isSearching && searchSteps[0] && !searchSteps[1],
    },
    {
      label: `Searching "${companyName} news ${year}"...`,
      done: searchSteps[2],
      active: isSearching && searchSteps[1] && !searchSteps[2],
    },
    {
      label: "Synthesising with Claude...",
      done: synthesisComplete,
      active: isSynthesising && !synthesisComplete,
    },
  ];

  if (status === "failed") {
    return (
      <div className="p-6 rounded border border-[#EF4444] bg-[#EF444410]">
        <p className="text-sm text-[#EF4444] font-medium">
          Briefing generation failed
        </p>
        {errorMessage && (
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 rounded border border-[var(--border)] bg-[var(--surface)]">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] mb-4">
        Generating Intelligence Brief
      </h3>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <StepIcon done={step.done} active={step.active} isSearch={i < 3} />
            <span
              className={`text-sm ${
                step.done
                  ? "text-[#22C55E]"
                  : step.active
                    ? "text-[var(--foreground)]"
                    : "text-[var(--text-tertiary)]"
              }`}
            >
              {step.done ? step.label.replace("...", "") : step.label}
              {step.done && " ✓"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepIcon({
  done,
  active,
  isSearch,
}: {
  done: boolean;
  active: boolean;
  isSearch: boolean;
}) {
  if (done) {
    return <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />;
  }
  if (active) {
    return (
      <Loader2 className="w-4 h-4 text-[#E8A020] animate-spin" />
    );
  }
  if (isSearch) {
    return <Search className="w-4 h-4 text-[var(--text-tertiary)]" />;
  }
  return <Bot className="w-4 h-4 text-[var(--text-tertiary)]" />;
}

// Simplified version for when no Realtime is available (polling fallback)
export function ResearchStatusSimple({
  status,
}: {
  status: BriefingStatus;
}) {
  if (status === "queued" || status === "searching") {
    return (
      <div className="flex items-center gap-3 p-4">
        <Loader2 className="w-5 h-5 text-[#E8A020] animate-spin" />
        <span className="text-sm text-[var(--text-secondary)]">
          {status === "queued"
            ? "Starting research..."
            : "Running web searches..."}
        </span>
      </div>
    );
  }
  if (status === "synthesising") {
    return (
      <div className="flex items-center gap-3 p-4">
        <Loader2 className="w-5 h-5 text-[#E8A020] animate-spin" />
        <span className="text-sm text-[var(--text-secondary)]">
          Synthesising briefing with Claude...
        </span>
      </div>
    );
  }
  return null;
}

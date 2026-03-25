"use client";

import { FileText, Scissors, Cpu, Check, X } from "lucide-react";
import type { DocumentStatus } from "@/types/day8";

interface ProcessingProgressProps {
  status: DocumentStatus;
}

const PHASES = [
  { key: "parsing", label: "Parsing PDF", icon: FileText, color: "#8B5CF6" },
  { key: "chunking", label: "Chunking text", icon: Scissors, color: "#06B6D4" },
  {
    key: "embedding",
    label: "Generating embeddings",
    icon: Cpu,
    color: "#E8A020",
  },
  { key: "ready", label: "Ready", icon: Check, color: "#22C55E" },
] as const;

const STATUS_ORDER: Record<string, number> = {
  uploading: -1,
  parsing: 0,
  chunking: 1,
  embedding: 2,
  ready: 3,
  failed: -2,
};

export function ProcessingProgress({ status }: ProcessingProgressProps) {
  if (status === "ready") return null;
  if (status === "failed") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-[#EF4444] text-xs">
        <X className="h-3.5 w-3.5" />
        <span>Processing failed</span>
      </div>
    );
  }

  const currentOrder = STATUS_ORDER[status] ?? -1;

  return (
    <div className="px-3 py-2 space-y-1.5">
      {PHASES.map((phase) => {
        const phaseOrder = STATUS_ORDER[phase.key];
        const isActive = phaseOrder === currentOrder;
        const isComplete = phaseOrder < currentOrder;
        const isPending = phaseOrder > currentOrder;

        const Icon = phase.icon;

        return (
          <div key={phase.key} className="flex items-center gap-2 text-xs">
            <Icon
              className="h-3.5 w-3.5 shrink-0"
              style={{
                color: isActive
                  ? phase.color
                  : isComplete
                    ? "#22C55E"
                    : "#555250",
              }}
            />
            <span
              className={
                isActive
                  ? "text-[#F5F0E8]"
                  : isComplete
                    ? "text-[#22C55E]"
                    : isPending
                      ? "text-[#555250]"
                      : "text-[#8A8580]"
              }
            >
              {phase.label}
            </span>
            {isActive && (
              <span className="ml-auto flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1 h-1 rounded-full bg-current animate-pulse"
                    style={{
                      color: phase.color,
                      animationDelay: `${i * 200}ms`,
                    }}
                  />
                ))}
              </span>
            )}
            {isComplete && (
              <Check className="h-3 w-3 ml-auto text-[#22C55E]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

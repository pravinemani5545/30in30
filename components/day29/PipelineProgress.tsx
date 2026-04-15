"use client";

import type { PipelineResult } from "@/types/day29";

interface PipelineProgressProps {
  result: PipelineResult | null;
  currentStage: "enrichment" | "outreach" | "sequence" | "campaign" | null;
  loading: boolean;
}

const STAGES = [
  { key: "enrichment" as const, label: "Company Enrichment", icon: "01" },
  { key: "outreach" as const, label: "Outreach Draft", icon: "02" },
  { key: "sequence" as const, label: "Email Sequence", icon: "03" },
  { key: "campaign" as const, label: "Campaign Preview", icon: "04" },
];

const STAGE_ORDER = ["enrichment", "outreach", "sequence", "campaign"] as const;

function getStageStatus(
  stageKey: (typeof STAGE_ORDER)[number],
  result: PipelineResult | null,
  currentStage: string | null,
  loading: boolean,
): "pending" | "running" | "complete" | "error" {
  if (result) {
    return result[stageKey].status;
  }
  if (!loading) return "pending";
  if (currentStage === stageKey) return "running";
  const currentIdx = STAGE_ORDER.indexOf(currentStage as (typeof STAGE_ORDER)[number]);
  const stageIdx = STAGE_ORDER.indexOf(stageKey);
  if (stageIdx < currentIdx) return "complete";
  return "pending";
}

function getDuration(
  stageKey: (typeof STAGE_ORDER)[number],
  result: PipelineResult | null,
): number {
  if (!result) return 0;
  return result[stageKey].durationMs;
}

function formatDuration(ms: number): string {
  if (ms === 0) return "";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function PipelineProgress({
  result,
  currentStage,
  loading,
}: PipelineProgressProps) {
  return (
    <div
      className="relative pl-8"
      style={{
        fontFamily: "var(--font-day29-mono)",
      }}
    >
      {/* Vertical connecting line */}
      <div
        className="absolute left-[15px] top-[20px]"
        style={{
          width: "2px",
          height: "calc(100% - 40px)",
          background: "#2a2a2a",
        }}
      />

      {STAGES.map((stage, i) => {
        const status = getStageStatus(stage.key, result, currentStage, loading);
        const duration = getDuration(stage.key, result);

        return (
          <div key={stage.key} className="relative flex items-start gap-4" style={{ marginBottom: i < STAGES.length - 1 ? "28px" : 0 }}>
            {/* Status dot */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: "-24px",
                top: "2px",
                width: "20px",
                height: "20px",
              }}
            >
              {status === "pending" && (
                <span
                  className="inline-block"
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "#333",
                    borderRadius: "50%",
                  }}
                />
              )}
              {status === "running" && (
                <span
                  className="inline-block"
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "#00FF41",
                    borderRadius: "50%",
                    animation: "pulse-dot 1.5s ease-in-out infinite",
                    boxShadow: "0 0 8px rgba(0,255,65,0.5)",
                  }}
                />
              )}
              {status === "complete" && (
                <span
                  style={{
                    fontSize: "14px",
                    color: "#00FF41",
                    lineHeight: 1,
                  }}
                >
                  &#10003;
                </span>
              )}
              {status === "error" && (
                <span
                  style={{
                    fontSize: "14px",
                    color: "#ff4444",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  &#10005;
                </span>
              )}
            </div>

            {/* Stage content */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontSize: "10px",
                    color: status === "complete" ? "#00FF41" : status === "running" ? "#00FF41" : status === "error" ? "#ff4444" : "#555",
                    opacity: status === "running" ? 1 : 0.8,
                  }}
                >
                  [{stage.icon}]
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: status === "complete" ? "#eeeeee" : status === "running" ? "#00FF41" : status === "error" ? "#ff4444" : "#555",
                    fontWeight: status === "running" ? 700 : 400,
                  }}
                >
                  {stage.label}
                </span>
                {duration > 0 && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#555",
                    }}
                  >
                    {formatDuration(duration)}
                  </span>
                )}
              </div>
              {status === "running" && (
                <div
                  className="mt-1"
                  style={{
                    fontSize: "11px",
                    color: "#00FF41",
                    opacity: 0.6,
                  }}
                >
                  processing...
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

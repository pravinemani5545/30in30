"use client";

import { ICP_QUESTIONS } from "@/lib/day13/icp/questions";

interface ProgressTrackerProps {
  currentIndex: number;
  answeredCount: number;
  onNodeClick: (index: number) => void;
}

export function ProgressTracker({
  currentIndex,
  answeredCount,
  onNodeClick,
}: ProgressTrackerProps) {
  return (
    <div className="flex flex-col items-center gap-0">
      {ICP_QUESTIONS.map((q, i) => {
        const isCompleted = i < answeredCount;
        const isActive = i === currentIndex && i < ICP_QUESTIONS.length;
        const isPending = !isCompleted && !isActive;

        return (
          <div key={q.key} className="flex flex-col items-center">
            {/* Connector line above (skip first) */}
            {i > 0 && (
              <div
                className="w-px h-4"
                style={{
                  backgroundColor: i <= answeredCount
                    ? "var(--q-completed)"
                    : "var(--q-pending)",
                }}
              />
            )}

            {/* Node */}
            <button
              type="button"
              disabled={isPending}
              onClick={() => isCompleted && onNodeClick(i)}
              className="relative flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold transition-all"
              style={{
                backgroundColor: isCompleted
                  ? "var(--q-completed)"
                  : isActive
                    ? "var(--q-active)"
                    : "transparent",
                border: isPending
                  ? "1.5px solid var(--q-pending)"
                  : "none",
                color: isCompleted || isActive
                  ? "var(--background)"
                  : "var(--text-tertiary)",
                cursor: isCompleted ? "pointer" : "default",
              }}
            >
              {i + 1}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: "var(--q-active)",
                    opacity: 0.25,
                  }}
                />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

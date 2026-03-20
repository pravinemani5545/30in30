"use client";

import type { GenerationStep } from "@/hooks/useGenerate";

const STEPS: { key: GenerationStep; label: string }[] = [
  { key: "fetching", label: "Fetching article..." },
  { key: "reading",  label: "Reading content..." },
  { key: "crafting", label: "Crafting 5 tweet variations..." },
];

export function GenerationStatus({ step, articleTitle }: { step: GenerationStep; articleTitle?: string }) {
  const currentIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      {/* Thinking animation */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              background: "var(--accent)",
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>

      {/* Current step label */}
      <div className="text-center space-y-1">
        <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
          {step === "crafting" && articleTitle
            ? `Crafting tweets for "${articleTitle}"...`
            : STEPS.find((s) => s.key === step)?.label ?? "Working..."}
        </p>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          This usually takes 10–20 seconds
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-3">
        {STEPS.map((s, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full transition-all duration-500"
                style={{
                  background: isDone || isCurrent ? "var(--accent)" : "var(--border)",
                  opacity: isCurrent ? 1 : isDone ? 0.5 : 0.3,
                }}
              />
              {i < STEPS.length - 1 && (
                <div
                  className="w-8 h-px transition-all duration-500"
                  style={{ background: isDone ? "var(--accent)" : "var(--border)" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

interface SynthesisLoadingStateProps {
  step: "synthesis" | "reality-check" | null;
}

export function SynthesisLoadingState({ step }: SynthesisLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6">
      {/* Pulsing dot */}
      <div
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: "var(--accent)" }}
      />

      <div className="text-center space-y-2">
        <p
          className="text-sm font-medium"
          style={{
            color:
              step === "synthesis"
                ? "var(--foreground)"
                : "var(--text-tertiary)",
          }}
        >
          {step === "synthesis" ? "Building profile..." : "✓ Profile built"}
        </p>
        <p
          className="text-sm font-medium"
          style={{
            color:
              step === "reality-check"
                ? "var(--foreground)"
                : "var(--text-tertiary)",
          }}
        >
          {step === "reality-check"
            ? "Running reality check..."
            : "Waiting..."}
        </p>
      </div>

      <p
        className="text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        Analysing your 10 answers...
      </p>
    </div>
  );
}

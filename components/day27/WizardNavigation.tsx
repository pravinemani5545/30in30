"use client";

interface WizardNavigationProps {
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  saving: boolean;
}

export function WizardNavigation({
  currentStep,
  onBack,
  onNext,
  saving,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  // Step 4 (Review) has its own submit button, so hide Next there
  const isLastStep = currentStep === 4;

  return (
    <div className="flex items-center justify-between pt-6">
      {/* Back button */}
      {!isFirstStep ? (
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 transition-all"
          style={{
            fontFamily: "var(--font-day27-mono)",
            fontSize: "12px",
            letterSpacing: "1px",
            color: "#999",
            background: "transparent",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
            cursor: "pointer",
          }}
        >
          &larr; BACK
        </button>
      ) : (
        <div />
      )}

      {/* Next button (hidden on review step) */}
      {!isLastStep && (
        <button
          type="button"
          onClick={onNext}
          disabled={saving}
          className="px-5 py-2.5 transition-all"
          style={{
            fontFamily: "var(--font-day27-mono)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1px",
            color: saving ? "#555" : "#0a0a0a",
            background: saving ? "#2a2a2a" : "#00FF41",
            border: "none",
            borderRadius: 0,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "SAVING..." : "NEXT \u2192"}
        </button>
      )}
    </div>
  );
}

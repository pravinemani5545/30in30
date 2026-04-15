"use client";

const STEP_LABELS = ["Profile", "Preferences", "Goals", "Review"];

interface ProgressBarProps {
  currentStep: number;
  completedSteps: number[];
}

export function ProgressBar({ currentStep, completedSteps }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const isCompleted = completedSteps.includes(step);
          const isCurrent = currentStep === step;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <div key={step} className="flex flex-col items-center flex-1">
              {/* Connector + Circle row */}
              <div className="flex items-center w-full">
                {/* Left connector */}
                {i > 0 && (
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: isCompleted || isCurrent ? "#00FF41" : "#2a2a2a",
                    }}
                  />
                )}
                {i === 0 && <div className="flex-1" />}

                {/* Circle */}
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    background: isCompleted ? "#00FF41" : "transparent",
                    border: isCurrent
                      ? "2px solid #00FF41"
                      : isCompleted
                        ? "2px solid #00FF41"
                        : "2px solid #2a2a2a",
                    borderRadius: 0,
                  }}
                >
                  {isCompleted ? (
                    <span
                      style={{
                        fontFamily: "var(--font-day27-mono)",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#0a0a0a",
                      }}
                    >
                      &#x2713;
                    </span>
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-day27-mono)",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: isCurrent ? "#00FF41" : "#555",
                      }}
                    >
                      {step}
                    </span>
                  )}
                  {/* Pulse animation for current step */}
                  {isCurrent && (
                    <div
                      className="absolute inset-0"
                      style={{
                        border: "2px solid #00FF41",
                        opacity: 0.4,
                        animation: "wizard-pulse 2s ease-in-out infinite",
                        borderRadius: 0,
                      }}
                    />
                  )}
                </div>

                {/* Right connector */}
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: isCompleted ? "#00FF41" : "#2a2a2a",
                    }}
                  />
                )}
                {i === STEP_LABELS.length - 1 && <div className="flex-1" />}
              </div>

              {/* Label */}
              <span
                className="mt-2"
                style={{
                  fontFamily: "var(--font-day27-mono)",
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: isCurrent
                    ? "#00FF41"
                    : isCompleted
                      ? "#00FF41"
                      : isFuture
                        ? "#555"
                        : "#999",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}

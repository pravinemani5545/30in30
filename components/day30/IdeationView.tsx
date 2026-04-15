"use client";

import type { Ideation } from "@/types/day30";

interface IdeationViewProps {
  ideation: Ideation;
}

export function IdeationView({ ideation }: IdeationViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: "var(--font-day30-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          IDEATION — {ideation.variations.length} VARIATIONS
        </span>
        <span
          style={{
            fontFamily: "var(--font-day30-mono)",
            fontSize: "11px",
            color: "#555",
          }}
        >
          topic: {ideation.topic}
        </span>
      </div>

      <div className="space-y-3">
        {ideation.variations.map((variation, i) => {
          const isSelected = i === ideation.selectedIndex;
          return (
            <div
              key={i}
              className="p-4"
              style={{
                background: isSelected ? "#161616" : "#111111",
                border: isSelected
                  ? "1px solid #00FF41"
                  : "1px solid #2a2a2a",
                borderRadius: 0,
              }}
            >
              {/* Header row */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="inline-flex items-center px-2 py-0.5"
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    color: isSelected ? "#000" : "#00FF41",
                    background: isSelected
                      ? "#00FF41"
                      : "rgba(0,255,65,0.08)",
                    border: isSelected
                      ? "none"
                      : "1px solid rgba(0,255,65,0.2)",
                    borderRadius: 0,
                  }}
                >
                  {isSelected ? "SELECTED" : `VAR ${i + 1}`}
                </span>
                <span
                  className="inline-flex items-center px-2 py-0.5"
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "10px",
                    color: "#999",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid #2a2a2a",
                    borderRadius: 0,
                  }}
                >
                  {variation.targetEmotion}
                </span>
              </div>

              {/* Title */}
              <h4
                className="mb-2"
                style={{
                  fontFamily: "var(--font-day30-heading)",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#eeeeee",
                  lineHeight: 1.3,
                }}
              >
                {variation.title}
              </h4>

              {/* Hook */}
              <p
                className="mb-3"
                style={{
                  fontFamily: "var(--font-day30-body)",
                  fontSize: "14px",
                  color: "#999",
                  lineHeight: 1.5,
                }}
              >
                &ldquo;{variation.hook}&rdquo;
              </p>

              {/* Angle */}
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "10px",
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  ANGLE:
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-day30-body)",
                    fontSize: "13px",
                    color: "#999",
                  }}
                >
                  {variation.angle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

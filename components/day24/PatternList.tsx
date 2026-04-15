"use client";

import type { Pattern } from "@/types/day24";

interface PatternListProps {
  patterns: Pattern[];
}

export function PatternList({ patterns }: PatternListProps) {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #2a2a2a",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: "#161616",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-day24-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          CONTENT PATTERNS ({patterns.length})
        </span>
      </div>

      {/* Pattern items */}
      <div>
        {patterns.map((pattern, i) => (
          <div
            key={`${pattern.name}-${i}`}
            className="px-4 py-4"
            style={{
              borderBottom:
                i < patterns.length - 1 ? "1px solid #1a1a1a" : "none",
            }}
          >
            {/* Pattern name + frequency */}
            <div className="flex items-center justify-between mb-2">
              <span
                style={{
                  fontFamily: "var(--font-day24-heading)",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#00FF41",
                }}
              >
                {pattern.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-day24-mono)",
                  fontSize: "11px",
                  color: "#555",
                }}
              >
                {pattern.frequency}/10
              </span>
            </div>

            {/* Frequency bar */}
            <div
              className="mb-3"
              style={{
                height: "4px",
                background: "#1a1a1a",
                borderRadius: 0,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(pattern.frequency / 10) * 100}%`,
                  background: "#00FF41",
                  borderRadius: 0,
                  transition: "width 0.5s ease",
                }}
              />
            </div>

            {/* Description */}
            <p
              className="mb-3"
              style={{
                fontFamily: "var(--font-day24-body)",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#999",
              }}
            >
              {pattern.description}
            </p>

            {/* Examples */}
            <div className="flex flex-wrap gap-2">
              {pattern.examples.map((example, j) => (
                <span
                  key={`${example}-${j}`}
                  className="px-2 py-1"
                  style={{
                    fontFamily: "var(--font-day24-mono)",
                    fontSize: "11px",
                    color: "#eeeeee",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 0,
                    maxWidth: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

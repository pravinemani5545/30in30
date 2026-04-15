"use client";

import type { Script } from "@/types/day30";

interface ScriptViewProps {
  script: Script;
}

export function ScriptView({ script }: ScriptViewProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
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
          SCRIPT
        </span>
        <div className="flex items-center gap-4">
          <span
            style={{
              fontFamily: "var(--font-day30-mono)",
              fontSize: "11px",
              color: "#555",
            }}
          >
            {script.wordCount.toLocaleString()} words
          </span>
          <span
            style={{
              fontFamily: "var(--font-day30-mono)",
              fontSize: "11px",
              color: "#555",
            }}
          >
            ~{script.totalDuration}
          </span>
        </div>
      </div>

      {/* Title */}
      <div
        className="p-3"
        style={{
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-day30-mono)",
            fontSize: "10px",
            color: "#555",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          TITLE
        </span>
        <p
          className="mt-1"
          style={{
            fontFamily: "var(--font-day30-heading)",
            fontSize: "16px",
            fontWeight: 600,
            color: "#eeeeee",
          }}
        >
          {script.title}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {script.sections.map((section, i) => (
          <div
            key={i}
            className="p-4"
            style={{
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
            }}
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center px-2 py-0.5"
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    color: "#00FF41",
                    background: "rgba(0,255,65,0.08)",
                    border: "1px solid rgba(0,255,65,0.2)",
                    borderRadius: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-day30-heading)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#eeeeee",
                  }}
                >
                  {section.name}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-day30-mono)",
                  fontSize: "11px",
                  color: "#555",
                }}
              >
                {section.duration}
              </span>
            </div>

            {/* Content — terminal code block look */}
            <div
              className="p-3 mb-3"
              style={{
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                borderRadius: 0,
              }}
            >
              <pre
                className="whitespace-pre-wrap"
                style={{
                  fontFamily: "var(--font-day30-mono)",
                  fontSize: "13px",
                  color: "#ccc",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {section.content}
              </pre>
            </div>

            {/* Notes */}
            {section.notes && (
              <div className="flex items-start gap-2">
                <span
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "10px",
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  NOTES:
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-day30-body)",
                    fontSize: "12px",
                    color: "#777",
                    lineHeight: 1.5,
                  }}
                >
                  {section.notes}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

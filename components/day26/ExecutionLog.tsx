"use client";

import { useState } from "react";
import type { WorkflowExecution } from "@/types/day26";

interface ExecutionLogProps {
  execution: WorkflowExecution;
}

function CollapsibleText({
  label,
  text,
  defaultOpen,
}: {
  label: string;
  text: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left transition-all"
        style={{
          fontFamily: "var(--font-day26-mono)",
          fontSize: "10px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#555",
          background: "transparent",
          border: "none",
          padding: "4px 0",
          cursor: "pointer",
        }}
      >
        <span style={{ color: "#00FF41" }}>{open ? "▼" : "▶"}</span>
        {label}
      </button>
      {open && (
        <div
          className="mt-2 p-3"
          style={{
            background: "#0a0a0a",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
            fontFamily: "var(--font-day26-body)",
            fontSize: "13px",
            lineHeight: 1.7,
            color: "#cccccc",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

export function ExecutionLog({ execution }: ExecutionLogProps) {
  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span
          style={{
            fontFamily: "var(--font-day26-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          EXECUTION LOG
        </span>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 px-2 py-1"
            style={{
              fontFamily: "var(--font-day26-mono)",
              fontSize: "11px",
              color:
                execution.status === "success"
                  ? "#00FF41"
                  : execution.status === "partial"
                    ? "#FFB800"
                    : "#ff4444",
              background:
                execution.status === "success"
                  ? "rgba(0,255,65,0.08)"
                  : execution.status === "partial"
                    ? "rgba(255,184,0,0.08)"
                    : "rgba(255,68,68,0.08)",
              border: `1px solid ${
                execution.status === "success"
                  ? "rgba(0,255,65,0.2)"
                  : execution.status === "partial"
                    ? "rgba(255,184,0,0.2)"
                    : "rgba(255,68,68,0.2)"
              }`,
              borderRadius: 0,
            }}
          >
            {execution.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Steps with connecting line */}
      <div className="relative">
        {/* Vertical connecting line */}
        {execution.steps.length > 1 && (
          <div
            className="absolute left-[11px] top-[24px]"
            style={{
              width: "2px",
              height: `calc(100% - 48px)`,
              background:
                "linear-gradient(to bottom, #00FF41, rgba(0,255,65,0.2))",
            }}
          />
        )}

        <div className="space-y-4">
          {execution.steps.map((step, index) => (
            <div key={index} className="relative flex gap-4">
              {/* Step dot */}
              <div className="flex-shrink-0 pt-1">
                <div
                  className="w-6 h-6 flex items-center justify-center relative z-10"
                  style={{
                    background:
                      step.status === "success" ? "#00FF41" : "#ff4444",
                    borderRadius: "50%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-day26-mono)",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#0a0a0a",
                    }}
                  >
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Step content */}
              <div
                className="flex-1 min-w-0"
                style={{
                  background: "#111111",
                  border: "1px solid #2a2a2a",
                  borderRadius: 0,
                }}
              >
                {/* Step header */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    borderBottom: "1px solid #2a2a2a",
                    background: "#161616",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-day26-mono)",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#eeeeee",
                    }}
                  >
                    {step.agentName}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-day26-mono)",
                      fontSize: "11px",
                      color:
                        step.status === "success" ? "#00FF41" : "#ff4444",
                    }}
                  >
                    {step.durationMs.toLocaleString()}ms
                  </span>
                </div>

                {/* Step body */}
                <div className="p-4 space-y-3">
                  {/* Input (collapsible) */}
                  <CollapsibleText
                    label={`INPUT (${step.input.length} chars)`}
                    text={step.input}
                    defaultOpen={false}
                  />

                  {/* Output */}
                  <CollapsibleText
                    label={`OUTPUT (${step.output.length} chars)`}
                    text={step.output}
                    defaultOpen={true}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total duration */}
      <div
        className="mt-4 pt-4 flex items-center justify-between"
        style={{
          borderTop: "1px solid #2a2a2a",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-day26-mono)",
            fontSize: "11px",
            color: "#555",
          }}
        >
          {execution.steps.length} agent{execution.steps.length !== 1 ? "s" : ""} executed
        </span>
        <span
          style={{
            fontFamily: "var(--font-day26-mono)",
            fontSize: "12px",
            fontWeight: 700,
            color: "#00FF41",
          }}
        >
          TOTAL: {(execution.totalDurationMs / 1000).toFixed(1)}s
        </span>
      </div>
    </div>
  );
}

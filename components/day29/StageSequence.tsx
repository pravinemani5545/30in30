"use client";

import { useState } from "react";
import type { EmailSequence } from "@/types/day29";

interface StageSequenceProps {
  data: EmailSequence;
}

export function StageSequence({ data }: StageSequenceProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      {/* Strategy */}
      <div>
        <label
          className="block mb-2"
          style={{
            fontFamily: "var(--font-day29-mono)",
            fontSize: "10px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#555",
          }}
        >
          SEQUENCE STRATEGY
        </label>
        <p
          style={{
            fontFamily: "var(--font-day29-body)",
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#999",
          }}
        >
          {data.strategy}
        </p>
      </div>

      {/* Email timeline */}
      <div>
        <label
          className="block mb-3"
          style={{
            fontFamily: "var(--font-day29-mono)",
            fontSize: "10px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#555",
          }}
        >
          EMAIL TIMELINE
        </label>
        <div className="space-y-0">
          {data.emails.map((email, i) => {
            const isExpanded = expandedDay === email.day;
            return (
              <div
                key={i}
                style={{
                  border: "1px solid #2a2a2a",
                  borderBottom: i < data.emails.length - 1 && !isExpanded ? "none" : "1px solid #2a2a2a",
                  borderRadius: 0,
                  background: isExpanded ? "#111111" : "#0a0a0a",
                }}
              >
                {/* Email header — clickable */}
                <button
                  type="button"
                  onClick={() => setExpandedDay(isExpanded ? null : email.day)}
                  className="w-full flex items-center gap-4 px-4 py-3 text-left"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: 0,
                  }}
                >
                  {/* Day badge */}
                  <span
                    className="flex-shrink-0 px-2 py-1"
                    style={{
                      fontFamily: "var(--font-day29-mono)",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#00FF41",
                      background: "rgba(0,255,65,0.08)",
                      border: "1px solid rgba(0,255,65,0.2)",
                      borderRadius: 0,
                      minWidth: "52px",
                      textAlign: "center",
                    }}
                  >
                    DAY {email.day}
                  </span>

                  {/* Subject */}
                  <span
                    className="flex-1 truncate"
                    style={{
                      fontFamily: "var(--font-day29-body)",
                      fontSize: "13px",
                      color: "#eeeeee",
                    }}
                  >
                    {email.subject}
                  </span>

                  {/* Intent badge */}
                  <span
                    className="flex-shrink-0 text-xs px-2 py-0.5"
                    style={{
                      fontFamily: "var(--font-day29-mono)",
                      fontSize: "10px",
                      color: "#555",
                      background: "#161616",
                      border: "1px solid #2a2a2a",
                      borderRadius: 0,
                    }}
                  >
                    {email.intent}
                  </span>

                  {/* Expand indicator */}
                  <span
                    style={{
                      fontFamily: "var(--font-day29-mono)",
                      fontSize: "12px",
                      color: "#555",
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.15s",
                      display: "inline-block",
                    }}
                  >
                    &#8250;
                  </span>
                </button>

                {/* Expanded email body */}
                {isExpanded && (
                  <div
                    className="px-4 pb-4"
                    style={{
                      borderTop: "1px solid #2a2a2a",
                    }}
                  >
                    <div
                      className="pt-4"
                      style={{
                        fontFamily: "var(--font-day29-body)",
                        fontSize: "13px",
                        lineHeight: 1.8,
                        color: "#999",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {email.body}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

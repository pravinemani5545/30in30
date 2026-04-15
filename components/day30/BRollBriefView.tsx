"use client";

import type { BRollBrief } from "@/types/day30";

interface BRollBriefViewProps {
  brief: BRollBrief;
}

export function BRollBriefView({ brief }: BRollBriefViewProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
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
          B-ROLL BRIEF
        </span>
        <span
          style={{
            fontFamily: "var(--font-day30-mono)",
            fontSize: "11px",
            color: "#555",
          }}
        >
          {brief.totalClips} clips
        </span>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {brief.items.map((item, i) => (
          <div
            key={i}
            className="p-4"
            style={{
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
            }}
          >
            {/* Timestamp + mood row */}
            <div className="flex items-center gap-3 mb-2">
              <span
                className="inline-flex items-center px-2 py-0.5"
                style={{
                  fontFamily: "var(--font-day30-mono)",
                  fontSize: "11px",
                  color: "#00FF41",
                  background: "rgba(0,255,65,0.08)",
                  border: "1px solid rgba(0,255,65,0.2)",
                  borderRadius: 0,
                }}
              >
                {item.timestamp}
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
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {item.mood}
              </span>
            </div>

            {/* Description */}
            <p
              className="mb-3"
              style={{
                fontFamily: "var(--font-day30-body)",
                fontSize: "14px",
                color: "#ccc",
                lineHeight: 1.5,
              }}
            >
              {item.description}
            </p>

            {/* Search terms as tags */}
            <div className="flex flex-wrap gap-2">
              {item.searchTerms.map((term, j) => (
                <span
                  key={j}
                  className="inline-flex items-center px-2 py-0.5"
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "11px",
                    color: "#777",
                    background: "#0a0a0a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 0,
                  }}
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import type { SummaryCard } from "@/types/day20";

interface SummaryCardOutputProps {
  data: SummaryCard;
}

export function SummaryCardOutput({ data }: SummaryCardOutputProps) {
  return (
    <div className="space-y-4">
      <h3
        style={{
          fontFamily: "var(--font-day20-heading)",
          fontSize: "18px",
          fontWeight: 600,
          color: "#eeeeee",
        }}
      >
        {data.title}
      </h3>

      <div>
        <span
          className="block mb-2"
          style={{
            fontFamily: "var(--font-day20-mono)",
            fontSize: "10px",
            color: "#555",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          KEY POINTS
        </span>
        <ul className="space-y-2">
          {data.keyPoints.map((point, i) => (
            <li key={i} className="flex gap-2">
              <span
                style={{
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "12px",
                  color: "#00FF41",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {">"}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-day20-body)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "#999",
                }}
              >
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="p-3"
        style={{
          background: "rgba(0,255,65,0.03)",
          borderLeft: "2px solid rgba(0,255,65,0.2)",
        }}
      >
        <span
          className="block mb-1"
          style={{
            fontFamily: "var(--font-day20-mono)",
            fontSize: "10px",
            color: "#555",
            letterSpacing: "1px",
          }}
        >
          QUOTE
        </span>
        <p
          style={{
            fontFamily: "var(--font-day20-body)",
            fontSize: "14px",
            fontStyle: "italic",
            lineHeight: 1.7,
            color: "#eeeeee",
          }}
        >
          &ldquo;{data.quote}&rdquo;
        </p>
      </div>

      {data.platforms.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.platforms.map((p, i) => (
            <span
              key={i}
              className="px-2 py-1"
              style={{
                fontFamily: "var(--font-day20-mono)",
                fontSize: "11px",
                color: "#00FF41",
                background: "rgba(0,255,65,0.08)",
                border: "1px solid rgba(0,255,65,0.2)",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

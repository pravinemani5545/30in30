"use client";

import type { VideoIdea } from "@/types/day24";

interface IdeaCardProps {
  idea: VideoIdea;
  index: number;
}

const PERFORMANCE_COLORS: Record<
  VideoIdea["estimatedPerformance"],
  string
> = {
  high: "#00FF41",
  medium: "#E8A020",
  moderate: "#999999",
};

export function IdeaCard({ idea, index }: IdeaCardProps) {
  const perfColor = PERFORMANCE_COLORS[idea.estimatedPerformance];

  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #2a2a2a",
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: "1px solid #2a2a2a",
          background: "#161616",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Index */}
          <span
            style={{
              fontFamily: "var(--font-day24-mono)",
              fontSize: "11px",
              color: "#555",
            }}
          >
            #{String(index + 1).padStart(2, "0")}
          </span>

          {/* Format badge */}
          <span
            className="px-2 py-1"
            style={{
              fontFamily: "var(--font-day24-mono)",
              fontSize: "11px",
              color: "#999",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {idea.format}
          </span>
        </div>

        {/* Performance badge */}
        <span
          className="px-2 py-1"
          style={{
            fontFamily: "var(--font-day24-mono)",
            fontSize: "11px",
            fontWeight: 700,
            color: perfColor,
            background: `${perfColor}14`,
            border: `1px solid ${perfColor}33`,
            borderRadius: 0,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {idea.estimatedPerformance}
        </span>
      </div>

      {/* Card body */}
      <div className="px-4 py-4 space-y-4">
        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-day24-heading)",
            fontSize: "17px",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#eeeeee",
          }}
        >
          {idea.title}
        </h3>

        {/* Hook */}
        <div>
          <span
            className="block mb-1"
            style={{
              fontFamily: "var(--font-day24-mono)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#555",
            }}
          >
            HOOK (FIRST 10s)
          </span>
          <p
            className="px-3 py-2"
            style={{
              fontFamily: "var(--font-day24-body)",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#eeeeee",
              background: "#060606",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
              fontStyle: "italic",
            }}
          >
            &ldquo;{idea.hook}&rdquo;
          </p>
        </div>

        {/* Angle */}
        <div>
          <span
            className="block mb-1"
            style={{
              fontFamily: "var(--font-day24-mono)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#555",
            }}
          >
            ANGLE
          </span>
          <p
            style={{
              fontFamily: "var(--font-day24-body)",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#999",
            }}
          >
            {idea.angle}
          </p>
        </div>

        {/* Reasoning */}
        <div>
          <span
            className="block mb-1"
            style={{
              fontFamily: "var(--font-day24-mono)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#555",
            }}
          >
            WHY THIS WORKS
          </span>
          <p
            style={{
              fontFamily: "var(--font-day24-body)",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#999",
            }}
          >
            {idea.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}

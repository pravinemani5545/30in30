"use client";

import type { ClassifiedReply } from "@/types/day21";
import { CategoryBadge } from "./CategoryBadge";

export function ClassifyResultCard({ item }: { item: ClassifiedReply }) {
  const confidencePct = Math.round(item.confidence * 100);

  return (
    <div
      className="p-5 space-y-4"
      style={{
        background: "#111111",
        border: "1px solid #2a2a2a",
        borderRadius: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: "var(--font-day21-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          CLASSIFICATION RESULT
        </span>
        <CategoryBadge category={item.category} />
      </div>

      {/* Confidence bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: "var(--font-day21-mono)",
              fontSize: "12px",
              color: "#999999",
            }}
          >
            confidence
          </span>
          <span
            style={{
              fontFamily: "var(--font-day21-mono)",
              fontSize: "12px",
              color: "#eeeeee",
              fontWeight: 700,
            }}
          >
            {confidencePct}%
          </span>
        </div>
        <div
          className="w-full h-2"
          style={{ background: "#1a1a1a", borderRadius: 0 }}
        >
          <div
            className="h-full"
            style={{
              width: `${confidencePct}%`,
              background: "#00FF41",
              borderRadius: 0,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Reasoning */}
      <div className="space-y-1">
        <span
          style={{
            fontFamily: "var(--font-day21-mono)",
            fontSize: "12px",
            color: "#999999",
          }}
        >
          reasoning
        </span>
        <p
          style={{
            fontFamily: "var(--font-day21-body)",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#eeeeee",
          }}
        >
          {item.reasoning}
        </p>
      </div>

      {/* Sender if present */}
      {item.sender && (
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "var(--font-day21-mono)",
              fontSize: "12px",
              color: "#999999",
            }}
          >
            sender:
          </span>
          <span
            style={{
              fontFamily: "var(--font-day21-mono)",
              fontSize: "12px",
              color: "#eeeeee",
            }}
          >
            {item.sender}
          </span>
        </div>
      )}
    </div>
  );
}

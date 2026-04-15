"use client";

import type { BRollConcept } from "@/types/day22";

interface ConceptCardProps {
  concept: BRollConcept;
  index: number;
}

export function ConceptCard({ concept, index }: ConceptCardProps) {
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
              fontFamily: "var(--font-day22-mono)",
              fontSize: "11px",
              color: "#555",
            }}
          >
            #{String(index + 1).padStart(2, "0")}
          </span>

          {/* Timestamp badge */}
          <span
            className="px-2 py-1"
            style={{
              fontFamily: "var(--font-day22-mono)",
              fontSize: "12px",
              fontWeight: 700,
              color: "#00FF41",
              background: "rgba(0,255,65,0.08)",
              border: "1px solid rgba(0,255,65,0.2)",
              borderRadius: 0,
            }}
          >
            {concept.timestamp}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mood */}
          <span
            className="px-2 py-1"
            style={{
              fontFamily: "var(--font-day22-mono)",
              fontSize: "11px",
              color: "#999",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {concept.mood}
          </span>

          {/* Duration */}
          <span
            style={{
              fontFamily: "var(--font-day22-mono)",
              fontSize: "11px",
              color: "#555",
            }}
          >
            {concept.duration}s
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-4 space-y-4">
        {/* Script excerpt */}
        <div>
          <span
            className="block mb-1"
            style={{
              fontFamily: "var(--font-day22-mono)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#555",
            }}
          >
            SCRIPT
          </span>
          <p
            style={{
              fontFamily: "var(--font-day22-body)",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#999",
            }}
          >
            &quot;{concept.scriptExcerpt.length > 200
              ? concept.scriptExcerpt.slice(0, 200) + "..."
              : concept.scriptExcerpt}&quot;
          </p>
        </div>

        {/* Visual concept */}
        <div>
          <span
            className="block mb-1"
            style={{
              fontFamily: "var(--font-day22-mono)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#555",
            }}
          >
            VISUAL
          </span>
          <p
            style={{
              fontFamily: "var(--font-day22-body)",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#eeeeee",
            }}
          >
            {concept.visualConcept}
          </p>
        </div>

        {/* Search terms */}
        <div>
          <span
            className="block mb-2"
            style={{
              fontFamily: "var(--font-day22-mono)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#555",
            }}
          >
            SEARCH TERMS
          </span>
          <div className="flex flex-wrap gap-2">
            {concept.searchTerms.map((term) => (
              <span
                key={term}
                className="px-2 py-1"
                style={{
                  fontFamily: "var(--font-day22-mono)",
                  fontSize: "11px",
                  color: "#eeeeee",
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 0,
                }}
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

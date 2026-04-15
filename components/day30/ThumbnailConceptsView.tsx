"use client";

import type { ThumbnailPack } from "@/types/day30";

interface ThumbnailConceptsViewProps {
  thumbnails: ThumbnailPack;
}

/** Parse a color scheme string to extract a representative color for the swatch */
function extractSwatchColor(colorScheme: string): string {
  const colorMap: Record<string, string> = {
    red: "#ff4444",
    yellow: "#FFB800",
    orange: "#FF8C00",
    blue: "#4488ff",
    green: "#00FF41",
    purple: "#8B5CF6",
    pink: "#EC4899",
    black: "#1a1a1a",
    white: "#eeeeee",
    cyan: "#06B6D4",
    teal: "#14B8A6",
  };

  const lower = colorScheme.toLowerCase();
  for (const [name, hex] of Object.entries(colorMap)) {
    if (lower.includes(name)) return hex;
  }
  return "#00FF41";
}

export function ThumbnailConceptsView({
  thumbnails,
}: ThumbnailConceptsViewProps) {
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
          THUMBNAIL CONCEPTS
        </span>
        <span
          style={{
            fontFamily: "var(--font-day30-mono)",
            fontSize: "11px",
            color: "#555",
          }}
        >
          {thumbnails.concepts.length} concepts
        </span>
      </div>

      {/* Concepts */}
      <div className="space-y-3">
        {thumbnails.concepts.map((concept, i) => {
          const swatchColor = extractSwatchColor(concept.colorScheme);
          return (
            <div
              key={i}
              className="p-4"
              style={{
                background: "#111111",
                border: "1px solid #2a2a2a",
                borderRadius: 0,
              }}
            >
              {/* Header with concept number and color swatch */}
              <div className="flex items-center gap-3 mb-3">
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
                  CONCEPT {i + 1}
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
                  {concept.emotionTrigger}
                </span>
              </div>

              {/* Color swatch + text overlay preview */}
              <div
                className="flex items-center justify-center p-6 mb-3"
                style={{
                  background: swatchColor,
                  borderRadius: 0,
                  minHeight: "80px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-day30-heading)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color:
                      swatchColor === "#eeeeee" || swatchColor === "#FFB800"
                        ? "#000"
                        : "#fff",
                    textTransform: "uppercase",
                    textAlign: "center",
                    textShadow:
                      swatchColor === "#1a1a1a"
                        ? "0 0 10px rgba(255,255,255,0.3)"
                        : "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {concept.textOverlay}
                </span>
              </div>

              {/* Layout */}
              <div className="mb-2">
                <span
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "10px",
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  LAYOUT
                </span>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "var(--font-day30-body)",
                    fontSize: "13px",
                    color: "#ccc",
                    lineHeight: 1.5,
                  }}
                >
                  {concept.layout}
                </p>
              </div>

              {/* Color scheme */}
              <div className="mb-2">
                <span
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "10px",
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  COLOR SCHEME
                </span>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "var(--font-day30-body)",
                    fontSize: "13px",
                    color: "#999",
                    lineHeight: 1.5,
                  }}
                >
                  {concept.colorScheme}
                </p>
              </div>

              {/* Description */}
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-day30-mono)",
                    fontSize: "10px",
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  CREATIVE DIRECTION
                </span>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "var(--font-day30-body)",
                    fontSize: "13px",
                    color: "#999",
                    lineHeight: 1.5,
                  }}
                >
                  {concept.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

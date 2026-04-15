"use client";

import type { CompanyEnrichment } from "@/types/day29";

interface StageEnrichmentProps {
  data: CompanyEnrichment;
}

export function StageEnrichment({ data }: StageEnrichmentProps) {
  return (
    <div className="space-y-5">
      {/* Company name + badges */}
      <div>
        <h3
          style={{
            fontFamily: "var(--font-day29-heading)",
            fontSize: "20px",
            fontWeight: 700,
            color: "#eeeeee",
            marginBottom: "8px",
          }}
        >
          {data.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          <span
            className="px-3 py-1 text-xs"
            style={{
              fontFamily: "var(--font-day29-mono)",
              background: "rgba(0,255,65,0.08)",
              border: "1px solid rgba(0,255,65,0.2)",
              color: "#00FF41",
              borderRadius: 0,
            }}
          >
            {data.industry}
          </span>
          <span
            className="px-3 py-1 text-xs"
            style={{
              fontFamily: "var(--font-day29-mono)",
              background: "rgba(0,255,65,0.08)",
              border: "1px solid rgba(0,255,65,0.2)",
              color: "#00FF41",
              borderRadius: 0,
            }}
          >
            {data.size}
          </span>
        </div>
      </div>

      {/* Description */}
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
          DESCRIPTION
        </label>
        <p
          style={{
            fontFamily: "var(--font-day29-body)",
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#999",
          }}
        >
          {data.description}
        </p>
      </div>

      {/* Key Products */}
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
          KEY PRODUCTS
        </label>
        <div className="space-y-1">
          {data.keyProducts.map((product, i) => (
            <div
              key={i}
              className="flex items-start gap-2"
              style={{
                fontFamily: "var(--font-day29-body)",
                fontSize: "13px",
                color: "#999",
              }}
            >
              <span style={{ color: "#00FF41", marginTop: "2px" }}>&#8250;</span>
              <span>{product}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pain Points */}
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
          PAIN POINTS
        </label>
        <div className="space-y-1">
          {data.painPoints.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-2"
              style={{
                fontFamily: "var(--font-day29-body)",
                fontSize: "13px",
                color: "#ff8800",
              }}
            >
              <span style={{ marginTop: "2px" }}>!</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent News */}
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
          RECENT NEWS
        </label>
        <div className="space-y-2">
          {data.recentNews.map((news, i) => (
            <div
              key={i}
              className="px-3 py-2"
              style={{
                fontFamily: "var(--font-day29-body)",
                fontSize: "13px",
                lineHeight: 1.5,
                color: "#999",
                background: "#111111",
                border: "1px solid #2a2a2a",
                borderRadius: 0,
              }}
            >
              {news}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

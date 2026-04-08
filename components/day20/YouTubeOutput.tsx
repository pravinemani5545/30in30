"use client";

import type { YouTubeDescription } from "@/types/day20";

interface YouTubeOutputProps {
  data: YouTubeDescription;
}

export function YouTubeOutput({ data }: YouTubeOutputProps) {
  return (
    <div className="space-y-4">
      <div>
        <span
          className="block mb-1"
          style={{
            fontFamily: "var(--font-day20-mono)",
            fontSize: "10px",
            color: "#555",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          TITLE
        </span>
        <p
          style={{
            fontFamily: "var(--font-day20-heading)",
            fontSize: "16px",
            fontWeight: 600,
            color: "#eeeeee",
          }}
        >
          {data.title}
        </p>
      </div>

      <div>
        <span
          className="block mb-1"
          style={{
            fontFamily: "var(--font-day20-mono)",
            fontSize: "10px",
            color: "#555",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          DESCRIPTION
        </span>
        <p
          style={{
            fontFamily: "var(--font-day20-body)",
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#999",
          }}
        >
          {data.body}
        </p>
      </div>

      {data.timestamps.length > 0 && (
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
            TIMESTAMPS
          </span>
          <div className="space-y-1">
            {data.timestamps.map((ts, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: "var(--font-day20-mono)",
                    fontSize: "13px",
                    color: "#00FF41",
                    minWidth: "50px",
                  }}
                >
                  {ts.time}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-day20-body)",
                    fontSize: "13px",
                    color: "#999",
                  }}
                >
                  {ts.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {data.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1"
              style={{
                fontFamily: "var(--font-day20-mono)",
                fontSize: "11px",
                color: "#555",
                background: "#131313",
                border: "1px solid #2a2a2a",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

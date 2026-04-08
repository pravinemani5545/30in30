"use client";

import type { XThread } from "@/types/day20";

interface XThreadOutputProps {
  data: XThread;
}

export function XThreadOutput({ data }: XThreadOutputProps) {
  return (
    <div className="space-y-0">
      {data.tweets.map((tweet, i) => (
        <div
          key={i}
          className="relative py-3 px-4"
          style={{
            borderBottom:
              i < data.tweets.length - 1
                ? "1px solid #2a2a2a"
                : "none",
            borderLeft:
              i === 0 ? "2px solid #00FF41" : "2px solid transparent",
          }}
        >
          <span
            className="absolute top-3 right-4"
            style={{
              fontFamily: "var(--font-day20-mono)",
              fontSize: "10px",
              color: "#555",
            }}
          >
            {i + 1}/{data.tweetCount}
          </span>
          <p
            className="pr-12"
            style={{
              fontFamily: "var(--font-day20-body)",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#999",
            }}
          >
            {tweet}
          </p>
        </div>
      ))}
    </div>
  );
}

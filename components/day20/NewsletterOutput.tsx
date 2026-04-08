"use client";

import type { NewsletterSection } from "@/types/day20";

interface NewsletterOutputProps {
  data: NewsletterSection;
}

export function NewsletterOutput({ data }: NewsletterOutputProps) {
  return (
    <div className="space-y-4">
      <p
        style={{
          fontFamily: "var(--font-day20-body)",
          fontSize: "14px",
          lineHeight: 1.8,
          color: "#999",
          whiteSpace: "pre-wrap",
        }}
      >
        {data.body}
      </p>
      <div
        className="pt-3"
        style={{ borderTop: "1px solid #2a2a2a" }}
      >
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
          CTA
        </span>
        <p
          style={{
            fontFamily: "var(--font-day20-body)",
            fontSize: "14px",
            color: "#00FF41",
          }}
        >
          {data.cta}
        </p>
      </div>
    </div>
  );
}

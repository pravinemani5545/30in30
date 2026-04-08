"use client";

interface LinkedInOutputProps {
  text: string;
}

export function LinkedInOutput({ text }: LinkedInOutputProps) {
  return (
    <p
      style={{
        fontFamily: "var(--font-day20-body)",
        fontSize: "14px",
        lineHeight: 1.8,
        color: "#999",
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </p>
  );
}

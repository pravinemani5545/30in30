"use client";

import { useRef } from "react";

interface SourceTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export function SourceTextarea({ value, onChange }: SourceTextareaProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const wordCount = value.trim()
    ? value.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = value.length;

  return (
    <div>
      <label
        className="block mb-2"
        style={{
          fontFamily: "var(--font-day20-mono)",
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#00FF41",
          opacity: 0.75,
        }}
      >
        SOURCE CONTENT
      </label>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your script, blog post, or transcript here..."
        style={{
          width: "100%",
          height: "200px",
          padding: "16px",
          background: "#060606",
          border: "1px solid #2a2a2a",
          color: "#eeeeee",
          fontFamily: "var(--font-day20-body)",
          fontSize: "15px",
          lineHeight: 1.7,
          resize: "none",
          outline: "none",
          borderRadius: 0,
          overflowY: "auto",
        }}
        className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
      />
      <div
        className="flex justify-between mt-2"
        style={{
          fontFamily: "var(--font-day20-mono)",
          fontSize: "11px",
          color: "#555",
        }}
      >
        <span>{charCount.toLocaleString()} chars</span>
        <span>{wordCount.toLocaleString()} words</span>
      </div>
    </div>
  );
}

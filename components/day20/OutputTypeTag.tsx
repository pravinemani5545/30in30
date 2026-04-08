"use client";

interface OutputTypeTagProps {
  tag: string;
}

export function OutputTypeTag({ tag }: OutputTypeTagProps) {
  return (
    <span
      style={{
        fontFamily: "var(--font-day20-mono)",
        fontSize: "11px",
        color: "#555",
        letterSpacing: "1px",
      }}
    >
      {tag}
    </span>
  );
}

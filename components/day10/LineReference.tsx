"use client";

export function LineReference({ reference }: { reference: string }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 text-[12px] font-bold font-mono"
      style={{
        background: "var(--surface-raised)",
        color: "var(--text-secondary)",
        borderRadius: 3,
      }}
    >
      {reference}
    </span>
  );
}

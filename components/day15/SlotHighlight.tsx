"use client";

export function SlotHighlight({ name }: { name: string }) {
  return (
    <span
      className="inline-block rounded px-1 py-0.5 text-[11px] font-bold"
      style={{
        background: "var(--slot-bg)",
        border: "1px solid var(--slot-border)",
        color: "var(--slot-text)",
      }}
    >
      {`{{${name}}}`}
    </span>
  );
}

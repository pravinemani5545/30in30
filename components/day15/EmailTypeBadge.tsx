"use client";

export function EmailTypeBadge({
  label,
  colour,
}: {
  label: string;
  colour: string;
}) {
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-[0.1em]"
      style={{ color: colour }}
    >
      {label}
    </span>
  );
}

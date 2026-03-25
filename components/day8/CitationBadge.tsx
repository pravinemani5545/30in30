"use client";

interface CitationBadgeProps {
  page: number | [number, number];
}

export function CitationBadge({ page }: CitationBadgeProps) {
  const label = Array.isArray(page)
    ? `pp.${page[0]}-${page[1]}`
    : `p.${page}`;

  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold font-sans bg-[#E8A02015] border border-[#E8A020] text-[#E8A020] cursor-default">
      {label}
    </span>
  );
}

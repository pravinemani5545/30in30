"use client";

interface SimDotProps {
  similarity: number;
}

export function SimDot({ similarity }: SimDotProps) {
  if (similarity < 0.7) return null;

  const isHigh = similarity >= 0.85;
  const color = isHigh ? "bg-[#22C55E]" : "bg-[#E8A020]";
  const label = isHigh ? "Very high relevance" : "High relevance";

  return (
    <span className="relative group">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] text-[#F5F0E8] bg-[#1A1A1A] border border-[#262626] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </span>
  );
}

"use client";

export function CacheStatusBadge({
  wasCached,
  cacheHitAt,
}: {
  wasCached: boolean;
  cacheHitAt: string | null;
}) {
  if (wasCached) {
    const time = cacheHitAt
      ? new Date(cacheHitAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#22C55E15] text-[#22C55E] border border-[#22C55E30]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
        Cached{time ? ` · ${time}` : ""}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#E8A02015] text-[#E8A020] border border-[#E8A02030]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#E8A020]" />
      Fresh
    </span>
  );
}

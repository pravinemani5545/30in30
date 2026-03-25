"use client";

import { CitationBadge } from "./CitationBadge";
import { SimDot } from "./SimDot";
import type { RetrievedChunk } from "@/types/day8";

interface SourceChunkProps {
  chunk: RetrievedChunk;
}

export function SourceChunk({ chunk }: SourceChunkProps) {
  const page: number | [number, number] =
    chunk.pageStart !== chunk.pageEnd
      ? [chunk.pageStart, chunk.pageEnd]
      : chunk.pageNumber;

  // Truncate content to ~2 lines (roughly 200 chars)
  const preview =
    chunk.content.length > 200
      ? chunk.content.slice(0, 200) + "..."
      : chunk.content;

  return (
    <div className="flex items-start gap-2 py-2">
      <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
        <SimDot similarity={chunk.similarity} />
        <CitationBadge page={page} />
      </div>
      <p className="text-[13px] text-[#8A8580] leading-relaxed line-clamp-2">
        {preview}
      </p>
    </div>
  );
}

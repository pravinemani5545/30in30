"use client";

import { Clock, Loader2 } from "lucide-react";
import type { Voiceover } from "@/types/day16";

interface VoiceoverHistoryProps {
  voiceovers: Voiceover[];
  isLoading: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function VoiceoverHistory({
  voiceovers,
  isLoading,
}: VoiceoverHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-4 w-4 animate-spin text-[var(--text-tertiary)]" />
      </div>
    );
  }

  if (voiceovers.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-[var(--text-tertiary)]">
        No voiceovers yet. Generate your first one!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-serif text-lg text-[var(--foreground)]">
        History
      </h3>
      <div className="space-y-2">
        {voiceovers.map((vo) => (
          <div
            key={vo.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <p className="line-clamp-2 text-sm text-[var(--foreground)]">
              {vo.text_content}
            </p>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(vo.created_at)}
              </span>
              {vo.voice_name && <span>{vo.voice_name}</span>}
              <span>{vo.character_count} chars</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

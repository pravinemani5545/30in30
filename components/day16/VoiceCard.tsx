"use client";

import { useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ElevenLabsVoice } from "@/types/day16";

interface VoiceCardProps {
  voice: ElevenLabsVoice;
  isSelected: boolean;
  onSelect: () => void;
}

const categoryColors: Record<string, string> = {
  premade: "var(--voice-premade)",
  cloned: "var(--voice-cloned)",
  generated: "var(--voice-generated)",
};

export function VoiceCard({ voice, isSelected, onSelect }: VoiceCardProps) {
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const togglePreview = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const audio = previewAudioRef.current;
      if (!audio || !voice.preview_url) return;

      if (isPreviewing) {
        audio.pause();
        audio.currentTime = 0;
        setIsPreviewing(false);
      } else {
        audio.src = voice.preview_url;
        audio.play().catch(() => setIsPreviewing(false));
        setIsPreviewing(true);
      }
    },
    [isPreviewing, voice.preview_url],
  );

  const labelEntries = Object.entries(voice.labels).slice(0, 3);

  return (
    <div
      onClick={onSelect}
      className="cursor-pointer rounded-lg border bg-[var(--surface)] p-3 transition-colors hover:bg-[var(--surface-raised)]"
      style={{
        borderColor: isSelected ? "var(--accent)" : "var(--border)",
      }}
    >
      {/* Separate preview audio element — NOT the main audioRef */}
      <audio
        ref={previewAudioRef}
        onEnded={() => setIsPreviewing(false)}
        preload="none"
      />

      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-[var(--foreground)]">
            {voice.name}
          </h4>
          <Badge
            variant="outline"
            className="mt-1 border-0 px-1.5 py-0 text-[10px] font-medium uppercase"
            style={{
              color: categoryColors[voice.category] ?? "var(--text-secondary)",
              backgroundColor: `color-mix(in srgb, ${categoryColors[voice.category] ?? "var(--text-secondary)"} 12%, transparent)`,
            }}
          >
            {voice.category}
          </Badge>
        </div>

        {voice.preview_url && (
          <button
            onClick={togglePreview}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]"
          >
            {isPreviewing ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="ml-0.5 h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {labelEntries.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {labelEntries.map(([key, value]) => (
            <span
              key={key}
              className="rounded bg-[var(--surface-raised)] px-1.5 py-0.5 text-[10px] text-[var(--text-tertiary)]"
            >
              {value}
            </span>
          ))}
        </div>
      )}

      {voice.description && (
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-[var(--text-tertiary)]">
          {voice.description}
        </p>
      )}
    </div>
  );
}

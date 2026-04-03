"use client";

import {
  Play,
  Pause,
  Download,
  Save,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { GenerationState } from "@/types/day16";

interface AudioPlayerProps {
  state: GenerationState;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  bytesReceived: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onDownload: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasSaved: boolean;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AudioPlayer({
  state,
  currentTime,
  duration,
  isPlaying,
  volume,
  bytesReceived,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onDownload,
  onSave,
  isSaving,
  hasSaved,
}: AudioPlayerProps) {
  const isIdle = state === "idle";
  const isLoading = state === "generating" || state === "buffering";
  const isReady = state === "ready";
  const isError = state === "error";
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const progressBarColor = isError
    ? "var(--audio-error)"
    : isLoading
      ? "var(--audio-loading)"
      : isReady
        ? isPlaying
          ? "var(--audio-playing)"
          : "var(--audio-ready)"
        : "var(--audio-idle)";

  return (
    <div
      className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 ${isLoading ? "animate-pulse" : ""}`}
    >
      {/* Player header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg text-[var(--foreground)]">
          Audio Player
        </h3>
        {isLoading && (
          <span className="flex items-center gap-1.5 text-xs text-[var(--accent)]">
            <Loader2 className="h-3 w-3 animate-spin" />
            {formatBytes(bytesReceived)} received
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div
          className="relative h-2 w-full cursor-pointer rounded-full bg-[var(--border)]"
          onClick={(e) => {
            if (!isReady || duration <= 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / rect.width) * duration;
            onSeek(newTime);
          }}
        >
          <div
            className="h-2 rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              backgroundColor: progressBarColor,
            }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[11px] text-[var(--text-tertiary)]">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={!isReady}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--background)] transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" />
          )}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
            className="text-[var(--text-secondary)] hover:text-[var(--foreground)]"
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <Slider
            value={[volume]}
            onValueChange={(v) => onVolumeChange(Array.isArray(v) ? v[0] : v)}
            min={0}
            max={1}
            step={0.05}
            className="w-20"
          />
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          disabled={!isReady}
          className="border-[var(--border)] text-[var(--text-secondary)]"
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          MP3
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={!isReady || isSaving || hasSaved}
          className="border-[var(--border)] text-[var(--text-secondary)]"
        >
          {isSaving ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-3.5 w-3.5" />
          )}
          {hasSaved ? "Saved" : "Save"}
        </Button>
      </div>
    </div>
  );
}

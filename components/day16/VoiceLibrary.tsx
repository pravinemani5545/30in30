"use client";

import { useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VoiceCard } from "./VoiceCard";
import type { ElevenLabsVoice } from "@/types/day16";

interface VoiceLibraryProps {
  voices: ElevenLabsVoice[];
  filteredVoices: ElevenLabsVoice[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedVoice: ElevenLabsVoice | null;
  onSelectVoice: (voice: ElevenLabsVoice) => void;
  onLoadVoices: () => void;
}

export function VoiceLibrary({
  filteredVoices,
  isLoading,
  error,
  searchQuery,
  onSearchChange,
  selectedVoice,
  onSelectVoice,
  onLoadVoices,
}: VoiceLibraryProps) {
  // Lazy load voices on first render of this component
  useEffect(() => {
    onLoadVoices();
  }, [onLoadVoices]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-[var(--foreground)]">
          Voice Library
        </h3>
        {isLoading && (
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading...
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-tertiary)]" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search voices..."
          className="border-[var(--border)] bg-[var(--surface)] pl-8 text-sm"
        />
      </div>

      {error && (
        <p className="text-xs text-[var(--error)]">{error}</p>
      )}

      {/* Voice grid */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {filteredVoices.map((voice) => (
          <VoiceCard
            key={voice.voice_id}
            voice={voice}
            isSelected={selectedVoice?.voice_id === voice.voice_id}
            onSelect={() => onSelectVoice(voice)}
          />
        ))}
      </div>

      {!isLoading && filteredVoices.length === 0 && (
        <p className="py-6 text-center text-sm text-[var(--text-tertiary)]">
          {searchQuery ? "No voices match your search." : "No voices available."}
        </p>
      )}
    </div>
  );
}

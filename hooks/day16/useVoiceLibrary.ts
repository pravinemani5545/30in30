"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { ElevenLabsVoice } from "@/types/day16";

interface UseVoiceLibraryReturn {
  voices: ElevenLabsVoice[];
  filteredVoices: ElevenLabsVoice[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  loadVoices: () => Promise<void>;
  selectedVoice: ElevenLabsVoice | null;
  selectVoice: (voice: ElevenLabsVoice) => void;
}

export function useVoiceLibrary(): UseVoiceLibraryReturn {
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice | null>(
    null,
  );
  const hasFetchedRef = useRef(false);

  const loadVoices = useCallback(async () => {
    // Only fetch once — lazy load on first interaction
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/day16/voices");
      if (!response.ok) {
        throw new Error("Failed to fetch voices");
      }
      const data = await response.json();
      setVoices(data.voices);

      // Auto-select first voice if none selected
      if (data.voices.length > 0 && !selectedVoice) {
        setSelectedVoice(data.voices[0]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load voices";
      setError(message);
      hasFetchedRef.current = false; // Allow retry on error
    } finally {
      setIsLoading(false);
    }
  }, [selectedVoice]);

  const filteredVoices = useMemo(() => {
    if (!searchQuery.trim()) return voices;
    const q = searchQuery.toLowerCase();
    return voices.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        Object.values(v.labels).some((l) => l.toLowerCase().includes(q)),
    );
  }, [voices, searchQuery]);

  const selectVoice = useCallback((voice: ElevenLabsVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    voices,
    filteredVoices,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    loadVoices,
    selectedVoice,
    selectVoice,
  };
}

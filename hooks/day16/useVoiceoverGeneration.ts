"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  collectStreamToBlob,
  blobToObjectUrl,
  revokeObjectUrl,
} from "@/lib/day16/audio/buffer";
import type { GenerationState, VoiceSettings } from "@/types/day16";

interface UseVoiceoverGenerationReturn {
  state: GenerationState;
  errorMessage: string | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  blob: Blob | null;
  bytesReceived: number;
  generationMs: number | null;
  generate: (
    text: string,
    voiceId: string,
    settings: VoiceSettings,
  ) => Promise<Blob | null>;
  reset: () => void;
}

export function useVoiceoverGeneration(): UseVoiceoverGenerationReturn {
  const [state, setState] = useState<GenerationState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [bytesReceived, setBytesReceived] = useState(0);
  const [generationMs, setGenerationMs] = useState<number | null>(null);

  // ALL refs null-initialised (ISSUE 4)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (
      text: string,
      voiceId: string,
      settings: VoiceSettings,
    ): Promise<Blob | null> => {
      // Abort any in-progress generation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Revoke previous object URL to free memory (ISSUE 10)
      if (objectUrlRef.current) {
        revokeObjectUrl(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      setState("generating");
      setErrorMessage(null);
      setBytesReceived(0);
      setBlob(null);
      setGenerationMs(null);

      const startTime = Date.now();

      try {
        const response = await fetch("/api/day16/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voiceId, settings }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(
            errData?.error ?? `Generation failed: ${response.status}`,
          );
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        setState("buffering");

        // COLLECT the entire stream — DO NOT pipe directly to audio (ISSUE 8)
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let totalBytes = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            totalBytes += value.length;
            setBytesReceived(totalBytes);
          }
        }

        // Use collectStreamToBlob's concatenation approach inline
        // (stream already consumed, so work with collected chunks)
        const combined = new Uint8Array(totalBytes);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }

        const audioBlob = new Blob([combined], { type: "audio/mpeg" });
        const objectUrl = blobToObjectUrl(audioBlob);
        objectUrlRef.current = objectUrl;

        setBlob(audioBlob);
        setGenerationMs(Date.now() - startTime);

        // Set on audio element and play
        if (audioRef.current) {
          audioRef.current.src = objectUrl;
          audioRef.current.load();
        }

        setState("ready");
        return audioBlob;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setState("idle");
          return null;
        }
        const message =
          err instanceof Error ? err.message : "Generation failed";
        setErrorMessage(message);
        setState("error");
        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (objectUrlRef.current) {
      revokeObjectUrl(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
    }
    setState("idle");
    setErrorMessage(null);
    setBlob(null);
    setBytesReceived(0);
    setGenerationMs(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) revokeObjectUrl(objectUrlRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return {
    state,
    errorMessage,
    audioRef,
    blob,
    bytesReceived,
    generationMs,
    generate,
    reset,
  };
}

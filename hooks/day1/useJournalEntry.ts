"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import type { AnalyzedEntry } from "@/types/day1";

type State = "idle" | "recording" | "processing" | "result" | "error";

interface UseJournalEntryReturn {
  state: State;
  transcript: string;
  interimTranscript: string;
  result: (AnalyzedEntry & { id: string | null }) | null;
  error: string | null;
  speechError: ReturnType<typeof useSpeechRecognition>["error"];
  isSupported: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  reset: () => void;
}

export function useJournalEntry(): UseJournalEntryReturn {
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<(AnalyzedEntry & { id: string | null }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number | null>(null);
  // Tracks whether speech.isListening has been true at least once this session,
  // so we don't fire stopRecording before recording actually started.
  const hasStartedListeningRef = useRef(false);

  const speech = useSpeechRecognition();

  const stopRecording = useCallback(async () => {
    if (state !== "recording") return;
    speech.stop();
    setState("processing");

    const transcript = speech.transcript;
    const duration = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : undefined;

    if (!transcript || transcript.trim().split(/\s+/).length < 5) {
      setState("error");
      setError("Too short — try speaking for a bit longer.");
      return;
    }

    try {
      const response = await fetch("/api/day1/journal/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, duration_seconds: duration }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Analysis failed");
      }

      const data = (await response.json()) as AnalyzedEntry & { id: string | null };
      setResult(data);
      setState("result");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }, [state, speech]);

  // If a speech error fires while we're in "recording" state, reset to idle
  useEffect(() => {
    if (speech.error && state === "recording") {
      setState("idle");
    }
  }, [speech.error, state]);

  // Track when speech recognition actually starts listening
  useEffect(() => {
    if (speech.isListening) {
      hasStartedListeningRef.current = true;
    }
  }, [speech.isListening]);

  // When the silence timer fires, speech.stop() is called internally but
  // useJournalEntry state stays "recording". Detect that here and trigger analysis.
  useEffect(() => {
    if (
      !speech.isListening &&
      hasStartedListeningRef.current &&
      state === "recording" &&
      !speech.error
    ) {
      hasStartedListeningRef.current = false;
      stopRecording();
    }
  }, [speech.isListening, state, speech.error, stopRecording]);

  const startRecording = useCallback(() => {
    setResult(null);
    setError(null);
    startTimeRef.current = Date.now();
    hasStartedListeningRef.current = false;
    speech.reset();
    const started = speech.start();
    if (started) {
      setState("recording");
    }
  }, [speech]);

  const reset = useCallback(() => {
    speech.reset();
    hasStartedListeningRef.current = false;
    setState("idle");
    setResult(null);
    setError(null);
    startTimeRef.current = null;
  }, [speech]);

  return {
    state,
    transcript: speech.transcript,
    interimTranscript: speech.interimTranscript,
    result,
    error,
    speechError: speech.error,
    isSupported: speech.isSupported,
    startRecording,
    stopRecording,
    reset,
  };
}

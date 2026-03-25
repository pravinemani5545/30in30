"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type SpeechError =
  | "not-allowed"
  | "network"
  | "no-speech"
  | "audio-capture"
  | "not-supported"
  | "unknown";

interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: SpeechError | null;
  start: () => boolean;
  stop: () => void;
  reset: () => void;
}

const SILENCE_TIMEOUT_MS = 3000;

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<SpeechError | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastResultTimeRef = useRef<number>(0);

  useEffect(() => {
    setIsSupported(!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const resetSilenceTimer = useCallback(
    (onSilence: () => void) => {
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(onSilence, SILENCE_TIMEOUT_MS);
    },
    [clearSilenceTimer]
  );

  const stop = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript("");
  }, [clearSilenceTimer]);

  const start = useCallback((): boolean => {
    if (!isSupported) {
      setError("not-supported");
      return false;
    }

    setError(null);
    setTranscript("");
    setInterimTranscript("");
    lastResultTimeRef.current = Date.now();

    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setError("not-supported");
      return false;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      resetSilenceTimer(stop);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      lastResultTimeRef.current = Date.now();
      resetSilenceTimer(stop);

      let finalText = "";
      let interimText = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + " ";
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) setTranscript(finalText.trim());
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      clearSilenceTimer();
      setIsListening(false);
      setInterimTranscript("");
      switch (event.error) {
        case "not-allowed":
          setError("not-allowed");
          break;
        case "network":
          setError("network");
          break;
        case "no-speech":
          setError("no-speech");
          break;
        case "audio-capture":
          setError("audio-capture");
          break;
        default:
          setError("unknown");
      }
    };

    recognition.onend = () => {
      clearSilenceTimer();
      setIsListening(false);
      setInterimTranscript("");
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      return true;
    } catch {
      // Can throw synchronously if mic permission is blocked at OS level
      setError("not-allowed");
      recognitionRef.current = null;
      return false;
    }
  }, [isSupported, resetSilenceTimer, stop, clearSilenceTimer]);

  const reset = useCallback(() => {
    stop();
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [clearSilenceTimer]);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    start,
    stop,
    reset,
  };
}

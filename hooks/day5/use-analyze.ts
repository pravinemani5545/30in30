"use client";

import { useState } from "react";
import type { AnalyzeResponse, PitchAnalysis } from "@/types/day5";

interface UseAnalyzeReturn {
  analysis: PitchAnalysis | null;
  saved: boolean;
  loading: boolean;
  error: string | null;
  analyze: (pitch: string, context?: string) => Promise<void>;
  reset: () => void;
}

export function useAnalyze(): UseAnalyzeReturn {
  const [analysis, setAnalysis] = useState<PitchAnalysis | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(pitch: string, context?: string) {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSaved(false);

    try {
      const res = await fetch("/api/day5/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch, context: context || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      const response = data as AnalyzeResponse;
      setAnalysis(response.analysis);
      setSaved(response.saved);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setAnalysis(null);
    setSaved(false);
    setError(null);
  }

  return { analysis, saved, loading, error, analyze, reset };
}

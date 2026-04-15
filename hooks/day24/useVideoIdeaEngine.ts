"use client";

import { useState } from "react";
import type { VideoIdeaAnalysis } from "@/types/day24";

interface UseVideoIdeaEngineReturn {
  analyze: (niche: string) => Promise<void>;
  result: VideoIdeaAnalysis | null;
  loading: boolean;
  error: string | null;
}

export function useVideoIdeaEngine(): UseVideoIdeaEngineReturn {
  const [result, setResult] = useState<VideoIdeaAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(niche: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/day24/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analysis failed");
        return;
      }

      setResult(data.analysis);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return { analyze, result, loading, error };
}

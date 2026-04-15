"use client";

import { useState } from "react";
import type { BRollAnalysis } from "@/types/day22";

interface UseBRollFinderReturn {
  analyze: (script: string) => Promise<void>;
  result: BRollAnalysis | null;
  loading: boolean;
  error: string | null;
}

export function useBRollFinder(): UseBRollFinderReturn {
  const [result, setResult] = useState<BRollAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(script: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/day22/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script }),
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

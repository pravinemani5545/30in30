"use client";

import { useState } from "react";
import type { YouTubePackage } from "@/types/day30";

interface UseYouTubeKitReturn {
  generate: (topic: string) => Promise<void>;
  result: YouTubePackage | null;
  loading: boolean;
  error: string | null;
}

export function useYouTubeKit(): UseYouTubeKitReturn {
  const [result, setResult] = useState<YouTubePackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(topic: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/day30/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }

      setResult(data.package);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return { generate, result, loading, error };
}

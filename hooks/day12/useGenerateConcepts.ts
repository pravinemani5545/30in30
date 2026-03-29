"use client";

import { useState, useCallback } from "react";
import type { ThumbnailConceptSet } from "@/types/day12";

interface GenerateInput {
  videoTitle: string;
  niche: string;
  tone: string;
}

export function useGenerateConcepts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (
      input: GenerateInput,
    ): Promise<ThumbnailConceptSet | null> => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/day12/concepts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Something went wrong");
          return null;
        }

        return data.conceptSet as ThumbnailConceptSet;
      } catch {
        setError("Network error. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { generate, loading, error, clearError: () => setError(null) };
}

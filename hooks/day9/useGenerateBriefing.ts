"use client";

import { useState, useCallback } from "react";
import type { Briefing } from "@/types/day9";

interface UseGenerateBriefingReturn {
  generate: (
    personName: string,
    companyName: string,
    meetingContext: string
  ) => Promise<Briefing | null>;
  isGenerating: boolean;
  error: string | null;
}

export function useGenerateBriefing(): UseGenerateBriefingReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (
      personName: string,
      companyName: string,
      meetingContext: string
    ): Promise<Briefing | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const response = await fetch("/api/day9/briefings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personName, companyName, meetingContext }),
        });

        if (!response.ok) {
          const data = await response.json();
          const message =
            data.error ?? `Request failed (${response.status})`;
          setError(message);
          // If we got a briefingId back (partial failure), return it
          if (data.briefingId) {
            return { id: data.briefingId } as Briefing;
          }
          return null;
        }

        const briefing = (await response.json()) as Briefing;
        return briefing;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to generate briefing";
        setError(message);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return { generate, isGenerating, error };
}

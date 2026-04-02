"use client";

import { useState, useCallback } from "react";
import type { EmailSequence, SequenceInput } from "@/types/day15";

export function useGenerateSequence() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (input: SequenceInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/day15/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return null;
      }
      return data.sequence as EmailSequence;
    } catch {
      setError("Network error. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error, clearError: () => setError(null) };
}

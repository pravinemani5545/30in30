"use client";

import { useState, useCallback } from "react";
import type { ICPProfile } from "@/types/day13";

export function useSynthesise() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"synthesis" | "reality-check" | null>(null);

  const synthesise = useCallback(
    async (
      companyName: string,
      answers: Record<string, string>,
    ): Promise<ICPProfile | null> => {
      setLoading(true);
      setError(null);
      setStep("synthesis");

      try {
        // Show "Building profile..." for at least a moment
        const res = await fetch("/api/day13/profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyName, answers }),
        });

        // Shift to reality check step visually after a delay
        setStep("reality-check");

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Something went wrong");
          return null;
        }

        return data.profile as ICPProfile;
      } catch {
        setError("Network error. Please try again.");
        return null;
      } finally {
        setLoading(false);
        setStep(null);
      }
    },
    [],
  );

  return { synthesise, loading, error, step, clearError: () => setError(null) };
}

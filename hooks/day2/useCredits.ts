"use client";

import { useState, useEffect, useCallback } from "react";
import type { CreditsResponse } from "@/types/day2";

export function useCredits() {
  const [data, setData] = useState<CreditsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/day2/credits");
      if (res.ok) {
        const json = await res.json() as CreditsResponse;
        setData(json);
      }
    } catch {
      // Silent fail — non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCredits();
  }, [fetchCredits]);

  function decrementLocal() {
    setData((prev) =>
      prev
        ? {
            ...prev,
            creditsUsed: prev.creditsUsed + 1,
            creditsRemaining: Math.max(0, prev.creditsRemaining - 1),
          }
        : prev
    );
  }

  return { credits: data, loading, decrementLocal, refetch: fetchCredits };
}

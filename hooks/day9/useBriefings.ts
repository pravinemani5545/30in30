"use client";

import { useState, useEffect, useCallback } from "react";
import type { BriefingSummary } from "@/types/day9";

export function useBriefings() {
  const [briefings, setBriefings] = useState<BriefingSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/day9/briefings");
      if (response.ok) {
        const data = (await response.json()) as BriefingSummary[];
        setBriefings(data);
      }
    } catch {
      // Silently fail — sidebar data is non-critical
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeBriefing = useCallback((id: string) => {
    setBriefings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const addBriefing = useCallback((briefing: BriefingSummary) => {
    setBriefings((prev) => [briefing, ...prev]);
  }, []);

  return { briefings, isLoading, refresh, removeBriefing, addBriefing };
}

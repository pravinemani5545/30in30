"use client";

import { useState, useCallback } from "react";
import type { PriceHistoryEntry } from "@/types/day31";

interface UsePriceHistoryReturn {
  history: PriceHistoryEntry[];
  loading: boolean;
  error: string | null;
  fetch: (productId: string) => Promise<void>;
}

export function usePriceHistory(): UsePriceHistoryReturn {
  const [history, setHistory] = useState<PriceHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `/api/day31/products/${productId}/history?limit=50`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load history");
        return;
      }
      setHistory(data.history);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { history, loading, error, fetch: fetchHistory };
}

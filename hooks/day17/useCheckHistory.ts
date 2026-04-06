"use client";

import { useState, useEffect, useCallback } from "react";
import type { CheckHistoryItem, DeliverabilityReport } from "@/types/day17";

interface UseCheckHistoryReturn {
  history: CheckHistoryItem[];
  loading: boolean;
  refresh: () => Promise<void>;
  loadReport: (id: string) => Promise<DeliverabilityReport | null>;
}

export function useCheckHistory(): UseCheckHistoryReturn {
  const [history, setHistory] = useState<CheckHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/day17/history");
      const data = await res.json();
      if (res.ok) {
        setHistory(data.checks ?? []);
      }
    } catch {
      // Silent fail for history
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const loadReport = useCallback(async (id: string): Promise<DeliverabilityReport | null> => {
    try {
      const res = await fetch(`/api/day17/report/${id}`);
      const data = await res.json();
      if (res.ok) return data.report;
      return null;
    } catch {
      return null;
    }
  }, []);

  return { history, loading, refresh: fetchHistory, loadReport };
}

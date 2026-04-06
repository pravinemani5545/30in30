"use client";

import { useState, useCallback } from "react";
import type { DeliverabilityReport } from "@/types/day17";

interface UseDeliverabilityCheckReturn {
  report: DeliverabilityReport | null;
  loading: boolean;
  error: string | null;
  checkDomain: (domain: string) => Promise<void>;
  setReport: (report: DeliverabilityReport) => void;
  reset: () => void;
}

export function useDeliverabilityCheck(): UseDeliverabilityCheckReturn {
  const [report, setReport] = useState<DeliverabilityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDomain = useCallback(async (domain: string) => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch("/api/day17/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Check failed");
        return;
      }

      setReport(data.report);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setReport(null);
    setError(null);
    setLoading(false);
  }, []);

  const showReport = useCallback((r: DeliverabilityReport) => {
    setError(null);
    setReport(r);
  }, []);

  return { report, loading, error, checkDomain, setReport: showReport, reset };
}

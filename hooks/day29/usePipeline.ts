"use client";

import { useState } from "react";
import type { PipelineResult } from "@/types/day29";

type StageName =
  | "enrichment"
  | "outreach"
  | "sequence"
  | "campaign"
  | null;

interface UsePipelineReturn {
  run: (companyInput: string) => Promise<void>;
  result: PipelineResult | null;
  currentStage: StageName;
  loading: boolean;
  error: string | null;
}

export function usePipeline(): UsePipelineReturn {
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [currentStage, setCurrentStage] = useState<StageName>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(companyInput: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentStage("enrichment");

    // Simulate stage progression for UX while the API runs all 4 stages
    const stageTimers: ReturnType<typeof setTimeout>[] = [];
    stageTimers.push(
      setTimeout(() => setCurrentStage("outreach"), 4000),
    );
    stageTimers.push(
      setTimeout(() => setCurrentStage("sequence"), 8000),
    );
    stageTimers.push(
      setTimeout(() => setCurrentStage("campaign"), 12000),
    );

    try {
      const res = await fetch("/api/day29/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyInput }),
      });

      const data = await res.json();

      // Clear stage simulation timers
      stageTimers.forEach(clearTimeout);

      if (!res.ok) {
        setError(data.error || "Pipeline failed");
        // Still set partial results if available
        if (data.result) {
          setResult(data.result);
        }
        return;
      }

      setResult(data.result);
    } catch {
      stageTimers.forEach(clearTimeout);
      setError("Network error. Please try again.");
    } finally {
      setCurrentStage(null);
      setLoading(false);
    }
  }

  return { run, result, currentStage, loading, error };
}

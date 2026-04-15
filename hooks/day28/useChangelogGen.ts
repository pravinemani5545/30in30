"use client";

import { useState } from "react";
import type { ChangelogResult } from "@/types/day28";

interface UseChangelogGenReturn {
  generate: (gitLog: string) => Promise<void>;
  result: ChangelogResult | null;
  loading: boolean;
  error: string | null;
}

export function useChangelogGen(): UseChangelogGenReturn {
  const [result, setResult] = useState<ChangelogResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(gitLog: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/day28/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gitLog }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }

      setResult(data.changelog);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return { generate, result, loading, error };
}

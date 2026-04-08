"use client";

import { useState } from "react";
import type {
  RepurposedContent,
  RepurposeInput,
} from "@/types/day20";

interface UseRepurposeReturn {
  run: (input: RepurposeInput) => Promise<void>;
  result: RepurposedContent | null;
  wasTrimmed: boolean;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
}

export function useRepurpose(): UseRepurposeReturn {
  const [result, setResult] = useState<RepurposedContent | null>(null);
  const [wasTrimmed, setWasTrimmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(true);

  async function run(input: RepurposeInput) {
    setLoading(true);
    setError(null);
    setResult(null);
    setWasTrimmed(false);

    try {
      const res = await fetch("/api/day20/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.status === 401) {
        setAuthenticated(false);
        setError("Please sign in to run the pipeline.");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Pipeline failed");
        return;
      }

      setResult(data.content);
      setWasTrimmed(data.wasTrimmed ?? false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return { run, result, wasTrimmed, loading, error, authenticated };
}

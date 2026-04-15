"use client";

import { useState } from "react";
import type { ClassifiedReply, ClassifyInput } from "@/types/day21";

interface UseClassifierReturn {
  classify: (input: ClassifyInput) => Promise<ClassifiedReply | null>;
  result: ClassifiedReply | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
}

export function useClassifier(): UseClassifierReturn {
  const [result, setResult] = useState<ClassifiedReply | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(true);

  async function classify(input: ClassifyInput): Promise<ClassifiedReply | null> {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/day21/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.status === 401) {
        setAuthenticated(false);
        setError("Please sign in to classify replies.");
        return null;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Classification failed");
        return null;
      }

      setResult(data.item);
      return data.item;
    } catch {
      setError("Network error. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { classify, result, loading, error, authenticated };
}

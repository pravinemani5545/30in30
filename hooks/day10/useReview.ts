"use client";

import { useState } from "react";
import type { CodeReview } from "@/types/day10";

interface UseReviewReturn {
  review: CodeReview | null;
  isLoading: boolean;
  error: string | null;
  submitReview: (code: string, detectedLanguage: string) => Promise<void>;
  reset: () => void;
}

export function useReview(): UseReviewReturn {
  const [review, setReview] = useState<CodeReview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitReview(code: string, detectedLanguage: string) {
    setIsLoading(true);
    setError(null);
    setReview(null);

    try {
      const res = await fetch("/api/day10/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, detectedLanguage }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Review failed");
        return;
      }

      setReview(data.review);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setReview(null);
    setError(null);
  }

  return { review, isLoading, error, submitReview, reset };
}

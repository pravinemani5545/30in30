"use client";

import { useState, useEffect, useCallback } from "react";
import type { CodeReviewSummary } from "@/types/day10";

export function useReviews() {
  const [reviews, setReviews] = useState<CodeReviewSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/day10/reviews");
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews ?? []);
      }
    } catch {
      // Silently fail — history is non-critical
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, isLoading, refetch: fetchReviews };
}

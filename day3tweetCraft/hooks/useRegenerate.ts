"use client";

import { useState, useCallback } from "react";
import type { TweetVariation } from "@/types";
import { toast } from "sonner";

export function useRegenerate() {
  const [loadingVariations, setLoadingVariations] = useState<Set<number>>(new Set());

  const regenerate = useCallback(
    async (
      generationId: string,
      variationNumber: number,
      onSuccess: (updated: TweetVariation) => void
    ) => {
      setLoadingVariations((prev) => new Set([...prev, variationNumber]));

      try {
        const res = await fetch("/api/regenerate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ generationId, variationNumber }),
        });

        const data = await res.json() as { variation: TweetVariation } | { error: string };

        if (!res.ok || "error" in data) {
          toast.error("error" in data ? data.error : "Regeneration failed");
          return;
        }

        onSuccess(data.variation);
        toast.success("Tweet regenerated");
      } catch {
        toast.error("Network error. Please try again.");
      } finally {
        setLoadingVariations((prev) => {
          const next = new Set(prev);
          next.delete(variationNumber);
          return next;
        });
      }
    },
    []
  );

  return { regenerate, loadingVariations };
}

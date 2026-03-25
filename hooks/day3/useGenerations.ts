"use client";

import { useState, useEffect, useCallback } from "react";
import type { GenerationListItem } from "@/types/day3";

export function useGenerations() {
  const [generations, setGenerations] = useState<GenerationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGenerations = useCallback(async () => {
    try {
      const res = await fetch("/api/day3/generations?limit=20");
      const data = await res.json() as { generations: GenerationListItem[] };
      if (res.ok && data.generations) {
        setGenerations(data.generations);
      }
    } catch {
      // Silent fail — history is non-critical
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations]);

  const addGeneration = useCallback((item: GenerationListItem) => {
    setGenerations((prev) => [item, ...prev]);
  }, []);

  const removeGeneration = useCallback(async (id: string) => {
    await fetch(`/api/day3/generations/${id}`, { method: "DELETE" });
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { generations, isLoading, fetchGenerations, addGeneration, removeGeneration };
}

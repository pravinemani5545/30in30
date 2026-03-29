"use client";

import { useState, useEffect, useCallback } from "react";
import type { ThumbnailConceptSummary, ThumbnailConceptSet } from "@/types/day12";

export function useConcepts() {
  const [items, setItems] = useState<ThumbnailConceptSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/day12/concepts");
      if (res.ok) {
        const data = await res.json();
        setItems(data.concepts ?? []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToHistory = useCallback((set: ThumbnailConceptSet) => {
    setItems((prev) => [
      {
        id: set.id,
        video_title: set.video_title,
        niche: set.niche,
        tone: set.tone,
        predicted_winner: set.predicted_winner,
        created_at: set.created_at,
      },
      ...prev,
    ]);
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, loading, refresh, addToHistory, removeFromHistory };
}

export function useConceptDetail(id: string | null) {
  const [data, setData] = useState<ThumbnailConceptSet | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }

    setLoading(true);
    fetch(`/api/day12/concepts/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setData(json?.conceptSet ?? null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading };
}

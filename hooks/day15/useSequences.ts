"use client";

import { useState, useEffect, useCallback } from "react";
import type { EmailSequence, SequenceHistoryItem } from "@/types/day15";

export function useSequences() {
  const [items, setItems] = useState<SequenceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/day15/sequences");
      if (res.ok) {
        const data = await res.json();
        setItems(data.sequences ?? []);
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

  const addToHistory = useCallback((seq: SequenceHistoryItem) => {
    setItems((prev) => [seq, ...prev]);
  }, []);

  return { items, loading, refresh, addToHistory };
}

export function useSequenceDetail(id: string | null) {
  const [sequence, setSequence] = useState<EmailSequence | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setSequence(null);
      return;
    }

    setLoading(true);
    fetch(`/api/day15/sequences/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSequence(data?.sequence ?? null))
      .catch(() => setSequence(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { sequence, loading };
}

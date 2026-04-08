"use client";

import { useState, useEffect, useCallback } from "react";
import type { RepurposedContentListItem, RepurposedContent } from "@/types/day20";

export function useRepurposedList() {
  const [items, setItems] = useState<RepurposedContentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/day20/repurpose");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, authenticated, refresh };
}

export function useRepurposedDetail(id: string | null) {
  const [content, setContent] = useState<RepurposedContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setContent(null);
      return;
    }

    setLoading(true);
    fetch(`/api/day20/repurpose/${id}`)
      .then((res) => res.json())
      .then((data) => setContent(data.content ?? null))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { content, loading };
}

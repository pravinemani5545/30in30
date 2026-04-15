"use client";

import { useState, useEffect, useCallback } from "react";
import type { ClassifiedReply } from "@/types/day21";

interface UseClassifiedRepliesReturn {
  items: ClassifiedReply[];
  loading: boolean;
  refresh: () => Promise<void>;
  authenticated: boolean;
}

export function useClassifiedReplies(): UseClassifiedRepliesReturn {
  const [items, setItems] = useState<ClassifiedReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/day21/replies");
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

  return { items, loading, refresh, authenticated };
}

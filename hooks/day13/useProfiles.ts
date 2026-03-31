"use client";

import { useState, useEffect, useCallback } from "react";
import type { ICPProfileSummary, ICPProfile } from "@/types/day13";

export function useProfiles() {
  const [items, setItems] = useState<ICPProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/day13/profiles");
      if (res.ok) {
        const data = await res.json();
        setItems(data.profiles ?? []);
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

  return { items, loading, refresh };
}

export function useProfile(id: string | null) {
  const [profile, setProfile] = useState<ICPProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setProfile(null);
      return;
    }

    setLoading(true);
    fetch(`/api/day13/profiles/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProfile(data?.profile ?? null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { profile, loading };
}

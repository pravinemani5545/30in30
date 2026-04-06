"use client";

import { useState, useEffect, useCallback } from "react";
import type { CalendarListItem, ContentCalendar } from "@/types/day19";

export function useCalendars() {
  const [calendars, setCalendars] = useState<CalendarListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/day19/calendars");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setCalendars(data);
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

  const loadFull = useCallback(
    async (id: string): Promise<ContentCalendar | null> => {
      try {
        const res = await fetch(`/api/day19/calendars/${id}`);
        if (!res.ok) return null;
        return (await res.json()) as ContentCalendar;
      } catch {
        return null;
      }
    },
    [],
  );

  const deleteCalendar = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/day19/calendars/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setCalendars((prev) => prev.filter((c) => c.id !== id));
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [],
  );

  return { calendars, loading, authenticated, refresh, loadFull, deleteCalendar };
}

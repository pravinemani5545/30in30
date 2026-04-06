"use client";

import { useState, useCallback } from "react";
import type { ContentCalendar, CalendarInput } from "@/types/day19";

interface UseGenerateCalendarReturn {
  generate: (input: CalendarInput) => Promise<ContentCalendar | null>;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
}

export function useGenerateCalendar(): UseGenerateCalendarReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(true);

  const generate = useCallback(
    async (input: CalendarInput): Promise<ContentCalendar | null> => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/day19/calendars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (res.status === 401) {
          setAuthenticated(false);
          setError("Sign in to generate calendars");
          return null;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Something went wrong. Please try again.");
          return null;
        }

        return data as ContentCalendar;
      } catch {
        setError("Something went wrong. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { generate, loading, error, authenticated };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import type { Voiceover } from "@/types/day16";

interface UseVoiceoversReturn {
  voiceovers: Voiceover[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useVoiceovers(): UseVoiceoversReturn {
  const [voiceovers, setVoiceovers] = useState<Voiceover[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowser();
      const { data } = await supabase
        .from("voiceovers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) setVoiceovers(data);
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { voiceovers, isLoading, refresh };
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import type { BriefingStatus } from "@/types/day9";

interface RealtimeState {
  searchSteps: [boolean, boolean, boolean];
  synthesisComplete: boolean;
  status: BriefingStatus;
  errorMessage: string | null;
}

const INITIAL_STATE: RealtimeState = {
  searchSteps: [false, false, false],
  synthesisComplete: false,
  status: "queued",
  errorMessage: null,
};

export function useBriefingRealtime(briefingId: string | null): RealtimeState {
  const [state, setState] = useState<RealtimeState>(INITIAL_STATE);

  const resetState = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  useEffect(() => {
    if (!briefingId) {
      resetState();
      return;
    }

    const supabase = createSupabaseBrowser();

    // Initial fetch to get current state
    supabase
      .from("briefings")
      .select(
        "status, search_1_done, search_2_done, search_3_done, synthesis_done, error_message"
      )
      .eq("id", briefingId)
      .single()
      .then(({ data }: { data: Record<string, unknown> | null }) => {
        if (data) {
          setState({
            searchSteps: [
              (data.search_1_done as boolean) ?? false,
              (data.search_2_done as boolean) ?? false,
              (data.search_3_done as boolean) ?? false,
            ],
            synthesisComplete: (data.synthesis_done as boolean) ?? false,
            status: (data.status as BriefingStatus) ?? "queued",
            errorMessage: (data.error_message as string) ?? null,
          });
        }
      });

    // Subscribe to changes
    const channel = supabase
      .channel(`briefing-${briefingId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "briefings",
          filter: `id=eq.${briefingId}`,
        },
        (payload: { new: Record<string, unknown> }) => {
          const row = payload.new;
          setState({
            searchSteps: [
              (row.search_1_done as boolean) ?? false,
              (row.search_2_done as boolean) ?? false,
              (row.search_3_done as boolean) ?? false,
            ],
            synthesisComplete: (row.synthesis_done as boolean) ?? false,
            status: (row.status as BriefingStatus) ?? "queued",
            errorMessage: (row.error_message as string) ?? null,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [briefingId, resetState]);

  return state;
}

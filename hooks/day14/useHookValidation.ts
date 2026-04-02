"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import type { HookQuality } from "@/types/day14";

interface HookValidationState {
  quality: HookQuality;
  reasoning: string | null;
}

interface RealtimePayload {
  new: {
    script_id: string;
    quality: HookQuality;
    reasoning: string | null;
  };
}

export function useHookValidation(scriptId: string | null): HookValidationState | null {
  const [validation, setValidation] = useState<HookValidationState | null>(null);

  // Fetch existing validation on mount / scriptId change
  const fetchExisting = useCallback(async (id: string) => {
    const supabase = createSupabaseBrowser();
    const { data } = await supabase
      .from("hook_validations")
      .select("quality, reasoning")
      .eq("script_id", id)
      .order("validated_at", { ascending: false })
      .limit(1)
      .single();

    if (data && data.quality !== "pending") {
      setValidation({ quality: data.quality, reasoning: data.reasoning });
    }
  }, []);

  useEffect(() => {
    if (!scriptId) {
      setValidation(null);
      return;
    }

    // Check if validation already exists
    void fetchExisting(scriptId);

    // Subscribe to new inserts
    const supabase = createSupabaseBrowser();
    const channel = supabase
      .channel(`hook-validation-${scriptId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "hook_validations",
          filter: `script_id=eq.${scriptId}`,
        },
        (payload: RealtimePayload) => {
          const { quality, reasoning } = payload.new;
          if (quality !== "pending") {
            setValidation({ quality, reasoning });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scriptId, fetchExisting]);

  return validation;
}

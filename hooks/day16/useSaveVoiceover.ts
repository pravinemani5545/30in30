"use client";

import { useState, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import type { Voiceover } from "@/types/day16";

interface UseSaveVoiceoverReturn {
  isSaving: boolean;
  savedVoiceover: Voiceover | null;
  error: string | null;
  save: (params: SaveParams) => Promise<Voiceover | null>;
}

interface SaveParams {
  blob: Blob;
  textContent: string;
  voiceId: string;
  voiceName: string | null;
  speed: number;
  stability: number;
  durationSeconds: number | null;
  estimatedCost: number;
  scriptId: string | null;
  generationMs: number | null;
}

export function useSaveVoiceover(): UseSaveVoiceoverReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [savedVoiceover, setSavedVoiceover] = useState<Voiceover | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (params: SaveParams): Promise<Voiceover | null> => {
      setIsSaving(true);
      setError(null);

      try {
        const supabase = createSupabaseBrowser();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        // Generate a unique ID for the file
        const voiceoverId = crypto.randomUUID();
        const storagePath = `${user.id}/${voiceoverId}.mp3`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("voiceovers")
          .upload(storagePath, params.blob, {
            contentType: "audio/mpeg",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Save record via API (single INSERT — ISSUE 3)
        const response = await fetch("/api/day16/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            textContent: params.textContent,
            characterCount: params.textContent.length,
            voiceId: params.voiceId,
            voiceName: params.voiceName,
            speed: params.speed,
            stability: params.stability,
            fileSizeBytes: params.blob.size,
            durationSeconds: params.durationSeconds,
            estimatedCost: params.estimatedCost,
            storagePath,
            scriptId: params.scriptId,
            generationMs: params.generationMs,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error ?? "Failed to save voiceover");
        }

        const data = await response.json();
        setSavedVoiceover(data.voiceover);
        return data.voiceover;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to save";
        setError(message);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  return { isSaving, savedVoiceover, error, save };
}

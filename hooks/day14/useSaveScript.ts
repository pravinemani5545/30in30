"use client";

import { useState, useCallback } from "react";
import type { ScriptSection } from "@/types/day14";

interface UseSaveScriptReturn {
  saveScript: (payload: SavePayload) => Promise<string | null>;
  isSaving: boolean;
  savedScriptId: string | null;
  error: string | null;
}

interface SavePayload {
  topic: string;
  targetDuration: number;
  targetWordCount: number;
  actualWordCount: number;
  scriptContent: string;
  sections: ScriptSection[];
  generationMs?: number;
}

export function useSaveScript(): UseSaveScriptReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [savedScriptId, setSavedScriptId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveScript = useCallback(async (payload: SavePayload) => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/day14/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Save failed" }));
        setError(data.error ?? "Save failed");
        return null;
      }

      const data = await res.json();
      setSavedScriptId(data.scriptId);
      return data.scriptId as string;
    } catch {
      setError("Failed to save script");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { saveScript, isSaving, savedScriptId, error };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface UseScriptPrefillReturn {
  prefillText: string | null;
  scriptTitle: string | null;
  scriptId: string | null;
  isFromScript: boolean;
  isLoading: boolean;
  clearScript: () => void;
}

export function useScriptPrefill(): UseScriptPrefillReturn {
  const searchParams = useSearchParams();
  const [prefillText, setPrefillText] = useState<string | null>(null);
  const [scriptTitle, setScriptTitle] = useState<string | null>(null);
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const paramScriptId = searchParams.get("scriptId");

  useEffect(() => {
    if (!paramScriptId) return;

    let cancelled = false;
    setIsLoading(true);

    async function fetchScript() {
      try {
        const response = await fetch(`/api/day14/scripts/${paramScriptId}`);
        if (!response.ok) return;

        const data = await response.json();
        if (cancelled) return;

        if (data.script) {
          setPrefillText(data.script.script_content ?? "");
          setScriptTitle(data.script.topic ?? "Untitled Script");
          setScriptId(paramScriptId);
        }
      } catch {
        // Silent fail — script prefill is optional
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchScript();
    return () => {
      cancelled = true;
    };
  }, [paramScriptId]);

  const clearScript = useCallback(() => {
    setScriptId(null);
    setScriptTitle(null);
    // Note: do NOT clear prefillText — text stays in textarea after banner dismiss
  }, []);

  return {
    prefillText,
    scriptTitle,
    scriptId,
    isFromScript: scriptId !== null,
    isLoading,
    clearScript,
  };
}

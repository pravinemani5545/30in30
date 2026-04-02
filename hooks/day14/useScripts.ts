"use client";

import { useState, useEffect, useCallback } from "react";
import type { ScriptSummary, Script, HookValidation } from "@/types/day14";

export function useScripts() {
  const [scripts, setScripts] = useState<ScriptSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/day14/scripts");
      if (res.ok) {
        const data = await res.json();
        setScripts(data.scripts ?? []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { scripts, loading, refresh };
}

export function useScript(id: string | null) {
  const [script, setScript] = useState<Script | null>(null);
  const [hookValidation, setHookValidation] = useState<HookValidation | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setScript(null);
      setHookValidation(null);
      return;
    }

    setLoading(true);
    fetch(`/api/day14/scripts/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setScript(data.script);
          setHookValidation(data.hookValidation ?? null);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { script, hookValidation, loading };
}

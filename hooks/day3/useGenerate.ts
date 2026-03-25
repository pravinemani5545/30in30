"use client";

import { useState, useCallback } from "react";
import type { GenerateResponse } from "@/types/day3";
import { toast } from "sonner";

export type GenerationStep = "idle" | "fetching" | "reading" | "crafting" | "done" | "error";

export function useGenerate() {
  const [step, setStep] = useState<GenerationStep>("idle");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (url: string, pastedContent?: string) => {
    setStep("fetching");
    setError(null);
    setResult(null);

    // Simulate step progression while Claude works
    const readingTimer = setTimeout(() => setStep("reading"), 2000);
    const craftingTimer = setTimeout(() => setStep("crafting"), 5000);

    try {
      const res = await fetch("/api/day3/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, ...(pastedContent ? { pastedContent } : {}) }),
      });

      const data = await res.json() as GenerateResponse | { error: string };

      if (!res.ok || "error" in data) {
        const msg = "error" in data ? data.error : "Something went wrong";
        setError(msg);
        setStep("error");
        toast.error(msg);
        return null;
      }

      setResult(data);
      setStep("done");
      return data;
    } catch {
      const msg = "Network error. Please check your connection.";
      setError(msg);
      setStep("error");
      toast.error(msg);
      return null;
    } finally {
      clearTimeout(readingTimer);
      clearTimeout(craftingTimer);
    }
  }, []);

  const reset = useCallback(() => {
    setStep("idle");
    setResult(null);
    setError(null);
  }, []);

  const fetchBlocked = error?.includes("login or block") ?? false;

  return { step, result, error, generate, reset, fetchBlocked };
}

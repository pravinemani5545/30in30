"use client";

import { useState, useEffect, useRef } from "react";
import { detectLanguage } from "@/lib/day10/language/detect";

export function useLanguageDetect(code: string) {
  const [language, setLanguage] = useState<string>("Unknown");
  const [confidence, setConfidence] = useState<"high" | "low">("low");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);

    if (!code.trim()) {
      setLanguage("Unknown");
      setConfidence("low");
      return;
    }

    timerRef.current = setTimeout(() => {
      const result = detectLanguage(code);
      setLanguage(result.language);
      setConfidence(result.confidence);
    }, 500);

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [code]);

  return { language, confidence };
}

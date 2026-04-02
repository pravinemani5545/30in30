"use client";

import { useCompletion } from "@ai-sdk/react";
import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { parseStreamingScript, countWords } from "@/lib/day14/script/parser";
import { calcTargetWordCount } from "@/lib/day14/script/structure";
import type { ScriptSection } from "@/types/day14";

interface UseScriptGenerationReturn {
  sections: ScriptSection[];
  isStreaming: boolean;
  error: string | null;
  wordCount: number;
  completion: string;
  generationMs: number;
  generate: (topic: string, targetDuration: number) => Promise<void>;
  reset: () => void;
}

export function useScriptGeneration(): UseScriptGenerationReturn {
  const startTimeRef = useRef<number | null>(null);
  const [generationMs, setGenerationMs] = useState(0);

  const {
    completion,
    complete,
    isLoading: isStreaming,
    error: sdkError,
    setCompletion,
  } = useCompletion({
    api: "/api/day14/generate-script",
    streamProtocol: "text",
  });

  const sections = useMemo(
    () => parseStreamingScript(completion),
    [completion],
  );

  const wordCount = useMemo(() => countWords(completion), [completion]);

  // Track generation time
  useEffect(() => {
    if (!isStreaming && startTimeRef.current) {
      setGenerationMs(Date.now() - startTimeRef.current);
      startTimeRef.current = null;
    }
  }, [isStreaming]);

  const generate = useCallback(
    async (topic: string, targetDuration: number) => {
      startTimeRef.current = Date.now();
      setGenerationMs(0);
      const targetWordCount = calcTargetWordCount(targetDuration);
      await complete("", {
        body: { topic, targetDuration, targetWordCount },
      });
    },
    [complete],
  );

  const reset = useCallback(() => {
    setCompletion("");
    setGenerationMs(0);
  }, [setCompletion]);

  const error = sdkError ? sdkError.message : null;

  return {
    sections,
    isStreaming,
    error,
    wordCount,
    completion,
    generationMs,
    generate,
    reset,
  };
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface TerminalLine {
  text: string;
  highlight?: string; // "[DONE]" or progress bar chars
}

const SEQUENCE: { delay: number; line: TerminalLine }[] = [
  { delay: 0, line: { text: "> parsing source content..." } },
  {
    delay: 800,
    line: { text: "> parsing source content... [DONE]", highlight: "[DONE]" },
  },
  { delay: 1000, line: { text: "> building voice profile..." } },
  {
    delay: 1600,
    line: {
      text: "> building voice profile... [DONE]",
      highlight: "[DONE]",
    },
  },
  { delay: 1800, line: { text: "> initialising gemini-2.5-flash..." } },
  {
    delay: 2200,
    line: {
      text: "> initialising gemini-2.5-flash... [DONE]",
      highlight: "[DONE]",
    },
  },
  { delay: 2400, line: { text: "> generating summary_card..." } },
  {
    delay: 3500,
    line: {
      text: "> generating summary_card... [DONE]",
      highlight: "[DONE]",
    },
  },
  { delay: 3700, line: { text: "> generating x_thread..." } },
  {
    delay: 5200,
    line: { text: "> generating x_thread... [DONE]", highlight: "[DONE]" },
  },
  { delay: 5400, line: { text: "> generating standalone_tweets..." } },
  {
    delay: 6200,
    line: {
      text: "> generating standalone_tweets... [DONE]",
      highlight: "[DONE]",
    },
  },
  { delay: 6400, line: { text: "> generating youtube_description..." } },
  {
    delay: 7200,
    line: {
      text: "> generating youtube_description... [DONE]",
      highlight: "[DONE]",
    },
  },
  { delay: 7400, line: { text: "> generating newsletter_section..." } },
  {
    delay: 7900,
    line: {
      text: "> generating newsletter_section... [DONE]",
      highlight: "[DONE]",
    },
  },
  { delay: 8100, line: { text: "> generating linkedin_post..." } },
  {
    delay: 8500,
    line: {
      text: "> generating linkedin_post... [DONE]",
      highlight: "[DONE]",
    },
  },
  { delay: 8700, line: { text: "> generating tiktok_captions..." } },
  {
    delay: 9200,
    line: {
      text: "> generating tiktok_captions... [DONE]",
      highlight: "[DONE]",
    },
  },
  {
    delay: 9500,
    line: {
      text: "> pipeline complete. [7/7]",
      highlight: "[7/7]",
    },
  },
];

export function useLoadingTerminal(active: boolean) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const start = useCallback(() => {
    setLines([]);
    setIsComplete(false);

    // Clear any existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    // Only show latest version of each step (replace in-progress with done)
    const allTimers = SEQUENCE.map(({ delay, line }) => {
      const timer = setTimeout(() => {
        setLines((prev) => {
          // If this is a DONE version, replace the in-progress line
          if (line.highlight === "[DONE]") {
            const baseText = line.text.replace(/\s*\[DONE\]$/, "");
            const filtered = prev.filter((l) => !l.text.startsWith(baseText));
            return [...filtered, line];
          }
          return [...prev, line];
        });
      }, delay);
      return timer;
    });

    timersRef.current = allTimers;

    // Mark complete after last item
    const lastDelay = SEQUENCE[SEQUENCE.length - 1].delay;
    const completeTimer = setTimeout(() => {
      setIsComplete(true);
    }, lastDelay + 500);
    timersRef.current.push(completeTimer);
  }, []);

  const reset = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setLines([]);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    if (active) {
      start();
    } else {
      reset();
    }
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [active, start, reset]);

  return { lines, isComplete };
}

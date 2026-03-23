"use client";

import { useEffect, useRef } from "react";
import { scoreColor } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  verdict: string;
}

export function ScoreDisplay({ score, verdict }: ScoreDisplayProps) {
  const scoreRef = useRef<HTMLSpanElement>(null);
  const color = scoreColor(score);

  useEffect(() => {
    const el = scoreRef.current;
    if (!el) return;

    let frame: number;
    const duration = 1200;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);
      if (el) el.textContent = String(current);
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <span
        ref={scoreRef}
        className="font-[family-name:var(--font-mono)] text-7xl font-bold leading-none"
        style={{ color }}
      >
        0
      </span>
      <div className="flex items-center gap-2">
        <span
          className="font-[family-name:var(--font-mono)] text-xs"
          style={{ color }}
        >
          / 100
        </span>
      </div>
      <p className="font-[family-name:var(--font-mono)] text-sm text-text-secondary text-center max-w-xs">
        {verdict}
      </p>
    </div>
  );
}

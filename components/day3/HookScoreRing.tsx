"use client";

import { useEffect, useState } from "react";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getScoreColor(score: number): string {
  if (score >= 9) return "var(--hook-excellent)";
  if (score >= 7) return "var(--hook-strong)";
  if (score >= 5) return "var(--hook-good)";
  return "var(--hook-weak)";
}

export function HookScoreRing({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 50);
    return () => clearTimeout(timeout);
  }, [score]);

  const dashOffset = CIRCUMFERENCE * (1 - animatedScore / 10);
  const color = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: 48, height: 48 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        {/* Background track */}
        <circle
          cx="24" cy="24" r={RADIUS}
          stroke="var(--border)"
          strokeWidth="3"
          fill="none"
        />
        {/* Score arc */}
        <circle
          cx="24" cy="24" r={RADIUS}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 24 24)"
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
      </svg>
      <span
        className="absolute text-sm font-medium"
        style={{ color, fontFamily: "var(--font-mono)" }}
      >
        {score}
      </span>
    </div>
  );
}

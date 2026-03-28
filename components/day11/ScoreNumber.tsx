"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

interface ScoreNumberProps {
  score: number;
  animate: boolean;
}

function getScoreColor(score: number): string {
  if (score < 60) return "#EF4444";
  if (score < 70) return "#F97316";
  if (score < 80) return "#E8A020";
  return "#22C55E";
}

export function ScoreNumber({ score, animate: shouldAnimate }: ScoreNumberProps) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(shouldAnimate ? 0 : score);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplay(score);
      return;
    }

    motionValue.set(0);
    setDisplay(0);

    const controls = animate(motionValue, score, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });

    return () => controls.stop();
  }, [score, shouldAnimate, motionValue]);

  return (
    <div className="flex items-baseline justify-center gap-2">
      <motion.span
        className="font-sans font-bold leading-none"
        style={{
          fontSize: "80px",
          color: getScoreColor(display),
        }}
      >
        {display}
      </motion.span>
      <span
        className="font-serif italic"
        style={{ fontSize: "18px", color: "var(--text-secondary)" }}
      >
        / 100
      </span>
    </div>
  );
}

"use client";

import { ScoreNumber } from "./ScoreNumber";
import { ThresholdLine } from "./ThresholdLine";
import { VerdictLabel } from "./VerdictLabel";
import { CAMPAIGN_LAUNCH_THRESHOLD } from "@/lib/day11/scoring/rubric";

interface ScoreDisplayProps {
  score: number;
  animate: boolean;
}

export function ScoreDisplay({ score, animate }: ScoreDisplayProps) {
  const belowThreshold = score < CAMPAIGN_LAUNCH_THRESHOLD;

  return (
    <div className="flex flex-col items-center py-6">
      {belowThreshold && <ThresholdLine score={score} />}
      <ScoreNumber score={score} animate={animate} />
      {!belowThreshold && <ThresholdLine score={score} />}
      <VerdictLabel score={score} />
    </div>
  );
}

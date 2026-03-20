import { getRelevanceLevel, getScoreLabel } from "@/types";

interface RelevanceScoreBadgeProps {
  score: number;
}

const colorMap = {
  high: { bg: "bg-score-high/15", text: "text-score-high" },
  mid: { bg: "bg-score-mid/15", text: "text-score-mid" },
  low: { bg: "bg-score-low/15", text: "text-score-low" },
};

export default function RelevanceScoreBadge({ score }: RelevanceScoreBadgeProps) {
  const level = getRelevanceLevel(score);
  const colors = colorMap[level];

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {getScoreLabel(level)} ({score}/10)
    </span>
  );
}

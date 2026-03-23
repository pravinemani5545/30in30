import { scoreColor } from "@/lib/utils";

interface CritiqueBlockProps {
  critique: string;
  score: number;
}

export function CritiqueBlock({ critique, score }: CritiqueBlockProps) {
  const color = scoreColor(score);

  return (
    <div
      className="border-l-2 pl-4 py-2"
      style={{ borderColor: color }}
    >
      <p className="font-[family-name:var(--font-mono)] text-sm text-text-secondary leading-relaxed">
        {critique}
      </p>
    </div>
  );
}

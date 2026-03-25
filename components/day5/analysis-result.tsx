"use client";

import type { PitchAnalysis } from "@/types/day5";
import { ScoreDisplay } from "./score-display";
import { DimensionBars } from "./dimension-bars";
import { CritiqueBlock } from "./critique-block";
import { RewriteCard } from "./rewrite-card";

interface AnalysisResultProps {
  analysis: PitchAnalysis;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="space-y-10 w-full max-w-xl mx-auto">
      {/* Score */}
      <div className="fade-in-up" style={{ animationDelay: "0ms" }}>
        <ScoreDisplay score={analysis.score} verdict={analysis.verdict} />
      </div>

      {/* Dimension bars */}
      <div className="fade-in-up" style={{ animationDelay: "150ms" }}>
        <DimensionBars
          scores={analysis.dimension_scores}
          totalScore={analysis.score}
        />
      </div>

      {/* Critique */}
      <div className="fade-in-up" style={{ animationDelay: "300ms" }}>
        <h3 className="font-[family-name:var(--font-mono)] text-sm text-text-muted mb-3 uppercase tracking-wider">
          Critique
        </h3>
        <CritiqueBlock critique={analysis.critique} score={analysis.score} />
      </div>

      {/* Rewrites */}
      <div className="fade-in-up" style={{ animationDelay: "450ms" }}>
        <h3 className="font-[family-name:var(--font-mono)] text-sm text-text-muted mb-3 uppercase tracking-wider">
          Improved Versions
        </h3>
        <div className="space-y-3">
          {analysis.improvements.map((imp, i) => (
            <RewriteCard key={i} improvement={imp} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

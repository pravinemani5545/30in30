import type { SummarizedStory } from "@/types";
import RelevanceScoreBadge from "./RelevanceScoreBadge";
import { ExternalLink } from "lucide-react";

interface StoryCardProps {
  story: SummarizedStory;
  rank: number;
}

export default function StoryCard({ story, rank }: StoryCardProps) {
  return (
    <div className="space-y-2 py-4 first:pt-0">
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs text-text-tertiary pt-0.5 shrink-0">
          {String(rank).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start gap-2">
            <a
              href={story.hnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-text-primary hover:text-amber transition-colors leading-snug"
            >
              {story.title}
              <ExternalLink className="ml-1 inline-block h-3 w-3 text-text-tertiary" />
            </a>
          </div>
          {story.domain && (
            <p className="font-mono text-xs text-text-secondary">
              {story.domain}
            </p>
          )}
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-tertiary">
              {story.score} pts · {story.descendants} comments
            </span>
            <RelevanceScoreBadge score={story.relevanceScore} />
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {story.summary}
          </p>
        </div>
      </div>
    </div>
  );
}

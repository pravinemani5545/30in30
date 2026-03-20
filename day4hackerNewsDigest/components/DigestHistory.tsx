"use client";

import { useState } from "react";
import type { DigestRun } from "@/types";
import StatusBadge from "./StatusBadge";
import StoryCard from "./StoryCard";
import { ChevronDown, ChevronRight, Clock } from "lucide-react";

interface DigestHistoryProps {
  runs: DigestRun[];
}

export default function DigestHistory({ runs }: DigestHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (runs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <p className="text-sm text-text-secondary">No digest history yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface divide-y divide-border">
      {runs.map((run) => {
        const isExpanded = expandedId === run.id;
        const date = new Date(run.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const time = new Date(run.created_at).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });

        return (
          <div key={run.id}>
            <button
              onClick={() => setExpandedId(isExpanded ? null : run.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface-raised transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" />
                )}
                <div>
                  <span className="text-sm text-text-primary">{date}</span>
                  <span className="text-xs text-text-tertiary ml-2">{time}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={run.status} />
                <span className="text-xs text-text-tertiary">
                  {run.sent_count}/{run.subscriber_count} sent
                </span>
                {run.generation_ms && (
                  <span className="text-xs text-text-tertiary flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {(run.generation_ms / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
            </button>
            {isExpanded && run.stories_json && (
              <div className="px-4 pb-4 border-t border-border">
                <div className="divide-y divide-border">
                  {run.stories_json.map((story, i) => (
                    <StoryCard key={story.id} story={story} rank={i + 1} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

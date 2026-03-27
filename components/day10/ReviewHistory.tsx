"use client";

import { Clock, Trash2 } from "lucide-react";
import type { CodeReviewSummary, FindingSeverity } from "@/types/day10";
import { useDeleteReview } from "@/hooks/day10/useDeleteReview";

interface ReviewHistoryProps {
  reviews: CodeReviewSummary[];
  isLoading: boolean;
  onSelect: (id: string) => void;
  selectedId?: string;
  onDeleted: () => void;
}

const SEVERITY_COLORS: Record<FindingSeverity, string> = {
  critical: "var(--severity-critical-text)",
  high: "var(--severity-high-text)",
  medium: "var(--severity-medium-text)",
  low: "var(--severity-low-text)",
};

function HistoryItem({
  review,
  isSelected,
  onSelect,
  onDeleted,
}: {
  review: CodeReviewSummary;
  isSelected: boolean;
  onSelect: () => void;
  onDeleted: () => void;
}) {
  const { deleteReview, isDeleting } = useDeleteReview(onDeleted);

  const counts = [
    { severity: "critical" as const, count: review.critical_count },
    { severity: "high" as const, count: review.high_count },
    { severity: "medium" as const, count: review.medium_count },
    { severity: "low" as const, count: review.low_count },
  ].filter((c) => c.count > 0);

  return (
    <div
      className="flex items-start justify-between p-3 cursor-pointer transition-colors group"
      style={{
        background: isSelected ? "var(--surface-raised)" : "transparent",
        borderRadius: 4,
      }}
      onClick={onSelect}
    >
      <div className="min-w-0 flex-1">
        <p
          className="text-[13px] font-medium truncate"
          style={{ color: "var(--foreground)" }}
        >
          {review.confirmed_language ?? review.detected_language}
        </p>
        <div className="flex gap-2 mt-1">
          {counts.map(({ severity, count }) => (
            <span
              key={severity}
              className="text-[11px] font-medium"
              style={{ color: SEVERITY_COLORS[severity] }}
            >
              {count}
              {severity[0].toUpperCase()}
            </span>
          ))}
        </div>
        <p
          className="text-[11px] mt-1"
          style={{ color: "var(--text-tertiary)" }}
        >
          {new Date(review.created_at).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteReview(review.id);
        }}
        disabled={isDeleting}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
        style={{ color: "var(--text-tertiary)" }}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ReviewHistory({
  reviews,
  isLoading,
  onSelect,
  selectedId,
  onDeleted,
}: ReviewHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 skeleton-pulse"
            style={{ background: "var(--surface-raised)", borderRadius: 4 }}
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 px-4">
        <Clock className="w-5 h-5" style={{ color: "var(--text-tertiary)" }} />
        <p
          className="text-[13px] text-center"
          style={{ color: "var(--text-tertiary)" }}
        >
          No reviews yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {reviews.map((review) => (
        <HistoryItem
          key={review.id}
          review={review}
          isSelected={selectedId === review.id}
          onSelect={() => onSelect(review.id)}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
}

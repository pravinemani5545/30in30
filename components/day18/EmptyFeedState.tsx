import { CheckCircle } from "lucide-react";

interface EmptyFeedStateProps {
  days: number;
}

export function EmptyFeedState({ days }: EmptyFeedStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CheckCircle
        size={32}
        className="mb-3"
        style={{ color: "var(--text-tertiary)" }}
      />
      <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
        No changes detected in the last {days} days
      </p>
      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
        Your watchlist is quiet — that&apos;s a good thing.
      </p>
    </div>
  );
}

import { scoreColor } from "@/lib/utils";

interface HistoryItem {
  id: string;
  original_pitch: string;
  score: number;
  verdict: string;
  created_at: string;
}

interface HistoryListProps {
  items: HistoryItem[];
}

export function HistoryList({ items }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-2">
        <p className="text-text-secondary text-sm">No analyses yet</p>
        <p className="text-text-muted text-xs">
          <a href="/" className="text-accent hover:text-accent-hover transition-colors">
            Analyze a pitch
          </a>{" "}
          to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const color = scoreColor(item.score);
        const date = new Date(item.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={item.id}
            className="bg-surface border border-border rounded-lg p-4 flex items-center gap-4"
          >
            <span
              className="font-[family-name:var(--font-mono)] text-2xl font-bold shrink-0 w-12 text-center"
              style={{ color }}
            >
              {item.score}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm truncate">
                {item.original_pitch}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted mt-0.5">
                {item.verdict}
              </p>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-xs text-text-muted shrink-0">
              {date}
            </span>
          </div>
        );
      })}
    </div>
  );
}

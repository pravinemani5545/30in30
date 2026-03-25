function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>{value}/10</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--surface-raised)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(value / 10) * 100}%`,
            background: "var(--accent)",
          }}
        />
      </div>
    </div>
  );
}

export function EngagementBars({
  retweet,
  reply,
  saves,
}: {
  retweet: number;
  reply: number;
  saves: number;
}) {
  return (
    <div className="space-y-2">
      <MetricBar label="Retweet potential" value={retweet} />
      <MetricBar label="Reply bait" value={reply} />
      <MetricBar label="Saves potential" value={saves} />
    </div>
  );
}

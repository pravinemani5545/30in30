export function SkeletonEnrichment() {
  return (
    <div className="space-y-4">
      {/* Person card skeleton */}
      <div
        className="skeleton-pulse"
        style={{
          padding: "16px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--surface-raised)",
              flexShrink: 0,
            }}
          />
          <div className="flex-1 space-y-2">
            <div style={{ height: 20, width: "60%", background: "var(--surface-raised)", borderRadius: 4 }} />
            <div style={{ height: 14, width: "80%", background: "var(--surface-raised)", borderRadius: 4 }} />
            <div style={{ height: 12, width: "40%", background: "var(--surface-raised)", borderRadius: 4 }} />
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div style={{ height: 12, width: "30%", background: "var(--surface-raised)", borderRadius: 4 }} />
          <div style={{ height: 13, width: "100%", background: "var(--surface-raised)", borderRadius: 4 }} />
          <div style={{ height: 13, width: "90%", background: "var(--surface-raised)", borderRadius: 4 }} />
          <div style={{ height: 13, width: "70%", background: "var(--surface-raised)", borderRadius: 4 }} />
        </div>
      </div>

      {/* Company card skeleton */}
      <div
        className="skeleton-pulse"
        style={{
          padding: "16px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div style={{ width: 36, height: 36, borderRadius: 6, background: "var(--surface-raised)", flexShrink: 0 }} />
          <div className="flex-1 space-y-2">
            <div style={{ height: 16, width: "50%", background: "var(--surface-raised)", borderRadius: 4 }} />
            <div style={{ height: 12, width: "70%", background: "var(--surface-raised)", borderRadius: 4 }} />
          </div>
        </div>
        <div className="space-y-2">
          <div style={{ height: 13, width: "100%", background: "var(--surface-raised)", borderRadius: 4 }} />
          <div style={{ height: 13, width: "85%", background: "var(--surface-raised)", borderRadius: 4 }} />
        </div>
      </div>

      {/* Follow-up skeletons */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="skeleton-pulse"
          style={{
            padding: "14px 16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <div style={{ height: 16, width: "15%", background: "var(--surface-raised)", borderRadius: 99, marginBottom: 10 }} />
          <div className="space-y-2">
            <div style={{ height: 13, width: "100%", background: "var(--surface-raised)", borderRadius: 4 }} />
            <div style={{ height: 13, width: "75%", background: "var(--surface-raised)", borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

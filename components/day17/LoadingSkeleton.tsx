"use client";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Grade badge skeleton */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="rounded-full skeleton-pulse"
          style={{
            width: 120,
            height: 120,
            background: "var(--surface-raised)",
          }}
        />
        <div
          className="h-4 w-16 rounded skeleton-pulse"
          style={{ background: "var(--surface-raised)" }}
        />
        <div
          className="h-4 w-28 rounded skeleton-pulse"
          style={{ background: "var(--surface-raised)" }}
        />
      </div>

      {/* Check card skeletons */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-md border skeleton-pulse"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              borderLeftWidth: 3,
              borderLeftColor: "var(--accent)",
              height: 100,
            }}
          />
        ))}
      </div>
    </div>
  );
}

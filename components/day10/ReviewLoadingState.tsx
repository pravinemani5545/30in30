"use client";

export function ReviewLoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: "var(--accent)",
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p
        className="text-[13px]"
        style={{ color: "var(--text-secondary)" }}
      >
        Reviewing as production code...
      </p>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

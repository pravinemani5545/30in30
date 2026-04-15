"use client";

interface ScriptSummaryBarProps {
  totalDuration: string;
  wordCount: number;
  conceptCount: number;
}

export function ScriptSummaryBar({
  totalDuration,
  wordCount,
  conceptCount,
}: ScriptSummaryBarProps) {
  const stats = [
    { label: "DURATION", value: totalDuration },
    { label: "WORDS", value: wordCount.toLocaleString() },
    { label: "CONCEPTS", value: conceptCount.toString() },
  ];

  return (
    <div
      className="flex items-center gap-6 px-5 py-4"
      style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
      }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "var(--font-day22-mono)",
              fontSize: "10px",
              letterSpacing: "2px",
              color: "#555",
              textTransform: "uppercase",
            }}
          >
            {stat.label}
          </span>
          <span
            style={{
              fontFamily: "var(--font-day22-mono)",
              fontSize: "14px",
              fontWeight: 700,
              color: "#00FF41",
            }}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

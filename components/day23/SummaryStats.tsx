"use client";

import type { FunnelData } from "@/types/day23";

interface SummaryStatsProps {
  funnel: FunnelData[];
}

export function SummaryStats({ funnel }: SummaryStatsProps) {
  const sent = funnel.find((f) => f.stage === "Sent");
  const opened = funnel.find((f) => f.stage === "Opened");
  const clicked = funnel.find((f) => f.stage === "Clicked");
  const converted = funnel.find((f) => f.stage === "Converted");

  const stats = [
    { label: "Total Sent", value: sent?.count.toLocaleString() ?? "0" },
    { label: "Open Rate", value: `${opened?.rate ?? 0}%` },
    { label: "Click Rate", value: `${clicked?.rate ?? 0}%` },
    { label: "Conversion Rate", value: `${converted?.rate ?? 0}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3" style={{ maxWidth: "100%" }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-4"
          style={{
            background: "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-day23-mono)",
              fontSize: "28px",
              fontWeight: 700,
              color: "#00FF41",
              lineHeight: 1.2,
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              fontFamily: "var(--font-day23-mono)",
              fontSize: "11px",
              color: "#999999",
              marginTop: "4px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

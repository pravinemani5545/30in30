"use client";

import dynamic from "next/dynamic";
import type { FunnelData } from "@/types/day23";

const FunnelChartInner = dynamic(() => import("./FunnelChartInner"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center"
      style={{
        height: "280px",
        fontFamily: "var(--font-day23-mono)",
        fontSize: "13px",
        color: "#555555",
      }}
    >
      {">"} loading chart...
    </div>
  ),
});

interface FunnelChartProps {
  data: FunnelData[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <div
      className="p-4"
      style={{
        background: "#111111",
        border: "1px solid #2a2a2a",
        borderRadius: 0,
      }}
    >
      <span
        className="block mb-3"
        style={{
          fontFamily: "var(--font-day23-mono)",
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#00FF41",
          opacity: 0.75,
        }}
      >
        CONVERSION FUNNEL
      </span>
      <FunnelChartInner data={data} />
    </div>
  );
}

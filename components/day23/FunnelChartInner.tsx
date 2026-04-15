"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import type { FunnelData } from "@/types/day23";

interface FunnelChartInnerProps {
  data: FunnelData[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload: FunnelData }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div
      className="px-3 py-2"
      style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
        borderRadius: 0,
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      <div style={{ color: "#999999", marginBottom: "2px" }}>{label}</div>
      <div style={{ color: "#00FF41" }}>
        {item.count.toLocaleString()} ({item.rate}%)
      </div>
    </div>
  );
}

export default function FunnelChartInner({ data }: FunnelChartInnerProps) {
  // Shade the bars with decreasing opacity for funnel effect
  const opacities = [1, 0.85, 0.7, 0.55, 0.4];

  return (
    <div style={{ width: "100%", height: "280px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 40, bottom: 8, left: 8 }}
        >
          <XAxis
            type="number"
            tick={{
              fontSize: 11,
              fill: "#555555",
              fontFamily: "monospace",
            }}
            tickLine={false}
            axisLine={{ stroke: "#2a2a2a" }}
          />
          <YAxis
            type="category"
            dataKey="stage"
            tick={{
              fontSize: 12,
              fill: "#999999",
              fontFamily: "monospace",
            }}
            tickLine={false}
            axisLine={{ stroke: "#2a2a2a" }}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#00FF41" barSize={28}>
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="#00FF41"
                fillOpacity={opacities[index] ?? 0.4}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

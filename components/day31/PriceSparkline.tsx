"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
} from "recharts";
import type { PriceHistoryEntry } from "@/types/day31";

interface PriceSparklineProps {
  history: PriceHistoryEntry[];
  targetPrice: number;
}

export function PriceSparkline({ history, targetPrice }: PriceSparklineProps) {
  // Reverse to chronological order and filter to success entries for the line
  const chronological = [...history].reverse();

  const data = chronological.map((entry) => ({
    time: new Date(entry.checked_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: entry.result === "success" ? entry.price : null,
    failed: entry.result !== "success",
  }));

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          height: "200px",
          fontFamily: "var(--font-day31-mono)",
          fontSize: "12px",
          color: "#555",
        }}
      >
        No price history yet
      </div>
    );
  }

  return (
    <div style={{ height: "200px", width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "#555", fontFamily: "monospace" }}
            tickLine={false}
            axisLine={{ stroke: "#2a2a2a" }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#555", fontFamily: "monospace" }}
            tickLine={false}
            axisLine={{ stroke: "#2a2a2a" }}
            domain={["auto", "auto"]}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#161616",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
              fontFamily: "monospace",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#555" }}
            itemStyle={{ color: "#00FF41" }}
          />
          <ReferenceLine
            y={targetPrice}
            stroke="#00FF41"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{
              value: `target $${targetPrice}`,
              position: "right",
              fill: "#00FF41",
              fontSize: 10,
              fontFamily: "monospace",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#00FF41"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (payload.failed) {
                return (
                  <text
                    key={`dot-${cx}-${cy}`}
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#555"
                    fontSize={10}
                  >
                    x
                  </text>
                );
              }
              if (payload.price === null) return <g key={`dot-${cx}-${cy}`} />;
              const color =
                payload.price <= targetPrice ? "#00FF41" : "#ff4444";
              return (
                <circle
                  key={`dot-${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={color}
                  stroke="none"
                />
              );
            }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

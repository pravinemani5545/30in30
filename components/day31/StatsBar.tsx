"use client";

import type { TrackedProduct } from "@/types/day31";

interface StatsBarProps {
  products: TrackedProduct[];
}

export function StatsBar({ products }: StatsBarProps) {
  const tracking = products.length;
  const belowTarget = products.filter((p) => p.is_below_target).length;
  const outOfStock = products.filter(
    (p) => p.availability === "out_of_stock",
  ).length;

  const stats = [
    { label: "TRACKING", value: tracking },
    { label: "BELOW TARGET", value: belowTarget },
    { label: "OUT OF STOCK", value: outOfStock },
  ];

  return (
    <div
      className="grid grid-cols-3 gap-4"
      style={{ padding: "20px 0", borderBottom: "1px solid #2a2a2a" }}
    >
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "20px",
              fontWeight: 700,
              color: "#00FF41",
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "11px",
              letterSpacing: "1px",
              color: "#555",
              marginTop: "4px",
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

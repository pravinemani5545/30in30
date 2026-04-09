"use client";

interface PriceDeltaProps {
  currentPrice: number | null;
  previousPrice: number | null;
}

export function PriceDelta({ currentPrice, previousPrice }: PriceDeltaProps) {
  if (currentPrice === null || previousPrice === null) {
    return (
      <span
        style={{
          fontFamily: "var(--font-day31-mono)",
          fontSize: "12px",
          fontWeight: 600,
          color: "#555",
        }}
      >
        --
      </span>
    );
  }

  const diff = currentPrice - previousPrice;
  if (diff === 0) {
    return (
      <span
        style={{
          fontFamily: "var(--font-day31-mono)",
          fontSize: "12px",
          fontWeight: 600,
          color: "#555",
        }}
      >
        --
      </span>
    );
  }

  const isDown = diff < 0;
  const arrow = isDown ? "\u2193" : "\u2191";
  const color = isDown ? "#00FF41" : "#ff4444";
  const formatted = `${arrow} ${isDown ? "-" : "+"}$${Math.abs(diff).toFixed(2)}`;

  return (
    <span
      style={{
        fontFamily: "var(--font-day31-mono)",
        fontSize: "12px",
        fontWeight: 600,
        color,
      }}
    >
      {formatted}
    </span>
  );
}

"use client";

import { useState } from "react";
import type { TikTokCaptions } from "@/types/day20";

interface TikTokOutputProps {
  data: TikTokCaptions;
}

type TikTokTab = "short" | "medium" | "long";

const TABS: { key: TikTokTab; label: string }[] = [
  { key: "short", label: "SHORT" },
  { key: "medium", label: "MED" },
  { key: "long", label: "LONG" },
];

export function TikTokOutput({ data }: TikTokOutputProps) {
  const [active, setActive] = useState<TikTokTab>("short");

  return (
    <div>
      <div className="flex gap-0 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className="transition-all"
            style={{
              fontFamily: "var(--font-day20-mono)",
              fontSize: "11px",
              letterSpacing: "1px",
              padding: "6px 16px",
              background:
                active === tab.key ? "rgba(0,255,65,0.08)" : "transparent",
              border:
                active === tab.key
                  ? "1px solid rgba(0,255,65,0.2)"
                  : "1px solid #2a2a2a",
              color: active === tab.key ? "#00FF41" : "#555",
              cursor: "pointer",
              borderRadius: 0,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p
        style={{
          fontFamily: "var(--font-day20-body)",
          fontSize: "14px",
          lineHeight: 1.7,
          color: "#999",
          whiteSpace: "pre-wrap",
        }}
      >
        {data[active]}
      </p>
    </div>
  );
}

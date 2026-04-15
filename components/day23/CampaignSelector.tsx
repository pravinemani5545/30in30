"use client";

import { useState } from "react";
import type { Campaign } from "@/types/day23";

interface CampaignSelectorProps {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  onSelect: (campaign: Campaign) => void;
  onCreate: (name: string) => Promise<void>;
}

const STATUS_COLORS: Record<string, string> = {
  active: "#00FF41",
  paused: "#E8A020",
  completed: "#999999",
};

export function CampaignSelector({
  campaigns,
  activeCampaign,
  onSelect,
  onCreate,
}: CampaignSelectorProps) {
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    setCreating(true);
    try {
      const name = `Demo Campaign ${campaigns.length + 1}`;
      await onCreate(name);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div
      className="p-4 space-y-3"
      style={{
        background: "#111111",
        border: "1px solid #2a2a2a",
        borderRadius: 0,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: "var(--font-day23-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          CAMPAIGNS
        </span>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="px-3 py-1.5 transition-all"
          style={{
            fontFamily: "var(--font-day23-mono)",
            fontSize: "11px",
            fontWeight: 700,
            color: creating ? "#555555" : "#000000",
            background: creating ? "#1a1a1a" : "#00FF41",
            border: "1px solid",
            borderColor: creating ? "#2a2a2a" : "#00FF41",
            borderRadius: 0,
            cursor: creating ? "not-allowed" : "pointer",
          }}
        >
          {creating ? "CREATING..." : "+ CREATE DEMO CAMPAIGN"}
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div
          className="py-6 text-center"
          style={{
            fontFamily: "var(--font-day23-mono)",
            fontSize: "13px",
            color: "#555555",
          }}
        >
          {">"} no campaigns yet — create one to get started
        </div>
      ) : (
        <div className="space-y-1">
          {campaigns.map((campaign) => {
            const isActive = activeCampaign?.id === campaign.id;
            return (
              <button
                key={campaign.id}
                onClick={() => onSelect(campaign)}
                className="w-full flex items-center justify-between px-3 py-2 text-left transition-all"
                style={{
                  background: isActive ? "#161616" : "transparent",
                  border: "1px solid",
                  borderColor: isActive ? "#00FF41" : "transparent",
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-day23-mono)",
                    fontSize: "13px",
                    color: isActive ? "#eeeeee" : "#999999",
                  }}
                >
                  {campaign.name}
                </span>
                <span className="flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: "var(--font-day23-mono)",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: STATUS_COLORS[campaign.status] ?? "#999",
                    }}
                  >
                    {campaign.status}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "6px",
                      height: "6px",
                      background: STATUS_COLORS[campaign.status] ?? "#999",
                      borderRadius: 0,
                    }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

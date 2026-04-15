"use client";

import Link from "next/link";
import { useCampaignDashboard } from "@/hooks/day23/useCampaignDashboard";
import { CampaignSelector } from "./CampaignSelector";
import { SummaryStats } from "./SummaryStats";
import { FunnelChart } from "./FunnelChart";
import { ABTestTable } from "./ABTestTable";

export function CampaignDashboardMain() {
  const {
    campaigns,
    activeCampaign,
    analytics,
    loading,
    analyticsLoading,
    createCampaign,
    selectCampaign,
    authenticated,
    error,
  } = useCampaignDashboard();

  // Auth gate
  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p
            style={{
              fontFamily: "var(--font-day23-mono)",
              fontSize: "14px",
              color: "#999",
            }}
          >
            {">"} authentication required
          </p>
          <Link
            href={`/login?redirectTo=${encodeURIComponent("/day23")}`}
            className="inline-block px-6 py-3 transition-all"
            style={{
              fontFamily: "var(--font-day23-mono)",
              fontSize: "14px",
              fontWeight: 700,
              background: "#00FF41",
              color: "#000",
              borderRadius: 0,
            }}
          >
            [ SIGN IN ]
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p
          style={{
            fontFamily: "var(--font-day23-mono)",
            fontSize: "13px",
            color: "#555555",
          }}
        >
          {">"} loading campaigns...
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Error banner */}
      {error && (
        <div
          className="p-3"
          style={{
            fontFamily: "var(--font-day23-mono)",
            fontSize: "13px",
            color: "#ff4444",
            background: "rgba(255,68,68,0.05)",
            border: "1px solid rgba(255,68,68,0.15)",
            borderRadius: 0,
          }}
        >
          {">"} error: {error}
        </div>
      )}

      {/* Campaign selector */}
      <CampaignSelector
        campaigns={campaigns}
        activeCampaign={activeCampaign}
        onSelect={selectCampaign}
        onCreate={createCampaign}
      />

      {/* Analytics sections */}
      {activeCampaign && (
        <>
          {analyticsLoading ? (
            <div
              className="py-12 text-center"
              style={{
                fontFamily: "var(--font-day23-mono)",
                fontSize: "13px",
                color: "#555555",
              }}
            >
              {">"} loading analytics for {activeCampaign.name}...
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Summary stats */}
              <SummaryStats funnel={analytics.funnel} />

              {/* Funnel chart */}
              <FunnelChart data={analytics.funnel} />

              {/* A/B test table */}
              <ABTestTable data={analytics.abTest} />
            </div>
          ) : (
            <div
              className="py-12 text-center"
              style={{
                fontFamily: "var(--font-day23-mono)",
                fontSize: "13px",
                color: "#555555",
              }}
            >
              {">"} no analytics data available
            </div>
          )}
        </>
      )}
    </main>
  );
}

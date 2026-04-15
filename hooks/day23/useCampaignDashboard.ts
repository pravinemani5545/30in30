"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Campaign, CampaignAnalytics } from "@/types/day23";

interface UseCampaignDashboardReturn {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  analytics: CampaignAnalytics | null;
  loading: boolean;
  analyticsLoading: boolean;
  createCampaign: (name: string) => Promise<void>;
  selectCampaign: (campaign: Campaign) => void;
  authenticated: boolean;
  error: string | null;
}

export function useCampaignDashboard(): UseCampaignDashboardReturn {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didAutoSelect = useRef(false);

  // Fetch campaigns — stable callback, no deps on activeCampaign
  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/day23/campaigns");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch campaigns");
        return;
      }
      const list: Campaign[] = data.campaigns ?? [];
      setCampaigns(list);
      // Auto-select first campaign on initial load only
      if (list.length > 0 && !didAutoSelect.current) {
        didAutoSelect.current = true;
        setActiveCampaign(list[0]);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch analytics for active campaign
  const fetchAnalytics = useCallback(async (campaignId: string) => {
    setAnalyticsLoading(true);
    setAnalytics(null);
    try {
      const res = await fetch(`/api/day23/campaigns/${campaignId}/analytics`);
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch analytics");
        return;
      }
      setAnalytics(data.analytics ?? null);
    } catch {
      setError("Failed to load analytics.");
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Create a new campaign with seed data
  async function createCampaign(name: string) {
    setError(null);
    try {
      const res = await fetch("/api/day23/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create campaign");
        return;
      }
      const newCampaign = data.campaign;
      setCampaigns((prev) => [newCampaign, ...prev]);
      setActiveCampaign(newCampaign);
    } catch {
      setError("Network error. Please try again.");
    }
  }

  function selectCampaign(campaign: Campaign) {
    setActiveCampaign(campaign);
  }

  // Load campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Load analytics when active campaign changes
  useEffect(() => {
    if (activeCampaign) {
      fetchAnalytics(activeCampaign.id);
    }
  }, [activeCampaign, fetchAnalytics]);

  return {
    campaigns,
    activeCampaign,
    analytics,
    loading,
    analyticsLoading,
    createCampaign,
    selectCampaign,
    authenticated,
    error,
  };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import type { CompanyChange, ChangeType } from "@/types/day18";

export function useChangeFeed() {
  const [changes, setChanges] = useState<CompanyChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ChangeType | "all">("all");
  const [days, setDays] = useState(7);

  const fetchChanges = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilter !== "all") params.set("type", activeFilter);
      params.set("days", String(days));

      const res = await fetch(`/api/day18/changes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setChanges(data);
      }
    } finally {
      setLoading(false);
    }
  }, [activeFilter, days]);

  useEffect(() => {
    fetchChanges();
  }, [fetchChanges]);

  const generateOutreach = async (
    changeId: string,
  ): Promise<{ outreachAngle?: string; error?: string }> => {
    try {
      const res = await fetch(`/api/day18/changes/${changeId}/outreach`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error ?? "Failed to generate" };
      }
      return { outreachAngle: data.outreachAngle };
    } catch {
      return { error: "Failed to generate outreach angle" };
    }
  };

  return {
    changes,
    loading,
    activeFilter,
    setActiveFilter,
    days,
    setDays,
    refresh: fetchChanges,
    generateOutreach,
  };
}

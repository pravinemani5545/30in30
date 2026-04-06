"use client";

import { useState, useMemo, useCallback } from "react";
import type { PostItem, Platform, EffortLevel } from "@/types/day19";

export function useCalendarFilters(posts: PostItem[]) {
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [effortFilter, setEffortFilter] = useState<EffortLevel | "all">("all");

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (platformFilter !== "all" && p.platform !== platformFilter) return false;
      if (effortFilter !== "all" && p.effortLevel !== effortFilter) return false;
      return true;
    });
  }, [posts, platformFilter, effortFilter]);

  const resetFilters = useCallback(() => {
    setPlatformFilter("all");
    setEffortFilter("all");
  }, []);

  return {
    platformFilter,
    setPlatformFilter,
    effortFilter,
    setEffortFilter,
    filtered,
    resetFilters,
    hasActiveFilter: platformFilter !== "all" || effortFilter !== "all",
  };
}

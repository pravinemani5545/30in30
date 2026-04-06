"use client";

import { useState, useEffect, useCallback } from "react";
import type { TrackedCompany } from "@/types/day18";

export function useCompanies() {
  const [companies, setCompanies] = useState<TrackedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch("/api/day18/companies");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        setAuthenticated(true);
        const data = await res.json();
        setCompanies(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const addCompany = async (url: string): Promise<{ error?: string }> => {
    setAdding(true);
    try {
      const res = await fetch("/api/day18/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error ?? "Failed to add company" };
      }

      setCompanies((prev) => [data, ...prev]);
      return {};
    } finally {
      setAdding(false);
    }
  };

  const removeCompany = async (id: string): Promise<{ error?: string }> => {
    try {
      const res = await fetch(`/api/day18/companies/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        return { error: data.error ?? "Failed to remove" };
      }

      setCompanies((prev) => prev.filter((c) => c.id !== id));
      return {};
    } catch {
      return { error: "Failed to remove company" };
    }
  };

  return {
    companies,
    loading,
    adding,
    authenticated,
    addCompany,
    removeCompany,
    refresh: fetchCompanies,
  };
}

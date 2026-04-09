"use client";

import { useState } from "react";
import type { TrackedProduct } from "@/types/day31";

interface UseCheckNowReturn {
  check: (id: string) => Promise<TrackedProduct | null>;
  loading: boolean;
  error: string | null;
}

export function useCheckNow(): UseCheckNowReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function check(id: string): Promise<TrackedProduct | null> {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/day31/products/${id}/check`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Check failed");
        return null;
      }
      return data.product;
    } catch {
      setError("Network error");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { check, loading, error };
}

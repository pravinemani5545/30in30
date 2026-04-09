"use client";

import { useState, useEffect, useCallback } from "react";
import type { TrackedProduct } from "@/types/day31";

interface UseProductsReturn {
  products: TrackedProduct[];
  loading: boolean;
  error: string | null;
  authenticated: boolean;
  refresh: () => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/day31/products");

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load products");
        return;
      }

      setProducts(data.products);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, loading, error, authenticated, refresh };
}

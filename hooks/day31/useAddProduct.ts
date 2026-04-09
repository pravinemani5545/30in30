"use client";

import { useState } from "react";
import type { AddProductInput, TrackedProduct, PreviewResult } from "@/types/day31";

interface UseAddProductReturn {
  add: (input: AddProductInput) => Promise<TrackedProduct | null>;
  preview: (url: string) => Promise<PreviewResult | null>;
  loading: boolean;
  previewing: boolean;
  error: string | null;
}

export function useAddProduct(): UseAddProductReturn {
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(input: AddProductInput): Promise<TrackedProduct | null> {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/day31/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add product");
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

  async function preview(url: string): Promise<PreviewResult | null> {
    try {
      setPreviewing(true);
      setError(null);
      const res = await fetch(
        `/api/day31/products/preview?url=${encodeURIComponent(url)}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Preview failed");
        return null;
      }
      return data;
    } catch {
      setError("Network error");
      return null;
    } finally {
      setPreviewing(false);
    }
  }

  return { add, preview, loading, previewing, error };
}

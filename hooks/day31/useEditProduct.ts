"use client";

import { useState } from "react";
import type { EditProductInput, TrackedProduct } from "@/types/day31";

interface UseEditProductReturn {
  edit: (id: string, input: EditProductInput) => Promise<TrackedProduct | null>;
  remove: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useEditProduct(): UseEditProductReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function edit(
    id: string,
    input: EditProductInput,
  ): Promise<TrackedProduct | null> {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/day31/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update");
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

  async function remove(id: string): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/day31/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete");
        return false;
      }
      return true;
    } catch {
      setError("Network error");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { edit, remove, loading, error };
}

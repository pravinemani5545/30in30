"use client";

import { useState, useEffect, useCallback } from "react";
import type { Subscription } from "@/types/day25";

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  loading: boolean;
  checkoutLoading: boolean;
  cancelLoading: boolean;
  authenticated: boolean;
  error: string | null;
  checkout: (plan: string) => Promise<boolean>;
  cancel: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/day25/subscription");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch subscription");
        return;
      }
      setSubscription(data.subscription ?? null);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function checkout(plan: string): Promise<boolean> {
    setError(null);
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/day25/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401) {
        setAuthenticated(false);
        return false;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return false;
      }
      setSubscription(data.subscription);
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function cancel(): Promise<boolean> {
    setError(null);
    setCancelLoading(true);
    try {
      const res = await fetch("/api/day25/subscription/cancel", {
        method: "POST",
      });
      if (res.status === 401) {
        setAuthenticated(false);
        return false;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Cancellation failed");
        return false;
      }
      setSubscription(data.subscription);
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    } finally {
      setCancelLoading(false);
    }
  }

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return {
    subscription,
    loading,
    checkoutLoading,
    cancelLoading,
    authenticated,
    error,
    checkout,
    cancel,
    refetch: fetchSubscription,
  };
}

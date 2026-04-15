"use client";

import { useState } from "react";
import Link from "next/link";
import { useSubscription } from "@/hooks/day25/useSubscription";
import { PricingCards } from "./PricingCards";
import { CheckoutModal } from "./CheckoutModal";
import { SubscriptionStatus } from "./SubscriptionStatus";

export function CheckoutKitDashboard() {
  const {
    subscription,
    loading,
    checkoutLoading,
    cancelLoading,
    authenticated,
    error,
    checkout,
    cancel,
  } = useSubscription();

  const [showCheckout, setShowCheckout] = useState(false);

  const hasActivePro =
    subscription?.status === "active" && subscription.plan === "pro";
  const isCancelled = subscription?.status === "cancelled";

  // Auth gate
  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p
            style={{
              fontFamily: "var(--font-day25-mono)",
              fontSize: "14px",
              color: "#999",
            }}
          >
            {">"} authentication required
          </p>
          <Link
            href={`/login?redirectTo=${encodeURIComponent("/day25")}`}
            className="inline-block px-6 py-3 transition-all"
            style={{
              fontFamily: "var(--font-day25-mono)",
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
            fontFamily: "var(--font-day25-mono)",
            fontSize: "13px",
            color: "#555555",
          }}
        >
          {">"} loading subscription...
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Error banner */}
      {error && (
        <div
          className="p-3"
          style={{
            fontFamily: "var(--font-day25-mono)",
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

      {/* State 1: Active Pro — show status */}
      {hasActivePro && (
        <SubscriptionStatus
          subscription={subscription}
          onCancel={cancel}
          cancelLoading={cancelLoading}
        />
      )}

      {/* State 2: No subscription or free — show pricing */}
      {!hasActivePro && !isCancelled && (
        <PricingCards
          subscription={subscription}
          onSubscribe={() => setShowCheckout(true)}
          disabled={checkoutLoading}
        />
      )}

      {/* State 3: Cancelled — show status + pricing to re-subscribe */}
      {isCancelled && (
        <div className="space-y-8">
          <SubscriptionStatus
            subscription={subscription}
            onCancel={cancel}
            cancelLoading={cancelLoading}
          />
          <div
            style={{
              borderTop: "1px solid #2a2a2a",
              paddingTop: 32,
            }}
          >
            <PricingCards
              subscription={null}
              onSubscribe={() => setShowCheckout(true)}
              disabled={checkoutLoading}
            />
          </div>
        </div>
      )}

      {/* Checkout modal */}
      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onConfirm={async () => {
          const success = await checkout("pro");
          return success;
        }}
      />
    </main>
  );
}

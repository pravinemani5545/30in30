"use client";

import { useState } from "react";
import type { Subscription } from "@/types/day25";

interface SubscriptionStatusProps {
  subscription: Subscription;
  onCancel: () => Promise<boolean>;
  cancelLoading: boolean;
}

export function SubscriptionStatus({
  subscription,
  onCancel,
  cancelLoading,
}: SubscriptionStatusProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  const isActive = subscription.status === "active";
  const memberSince = new Date(subscription.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
  const cancelledAt = subscription.cancelled_at
    ? new Date(subscription.cancelled_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  async function handleCancel() {
    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }
    await onCancel();
    setConfirmCancel(false);
  }

  return (
    <div className="max-w-lg mx-auto">
      <div
        className="p-6"
        style={{
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: 0,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3
            style={{
              fontFamily: "var(--font-day25-heading)",
              fontSize: "18px",
              fontWeight: 700,
              color: "#eeeeee",
            }}
          >
            Subscription
          </h3>
          <span
            className="px-3 py-1"
            style={{
              fontFamily: "var(--font-day25-mono)",
              fontSize: "11px",
              fontWeight: 700,
              color: isActive ? "#000" : "#fff",
              background: isActive ? "#00FF41" : "#EF4444",
              borderRadius: 0,
              textTransform: "uppercase",
            }}
          >
            {subscription.status}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: "var(--font-day25-mono)",
                fontSize: "13px",
                color: "#999999",
              }}
            >
              Plan
            </span>
            <span
              style={{
                fontFamily: "var(--font-day25-mono)",
                fontSize: "13px",
                color: "#eeeeee",
                fontWeight: 600,
              }}
            >
              {subscription.plan === "pro" ? "Pro — $29/mo" : "Free"}
            </span>
          </div>

          <div
            style={{ borderTop: "1px solid #1a1a1a", margin: "0" }}
          />

          <div className="flex justify-between">
            <span
              style={{
                fontFamily: "var(--font-day25-mono)",
                fontSize: "13px",
                color: "#999999",
              }}
            >
              Member since
            </span>
            <span
              style={{
                fontFamily: "var(--font-day25-mono)",
                fontSize: "13px",
                color: "#eeeeee",
              }}
            >
              {memberSince}
            </span>
          </div>

          {cancelledAt && (
            <>
              <div
                style={{ borderTop: "1px solid #1a1a1a", margin: "0" }}
              />
              <div className="flex justify-between">
                <span
                  style={{
                    fontFamily: "var(--font-day25-mono)",
                    fontSize: "13px",
                    color: "#999999",
                  }}
                >
                  Cancelled on
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-day25-mono)",
                    fontSize: "13px",
                    color: "#EF4444",
                  }}
                >
                  {cancelledAt}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Cancel action */}
        {isActive && (
          <div className="mt-6">
            {confirmCancel ? (
              <div
                className="p-4 space-y-3"
                style={{
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  borderRadius: 0,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-day25-mono)",
                    fontSize: "13px",
                    color: "#EF4444",
                  }}
                >
                  {">"} Are you sure? This will cancel your Pro subscription.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    className="px-4 py-2"
                    style={{
                      fontFamily: "var(--font-day25-mono)",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#fff",
                      background: "#EF4444",
                      border: "none",
                      borderRadius: 0,
                      cursor: cancelLoading ? "not-allowed" : "pointer",
                      opacity: cancelLoading ? 0.6 : 1,
                    }}
                  >
                    {cancelLoading ? "[ CANCELLING... ]" : "[ CONFIRM CANCEL ]"}
                  </button>
                  <button
                    onClick={() => setConfirmCancel(false)}
                    disabled={cancelLoading}
                    className="px-4 py-2"
                    style={{
                      fontFamily: "var(--font-day25-mono)",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#999999",
                      background: "none",
                      border: "1px solid #2a2a2a",
                      borderRadius: 0,
                      cursor: "pointer",
                    }}
                  >
                    [ KEEP PLAN ]
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleCancel}
                className="w-full py-2"
                style={{
                  fontFamily: "var(--font-day25-mono)",
                  fontSize: "12px",
                  color: "#999999",
                  background: "none",
                  border: "1px solid #2a2a2a",
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                [ CANCEL SUBSCRIPTION ]
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

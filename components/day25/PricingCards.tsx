"use client";

import { PLANS } from "@/lib/day25/plans";
import type { Plan, Subscription } from "@/types/day25";

interface PricingCardsProps {
  subscription: Subscription | null;
  onSubscribe: () => void;
  disabled?: boolean;
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span
        style={{
          color: "#00FF41",
          fontFamily: "var(--font-day25-mono)",
          fontSize: "14px",
          flexShrink: 0,
        }}
      >
        +
      </span>
      <span
        style={{
          fontFamily: "var(--font-day25-body)",
          fontSize: "14px",
          color: "#cccccc",
        }}
      >
        {text}
      </span>
    </li>
  );
}

function PlanCard({
  plan,
  isActive,
  onSubscribe,
  disabled,
}: {
  plan: Plan;
  isActive: boolean;
  onSubscribe?: () => void;
  disabled?: boolean;
}) {
  const isPro = plan.id === "pro";

  return (
    <div
      className="flex flex-col p-6"
      style={{
        background: isPro ? "#161616" : "#111111",
        border: isPro ? "1px solid #00FF41" : "1px solid #2a2a2a",
        borderRadius: 0,
        minHeight: 420,
      }}
    >
      {/* Plan header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h3
            style={{
              fontFamily: "var(--font-day25-heading)",
              fontSize: "20px",
              fontWeight: 700,
              color: "#eeeeee",
            }}
          >
            {plan.name}
          </h3>
          {isActive && (
            <span
              className="px-2 py-0.5"
              style={{
                fontFamily: "var(--font-day25-mono)",
                fontSize: "11px",
                fontWeight: 700,
                color: "#000",
                background: "#00FF41",
                borderRadius: 0,
              }}
            >
              CURRENT
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span
            style={{
              fontFamily: "var(--font-day25-heading)",
              fontSize: "36px",
              fontWeight: 700,
              color: "#eeeeee",
            }}
          >
            ${plan.price}
          </span>
          <span
            style={{
              fontFamily: "var(--font-day25-mono)",
              fontSize: "14px",
              color: "#555555",
            }}
          >
            /mo
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-6">
        {plan.features.map((feature) => (
          <FeatureItem key={feature} text={feature} />
        ))}
      </ul>

      {/* Action */}
      {isPro && !isActive ? (
        <button
          onClick={onSubscribe}
          disabled={disabled}
          className="w-full py-3 transition-all"
          style={{
            fontFamily: "var(--font-day25-mono)",
            fontSize: "14px",
            fontWeight: 700,
            background: disabled ? "#333333" : "#00FF41",
            color: disabled ? "#666666" : "#000000",
            border: "none",
            borderRadius: 0,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {disabled ? "[ PROCESSING... ]" : "[ SUBSCRIBE ]"}
        </button>
      ) : !isPro ? (
        <div
          className="w-full py-3 text-center"
          style={{
            fontFamily: "var(--font-day25-mono)",
            fontSize: "14px",
            color: "#555555",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
          }}
        >
          {isActive ? "[ ACTIVE ]" : "[ FREE TIER ]"}
        </div>
      ) : (
        <div
          className="w-full py-3 text-center"
          style={{
            fontFamily: "var(--font-day25-mono)",
            fontSize: "14px",
            color: "#00FF41",
            border: "1px solid #00FF41",
            borderRadius: 0,
          }}
        >
          [ ACTIVE ]
        </div>
      )}
    </div>
  );
}

export function PricingCards({
  subscription,
  onSubscribe,
  disabled,
}: PricingCardsProps) {
  const activePlan = subscription?.status === "active" ? subscription.plan : "free";

  return (
    <div>
      <div className="text-center mb-8">
        <h2
          style={{
            fontFamily: "var(--font-day25-heading)",
            fontSize: "24px",
            fontWeight: 700,
            color: "#eeeeee",
            marginBottom: 8,
          }}
        >
          Choose your plan
        </h2>
        <p
          style={{
            fontFamily: "var(--font-day25-body)",
            fontSize: "14px",
            color: "#999999",
          }}
        >
          Start free, upgrade when you need more power.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isActive={activePlan === plan.id}
            onSubscribe={onSubscribe}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

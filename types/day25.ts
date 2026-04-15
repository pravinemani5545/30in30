// ─── Day 25: CheckoutKit Types ──────────────────────────────────────

export type PlanId = "free" | "pro";
export type SubStatus = "active" | "cancelled" | "expired";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  interval: "month";
  features: string[];
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: PlanId;
  status: SubStatus;
  created_at: string;
  cancelled_at: string | null;
}

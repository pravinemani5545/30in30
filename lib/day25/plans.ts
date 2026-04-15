import type { Plan } from "@/types/day25";

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: [
      "5 projects",
      "Basic analytics",
      "Community support",
      "1 team member",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    interval: "month",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Unlimited team members",
      "API access",
      "Custom integrations",
    ],
  },
];

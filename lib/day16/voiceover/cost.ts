import type { CostEstimate } from "@/types/day16";

const COST_PER_CHAR = 0.0003; // Creator tier, conservative estimate

export function estimateCost(charCount: number): CostEstimate {
  const cost = charCount * COST_PER_CHAR;
  const tier: CostEstimate["tier"] =
    cost < 0.03 ? "low" : cost < 0.1 ? "mid" : "high";
  return {
    estimate: cost < 0.01 ? "<$0.01" : `~$${cost.toFixed(2)}`,
    tier,
    rawCost: cost,
  };
}

export const MAX_CHARACTERS = 5000;

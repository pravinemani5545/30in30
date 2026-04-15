import type { CampaignEvent, FunnelData, ABTestResult } from "@/types/day23";

const STAGES = ["sent", "opened", "clicked", "replied", "converted"] as const;

/**
 * Standard normal CDF approximation using rational approximation.
 * Returns P(Z <= z) for the standard normal distribution.
 */
function normalCDF(z: number): number {
  // Use symmetry: CDF(-z) = 1 - CDF(z)
  if (z < 0) return 1 - normalCDF(-z);

  // Abramowitz and Stegun approximation 26.2.17
  const p = 0.2316419;
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;

  const t = 1 / (1 + p * z);
  const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  const cdf =
    1 - pdf * (b1 * t + b2 * t ** 2 + b3 * t ** 3 + b4 * t ** 4 + b5 * t ** 5);

  return cdf;
}

/**
 * Calculate funnel data from campaign events.
 * Counts events by stage and calculates rates relative to "sent".
 */
export function calculateFunnel(events: CampaignEvent[]): FunnelData[] {
  const counts: Record<string, number> = {};
  for (const stage of STAGES) {
    counts[stage] = 0;
  }

  for (const event of events) {
    if (counts[event.stage] !== undefined) {
      counts[event.stage]++;
    }
  }

  const sentCount = counts["sent"] || 1; // avoid division by zero

  return STAGES.map((stage) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count: counts[stage],
    rate: Math.round((counts[stage] / sentCount) * 10000) / 100,
  }));
}

/**
 * Calculate A/B test results for each stage.
 * Uses z-test for proportions to determine significance.
 *
 * Z = (p1 - p2) / sqrt(p * (1-p) * (1/n1 + 1/n2))
 * where p = pooled proportion = (x1 + x2) / (n1 + n2)
 */
export function calculateABTest(events: CampaignEvent[]): ABTestResult[] {
  // Count total sent per variant (the denominator for rates)
  const totalA = events.filter(
    (e) => e.stage === "sent" && e.variant === "A",
  ).length;
  const totalB = events.filter(
    (e) => e.stage === "sent" && e.variant === "B",
  ).length;

  if (totalA === 0 || totalB === 0) return [];

  // For each stage beyond "sent", compare A vs B
  const testStages = STAGES.filter((s) => s !== "sent");

  return testStages.map((stage) => {
    const countA = events.filter(
      (e) => e.stage === stage && e.variant === "A",
    ).length;
    const countB = events.filter(
      (e) => e.stage === stage && e.variant === "B",
    ).length;

    const rateA = countA / totalA;
    const rateB = countB / totalB;

    // Pooled proportion
    const pooled = (countA + countB) / (totalA + totalB);

    // Z-score for difference in proportions
    let zScore = 0;
    if (pooled > 0 && pooled < 1) {
      const se = Math.sqrt(pooled * (1 - pooled) * (1 / totalA + 1 / totalB));
      zScore = se > 0 ? (rateA - rateB) / se : 0;
    }

    // Two-tailed p-value
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

    return {
      stage: stage.charAt(0).toUpperCase() + stage.slice(1),
      variantA: {
        count: countA,
        total: totalA,
        rate: Math.round(rateA * 10000) / 100,
      },
      variantB: {
        count: countB,
        total: totalB,
        rate: Math.round(rateB * 10000) / 100,
      },
      zScore: Math.round(zScore * 1000) / 1000,
      pValue: Math.round(pValue * 10000) / 10000,
      significant: pValue < 0.05,
    };
  });
}

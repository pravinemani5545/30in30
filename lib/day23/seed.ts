import type { CampaignEvent } from "@/types/day23";

/**
 * Generate realistic seed data for a campaign.
 * Distribution: sent=500, opened~200, clicked~80, replied~30, converted~12
 * Variant split: ~60% A, ~40% B
 * Variant A: better open rates
 * Variant B: better click-through rates
 */
export function generateSeedData(campaignId: string): Omit<CampaignEvent, "id">[] {
  const events: Omit<CampaignEvent, "id">[] = [];
  const baseTime = new Date();
  baseTime.setDate(baseTime.getDate() - 14); // start 14 days ago

  // Total sends: 500 (300 A, 200 B)
  const totalA = 300;
  const totalB = 200;

  // Rates per variant
  // A: better opens (45% vs 35%), B: better clicks (50% of opens vs 35%)
  const rates = {
    A: { opened: 0.45, clicked: 0.35, replied: 0.12, converted: 0.05 },
    B: { opened: 0.35, clicked: 0.50, replied: 0.15, converted: 0.06 },
  };

  function addEvents(variant: "A" | "B", total: number) {
    const variantRates = rates[variant];

    // Sent events
    for (let i = 0; i < total; i++) {
      const offset = Math.random() * 14 * 24 * 60 * 60 * 1000;
      events.push({
        campaign_id: campaignId,
        stage: "sent",
        variant,
        created_at: new Date(baseTime.getTime() + offset).toISOString(),
      });
    }

    // Opened — subset of sent
    const openedCount = Math.round(total * variantRates.opened);
    for (let i = 0; i < openedCount; i++) {
      const offset =
        Math.random() * 14 * 24 * 60 * 60 * 1000 +
        Math.random() * 2 * 60 * 60 * 1000; // opened 0-2 hours after send window
      events.push({
        campaign_id: campaignId,
        stage: "opened",
        variant,
        created_at: new Date(baseTime.getTime() + offset).toISOString(),
      });
    }

    // Clicked — subset of opened
    const clickedCount = Math.round(openedCount * variantRates.clicked);
    for (let i = 0; i < clickedCount; i++) {
      const offset =
        Math.random() * 14 * 24 * 60 * 60 * 1000 +
        Math.random() * 4 * 60 * 60 * 1000;
      events.push({
        campaign_id: campaignId,
        stage: "clicked",
        variant,
        created_at: new Date(baseTime.getTime() + offset).toISOString(),
      });
    }

    // Replied — subset of clicked
    const repliedCount = Math.round(total * variantRates.replied);
    for (let i = 0; i < repliedCount; i++) {
      const offset =
        Math.random() * 14 * 24 * 60 * 60 * 1000 +
        Math.random() * 24 * 60 * 60 * 1000;
      events.push({
        campaign_id: campaignId,
        stage: "replied",
        variant,
        created_at: new Date(baseTime.getTime() + offset).toISOString(),
      });
    }

    // Converted — subset of replied
    const convertedCount = Math.round(total * variantRates.converted);
    for (let i = 0; i < convertedCount; i++) {
      const offset =
        Math.random() * 14 * 24 * 60 * 60 * 1000 +
        Math.random() * 48 * 60 * 60 * 1000;
      events.push({
        campaign_id: campaignId,
        stage: "converted",
        variant,
        created_at: new Date(baseTime.getTime() + offset).toISOString(),
      });
    }
  }

  addEvents("A", totalA);
  addEvents("B", totalB);

  return events;
}

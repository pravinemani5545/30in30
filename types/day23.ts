export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  status: "active" | "paused" | "completed";
  created_at: string;
}

export interface CampaignEvent {
  id: string;
  campaign_id: string;
  stage: "sent" | "opened" | "clicked" | "replied" | "converted";
  variant: "A" | "B" | null;
  created_at: string;
}

export interface FunnelData {
  stage: string;
  count: number;
  rate: number;
}

export interface ABTestResult {
  stage: string;
  variantA: { count: number; total: number; rate: number };
  variantB: { count: number; total: number; rate: number };
  zScore: number;
  pValue: number;
  significant: boolean;
}

export interface CampaignAnalytics {
  funnel: FunnelData[];
  abTest: ABTestResult[];
}

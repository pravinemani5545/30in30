// Day 31: PriceTracker — TypeScript interfaces

export type AvailabilityStatus = "in_stock" | "out_of_stock" | "unknown";
export type CheckFrequency = "1x" | "2x" | "4x" | "6x";
export type CheckResult = "success" | "extraction_failed" | "fetch_failed";

export interface TrackedProduct {
  id: string;
  user_id: string;
  url: string;
  product_name: string | null;
  target_price: number;
  frequency: CheckFrequency;
  notify_price_drop: boolean;
  notify_back_in_stock: boolean;
  is_active: boolean;
  current_price: number | null;
  currency: string;
  availability: AvailabilityStatus;
  previous_price: number | null;
  is_below_target: boolean;
  last_check_at: string | null;
  next_check_at: string | null;
  last_alert_price: number | null;
  consecutive_failures: number;
  is_js_rendered: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceHistoryEntry {
  id: string;
  product_id: string;
  user_id: string;
  price: number | null;
  availability: AvailabilityStatus | null;
  result: CheckResult;
  confidence: string | null;
  alert_sent: boolean;
  alert_type: string | null;
  checked_at: string;
}

export interface ExtractionResult {
  price: number | null;
  currency: string | null;
  availability: AvailabilityStatus;
  product_name: string | null;
  confidence: "high" | "medium" | "low";
}

export interface CheckSummary {
  productId: string;
  result: CheckResult;
  price: number | null;
  availability: AvailabilityStatus;
  alertSent: boolean;
  alertType: string | null;
}

export interface AddProductInput {
  url: string;
  productName?: string;
  targetPrice: number;
  frequency: CheckFrequency;
  notifyPriceDrop: boolean;
  notifyBackInStock: boolean;
}

export interface EditProductInput {
  targetPrice?: number;
  frequency?: CheckFrequency;
  notifyPriceDrop?: boolean;
  notifyBackInStock?: boolean;
  productName?: string;
}

export interface PreviewResult {
  productName: string | null;
  currentPrice: number | null;
  availability: AvailabilityStatus;
}

export interface CronRunSummary {
  processed: number;
  succeeded: number;
  failed: number;
  alertsSent: number;
  durationMs: number;
}

export const FREQUENCY_LABELS: Record<CheckFrequency, string> = {
  "1x": "1x / day",
  "2x": "2x / day",
  "4x": "4x / day",
  "6x": "6x / day",
};

export const FREQUENCY_HOURS: Record<CheckFrequency, number> = {
  "1x": 24,
  "2x": 12,
  "4x": 6,
  "6x": 4,
};

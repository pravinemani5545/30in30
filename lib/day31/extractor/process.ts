import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  TrackedProduct,
  CheckSummary,
  CheckFrequency,
  ExtractionResult,
} from "@/types/day31";
import { FREQUENCY_HOURS } from "@/types/day31";
import { fetchProductPage } from "./fetch";
import { cleanHtml } from "./clean";
import { extractPriceData } from "@/lib/day31/ai/claude";

export function getNextCheckAt(frequency: CheckFrequency): string {
  const hours = FREQUENCY_HOURS[frequency] ?? 12;
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export async function processProductCheck(
  product: TrackedProduct,
  supabase: SupabaseClient,
): Promise<CheckSummary> {
  const summary: CheckSummary = {
    productId: product.id,
    result: "success",
    price: null,
    availability: "unknown",
    alertSent: false,
    alertType: null,
  };

  // 1. Fetch the page
  const { html, error: fetchError } = await fetchProductPage(product.url);

  if (fetchError || !html) {
    summary.result = "fetch_failed";
    await recordHistory(supabase, product, summary);
    await incrementFailure(supabase, product);
    return summary;
  }

  // 2. Clean HTML
  const cleaned = cleanHtml(html);

  if (!cleaned) {
    // JS-rendered page or no useful content
    summary.result = "extraction_failed";
    await recordHistory(supabase, product, summary);

    // Flag as JS-rendered if HTML was fetched but cleaning yielded nothing
    if (html.length > 0 && html.length < 500) {
      await supabase
        .from("day31_tracked_products")
        .update({ is_js_rendered: true })
        .eq("id", product.id);
    }

    await incrementFailure(supabase, product);
    return summary;
  }

  // 3. Extract with Claude
  const extraction: ExtractionResult = await extractPriceData(cleaned);

  // 4. Handle low confidence as extraction_failed
  if (extraction.confidence === "low") {
    summary.result = "extraction_failed";
    await recordHistory(supabase, product, summary);
    await incrementFailure(supabase, product);
    return summary;
  }

  // 5. Null safety — never overwrite known good price with null
  const isExtractionFailed =
    extraction.price === null && extraction.availability === "unknown";

  if (isExtractionFailed) {
    summary.result = "extraction_failed";
    await recordHistory(supabase, product, summary);
    await incrementFailure(supabase, product);
    return summary;
  }

  summary.price = extraction.price;
  summary.availability = extraction.availability;

  // 6. Determine alerts
  const priceDropAlert =
    extraction.price !== null &&
    extraction.price < product.target_price &&
    (product.current_price === null ||
      product.current_price >= product.target_price) &&
    product.notify_price_drop;

  const backInStockAlert =
    extraction.availability === "in_stock" &&
    product.availability === "out_of_stock" &&
    product.notify_back_in_stock;

  if (priceDropAlert) {
    summary.alertSent = true;
    summary.alertType = "price_drop";
  } else if (backInStockAlert) {
    summary.alertSent = true;
    summary.alertType = "back_in_stock";
  }

  // 7. Update product
  const updateData: Record<string, unknown> = {
    previous_price: product.current_price,
    last_check_at: new Date().toISOString(),
    next_check_at: getNextCheckAt(product.frequency),
    consecutive_failures: 0,
  };

  if (extraction.price !== null) {
    updateData.current_price = extraction.price;
  }
  if (extraction.currency) {
    updateData.currency = extraction.currency;
  }
  if (extraction.availability !== "unknown") {
    updateData.availability = extraction.availability;
  }
  if (extraction.product_name && !product.product_name) {
    updateData.product_name = extraction.product_name;
  }
  if (priceDropAlert && extraction.price !== null) {
    updateData.last_alert_price = extraction.price;
  }

  await supabase
    .from("day31_tracked_products")
    .update(updateData)
    .eq("id", product.id);

  // 8. Record history
  await recordHistory(supabase, product, summary);

  return summary;
}

async function recordHistory(
  supabase: SupabaseClient,
  product: TrackedProduct,
  summary: CheckSummary,
): Promise<void> {
  await supabase.from("day31_price_history").insert({
    product_id: product.id,
    user_id: product.user_id,
    price: summary.price,
    availability: summary.availability !== "unknown" ? summary.availability : null,
    result: summary.result,
    confidence: null,
    alert_sent: summary.alertSent,
    alert_type: summary.alertType,
  });
}

async function incrementFailure(
  supabase: SupabaseClient,
  product: TrackedProduct,
): Promise<void> {
  const newFailures = product.consecutive_failures + 1;
  const updateData: Record<string, unknown> = {
    consecutive_failures: newFailures,
    last_check_at: new Date().toISOString(),
    next_check_at: getNextCheckAt(product.frequency),
  };

  // Deactivate after 5 consecutive failures
  if (newFailures >= 5) {
    updateData.is_active = false;
  }

  await supabase
    .from("day31_tracked_products")
    .update(updateData)
    .eq("id", product.id);
}

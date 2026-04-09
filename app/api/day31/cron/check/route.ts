import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { processProductCheck } from "@/lib/day31/extractor/process";
import {
  sendPriceDropAlert,
  sendBackInStockAlert,
  sendUnreachableAlert,
} from "@/lib/day31/email/resend";
import type { TrackedProduct, CronRunSummary } from "@/types/day31";

export const maxDuration = 300;

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 100;

export async function POST() {
  const start = Date.now();
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  // CRON_SECRET verification — FIRST operation
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // Fetch all due products
  const { data: products, error } = await supabase
    .from("day31_tracked_products")
    .select("*")
    .lte("next_check_at", new Date().toISOString())
    .eq("is_active", true);

  if (error || !products) {
    return NextResponse.json(
      { error: error?.message ?? "No products found" },
      { status: 500 },
    );
  }

  const summary: CronRunSummary = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    alertsSent: 0,
    durationMs: 0,
  };

  // Process in batches
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map((p) => processProductCheck(p as TrackedProduct, supabase)),
    );

    for (let j = 0; j < results.length; j++) {
      summary.processed++;
      const result = results[j];

      if (result.status === "rejected") {
        summary.failed++;
        continue;
      }

      const check = result.value;
      if (check.result === "success") {
        summary.succeeded++;
      } else {
        summary.failed++;
      }

      // Send alerts
      if (check.alertSent && check.alertType) {
        const product = batch[j] as TrackedProduct;
        try {
          // Get user email
          const { data: userData } = await supabase.auth.admin.getUserById(
            product.user_id,
          );
          const email = userData?.user?.email;
          if (!email) continue;

          const productName = product.product_name || "Tracked product";
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

          if (check.alertType === "price_drop" && check.price !== null) {
            await sendPriceDropAlert(
              email,
              productName,
              product.url,
              check.price,
              product.target_price,
              product.currency,
            );
            summary.alertsSent++;
          } else if (check.alertType === "back_in_stock") {
            await sendBackInStockAlert(
              email,
              productName,
              product.url,
              check.price,
              product.target_price,
              product.currency,
            );
            summary.alertsSent++;
          }

          // Check if product was deactivated (5 failures)
          if (product.consecutive_failures >= 4) {
            await sendUnreachableAlert(email, productName, appUrl);
          }
        } catch {
          // Alert send failure shouldn't crash the cron
        }
      }
    }

    // Delay between batches
    if (i + BATCH_SIZE < products.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  summary.durationMs = Date.now() - start;

  return NextResponse.json(summary);
}

import type { SupabaseClient } from "@supabase/supabase-js";

export const MONTHLY_CREDIT_LIMIT = 10;

export function getMonthYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function getCreditsUsed(
  userId: string,
  supabase: SupabaseClient
): Promise<number> {
  const monthYear = getMonthYear();

  const { data, error } = await supabase
    .from("enrichment_usage")
    .select("credits_used")
    .eq("user_id", userId)
    .eq("month_year", monthYear)
    .maybeSingle();

  if (error) {
    console.error("[credits] Failed to fetch credits:", error.message);
    return 0;
  }

  return data?.credits_used ?? 0;
}

export async function incrementCreditsUsed(
  userId: string,
  supabase: SupabaseClient
): Promise<void> {
  const monthYear = getMonthYear();

  const { error } = await supabase.rpc("increment_credits", {
    p_user_id: userId,
    p_month_year: monthYear,
  });

  if (error) {
    // Fallback: upsert manually
    const { data: existing } = await supabase
      .from("enrichment_usage")
      .select("credits_used")
      .eq("user_id", userId)
      .eq("month_year", monthYear)
      .maybeSingle();

    const newCount = (existing?.credits_used ?? 0) + 1;

    await supabase.from("enrichment_usage").upsert(
      {
        user_id: userId,
        month_year: monthYear,
        credits_used: newCount,
        last_reset_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,month_year" }
    );
  }
}

export async function getCreditsRemaining(
  userId: string,
  supabase: SupabaseClient
): Promise<number> {
  const used = await getCreditsUsed(userId, supabase);
  return Math.max(0, MONTHLY_CREDIT_LIMIT - used);
}

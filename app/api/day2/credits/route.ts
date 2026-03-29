import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  getCreditsUsed,
  MONTHLY_CREDIT_LIMIT,
  getMonthYear,
} from "@/lib/day2/enrichment/credits";
import type { CreditsResponse } from "@/types/day2";

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({
        creditsUsed: 0,
        creditsRemaining: MONTHLY_CREDIT_LIMIT,
        monthYear: getMonthYear(),
        limit: MONTHLY_CREDIT_LIMIT,
      } satisfies CreditsResponse);
    }

    const creditsUsed = await getCreditsUsed(user.id, supabase);
    const creditsRemaining = Math.max(0, MONTHLY_CREDIT_LIMIT - creditsUsed);

    return NextResponse.json({
      creditsUsed,
      creditsRemaining,
      monthYear: getMonthYear(),
      limit: MONTHLY_CREDIT_LIMIT,
    } satisfies CreditsResponse);
  } catch (err) {
    console.error("[credits GET]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

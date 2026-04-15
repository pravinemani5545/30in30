import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || body.plan !== "pro") {
      return NextResponse.json(
        { error: "Invalid plan. Only 'pro' plan can be purchased." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to subscribe." },
        { status: 401 },
      );
    }

    // Check for existing active subscription
    const { data: existing } = await supabase
      .from("day25_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (existing && existing.plan === "pro") {
      return NextResponse.json(
        { error: "You already have an active Pro subscription." },
        { status: 409 },
      );
    }

    // Upsert subscription (handles re-subscribe after cancel)
    const { data: subscription, error } = await supabase
      .from("day25_subscriptions")
      .upsert(
        {
          user_id: user.id,
          plan: "pro",
          status: "active",
          cancelled_at: null,
        },
        { onConflict: "user_id" },
      )
      .select()
      .single();

    if (error || !subscription) {
      console.error("[day25/checkout] upsert error:", error?.message);
      return NextResponse.json(
        { error: "Failed to process checkout" },
        { status: 500 },
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error(
      "[day25/checkout] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

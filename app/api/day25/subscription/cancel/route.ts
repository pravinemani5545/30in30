import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to manage your subscription." },
        { status: 401 },
      );
    }

    const { data: subscription, error } = await supabase
      .from("day25_subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("status", "active")
      .select()
      .single();

    if (error || !subscription) {
      console.error("[day25/cancel] update error:", error?.message);
      return NextResponse.json(
        { error: "No active subscription to cancel" },
        { status: 404 },
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error(
      "[day25/cancel] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

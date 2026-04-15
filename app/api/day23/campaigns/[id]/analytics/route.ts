import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { calculateFunnel, calculateABTest } from "@/lib/day23/stats";
import type { CampaignEvent } from "@/types/day23";

export const maxDuration = 60;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to view analytics." },
        { status: 401 },
      );
    }

    // Verify campaign ownership
    const { data: campaign, error: campaignError } = await supabase
      .from("day23_campaigns")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 },
      );
    }

    // Fetch all events for this campaign
    const { data: events, error: eventsError } = await supabase
      .from("day23_campaign_events")
      .select("*")
      .eq("campaign_id", id);

    if (eventsError) {
      console.error(
        "[day23/analytics] fetch error:",
        eventsError.message,
      );
      return NextResponse.json(
        { error: "Failed to fetch campaign events" },
        { status: 500 },
      );
    }

    const typedEvents = (events ?? []) as CampaignEvent[];
    const funnel = calculateFunnel(typedEvents);
    const abTest = calculateABTest(typedEvents);

    return NextResponse.json({
      analytics: { funnel, abTest },
    });
  } catch (error) {
    console.error(
      "[day23/analytics] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

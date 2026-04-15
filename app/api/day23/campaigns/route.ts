import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { generateSeedData } from "@/lib/day23/seed";

export const maxDuration = 60;

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to view campaigns." },
        { status: 401 },
      );
    }

    const { data: campaigns, error } = await supabase
      .from("day23_campaigns")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[day23/campaigns] fetch error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch campaigns" },
        { status: 500 },
      );
    }

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error(
      "[day23/campaigns] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Campaign name is required" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to create campaigns." },
        { status: 401 },
      );
    }

    // Create the campaign
    const { data: campaign, error: campaignError } = await supabase
      .from("day23_campaigns")
      .insert({
        user_id: user.id,
        name: body.name.trim(),
        status: "active",
      })
      .select()
      .single();

    if (campaignError || !campaign) {
      console.error(
        "[day23/campaigns] insert error:",
        campaignError?.message,
      );
      return NextResponse.json(
        { error: "Failed to create campaign" },
        { status: 500 },
      );
    }

    // Generate and insert seed events
    const seedEvents = generateSeedData(campaign.id);

    // Insert in batches to avoid payload limits
    const batchSize = 200;
    for (let i = 0; i < seedEvents.length; i += batchSize) {
      const batch = seedEvents.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from("day23_campaign_events")
        .insert(batch);

      if (insertError) {
        console.error(
          "[day23/campaigns] event insert error:",
          insertError.message,
        );
        // Clean up the campaign if events fail
        await supabase
          .from("day23_campaigns")
          .delete()
          .eq("id", campaign.id);
        return NextResponse.json(
          { error: "Failed to seed campaign events" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error(
      "[day23/campaigns] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}

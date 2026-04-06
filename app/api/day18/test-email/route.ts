import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { sendDigest } from "@/lib/day18/email/resend";
import type { DigestChange } from "@/types/day18";

const SAMPLE_CHANGES: DigestChange[] = [
  {
    domain: "competitor.com",
    url: "https://competitor.com/pricing",
    change_type: "pricing",
    summary:
      "Increased Pro plan from $49/mo to $79/mo. Enterprise tier now requires annual commitment. Free tier unchanged.",
    detected_at: new Date().toISOString(),
  },
  {
    domain: "rival.io",
    url: "https://rival.io/features",
    change_type: "feature",
    summary:
      'Launched AI-powered analytics dashboard. New "Insights" tab on the main navigation. Blog post announcing the feature linked from homepage.',
    detected_at: new Date().toISOString(),
  },
];

export async function POST() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.email) {
    return NextResponse.json(
      { error: "No email address on your account" },
      { status: 400 },
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    await sendDigest(user.email, SAMPLE_CHANGES, today);
    return NextResponse.json({ sent_to: user.email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

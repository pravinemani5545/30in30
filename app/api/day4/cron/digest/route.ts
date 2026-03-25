import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { runDigest } from "@/lib/day4/cron/digest";

export async function GET() {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = process.env.CRON_USER_ID;
  if (!userId) {
    return NextResponse.json(
      { error: "CRON_USER_ID not configured" },
      { status: 500 }
    );
  }

  try {
    const supabase = createServiceClient();
    const result = await runDigest(userId, supabase);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cron digest error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

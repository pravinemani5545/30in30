import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      new URL("/day4/unsubscribe?error=missing_token", appUrl)
    );
  }

  const supabase = createServiceClient();

  const { data: subscriber, error } = await supabase
    .from("subscribers")
    .select("id, is_active")
    .eq("unsubscribe_token", token)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error || !subscriber) {
    return NextResponse.redirect(
      new URL("/day4/unsubscribe?error=invalid_token", appUrl)
    );
  }

  if (!subscriber.is_active) {
    return NextResponse.redirect(
      new URL("/day4/unsubscribe?success=true", appUrl)
    );
  }

  await supabase
    .from("subscribers")
    .update({
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("id", subscriber.id);

  return NextResponse.redirect(
    new URL("/day4/unsubscribe?success=true", appUrl)
  );
}

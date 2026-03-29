import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createSupabaseServer } from "@/lib/supabase/server";

const AddSubscriberSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(1).max(100).optional(),
});

export async function GET() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json([]);
  }

  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("id, email, name, is_active, created_at")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }

  return NextResponse.json(subscribers);
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = AddSubscriberSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  // Check duplicate
  const { data: existing } = await supabase
    .from("subscribers")
    .select("id, is_active")
    .eq("user_id", user.id)
    .eq("email", parsed.data.email)
    .limit(1)
    .single();

  if (existing) {
    if (!existing.is_active) {
      // Reactivate
      await supabase
        .from("subscribers")
        .update({ is_active: true, unsubscribed_at: null })
        .eq("id", existing.id);

      return NextResponse.json({ id: existing.id, reactivated: true });
    }
    return NextResponse.json(
      { error: "That email is already subscribed" },
      { status: 409 }
    );
  }

  const { data: subscriber, error } = await supabase
    .from("subscribers")
    .insert({
      user_id: user.id,
      email: parsed.data.email,
      name: parsed.data.name || null,
    })
    .select("id, email, name, is_active, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to add subscriber" }, { status: 500 });
  }

  return NextResponse.json(subscriber, { status: 201 });
}

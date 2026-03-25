import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: subscriber } = await supabase
    .from("subscribers")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (!subscriber || subscriber.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Soft delete
  const { error } = await supabase
    .from("subscribers")
    .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to deactivate subscriber" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

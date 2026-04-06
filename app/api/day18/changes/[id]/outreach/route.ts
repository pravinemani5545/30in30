import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { generateOutreach } from "@/lib/day18/gemini/classifier";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the change record
  const { data: change, error } = await supabase
    .from("company_changes")
    .select("*, tracked_companies!inner(domain)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !change) {
    return NextResponse.json({ error: "Change not found" }, { status: 404 });
  }

  const company = change.tracked_companies as unknown as { domain: string };
  const outreachAngle = await generateOutreach(company.domain, change.summary);

  // Store the generated outreach prompt
  // Note: company_changes is INSERT-only via RLS for user, but service role can update
  // We return it to the client instead
  return NextResponse.json({ outreachAngle });
}

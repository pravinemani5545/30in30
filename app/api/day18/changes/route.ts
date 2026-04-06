import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { changesQuerySchema } from "@/lib/day18/validations/tracker";

export async function GET(req: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = changesQuerySchema.safeParse({
    type: url.searchParams.get("type") ?? undefined,
    days: url.searchParams.get("days") ?? 7,
    limit: url.searchParams.get("limit") ?? 50,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const { type, days, limit } = parsed.data;
  const since = new Date();
  since.setDate(since.getDate() - days);

  let query = supabase
    .from("company_changes")
    .select(
      "*, tracked_companies!inner(domain, favicon_url)",
    )
    .eq("user_id", user.id)
    .gte("detected_at", since.toISOString())
    .order("detected_at", { ascending: false })
    .limit(limit);

  if (type) {
    query = query.eq("change_type", type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten joined fields
  const changes = (data ?? []).map((row) => {
    const company = row.tracked_companies as unknown as {
      domain: string;
      favicon_url: string | null;
    };
    return {
      ...row,
      domain: company?.domain,
      favicon_url: company?.favicon_url,
      tracked_companies: undefined,
    };
  });

  return NextResponse.json(changes);
}

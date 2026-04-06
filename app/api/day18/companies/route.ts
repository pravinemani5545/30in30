import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  addCompanySchema,
  extractDomain,
  normalizeUrl,
  faviconUrl,
} from "@/lib/day18/validations/tracker";

const MAX_COMPANIES = 20;

export async function GET() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tracked_companies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Normalize URL before validation
  if (typeof body.url === "string") {
    body.url = normalizeUrl(body.url);
  }

  const parsed = addCompanySchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues;
    return NextResponse.json(
      { error: issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  // Check limit
  const { count } = await supabase
    .from("tracked_companies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= MAX_COMPANIES) {
    return NextResponse.json(
      { error: `Watchlist limit reached (max ${MAX_COMPANIES})` },
      { status: 400 },
    );
  }

  const url = parsed.data.url;
  const domain = extractDomain(url);

  const { data, error } = await supabase
    .from("tracked_companies")
    .insert({
      user_id: user.id,
      url,
      domain,
      favicon_url: faviconUrl(domain),
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This URL is already on your watchlist" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

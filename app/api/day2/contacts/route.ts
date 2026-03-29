import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOptionalUser } from "@/lib/auth/guest";
import { CreateContactSchema } from "@/lib/day2/validations/contact";
import { extractLinkedInUsername } from "@/lib/day2/validations/enrich";

export async function GET(request: NextRequest) {
  try {
    const { user, supabase, isGuest } = await getOptionalUser();
    if (isGuest || !supabase) {
      return NextResponse.json({ contacts: [], total: 0 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0");

    let query = supabase
      .from("contacts")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && ["new", "contacted", "replied", "closed"].includes(status)) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,company_name.ilike.%${search}%,linkedin_username.ilike.%${search}%`
      );
    }

    const { data: contacts, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      contacts: contacts ?? [],
      total: count ?? 0,
      hasMore: offset + limit < (count ?? 0),
    });
  } catch (err) {
    console.error("[contacts GET]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = CreateContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { linkedin_url, full_name, notes } = parsed.data;

    const { data: contact, error } = await supabase
      .from("contacts")
      .insert({
        user_id: user.id,
        linkedin_url: linkedin_url.split("?")[0].replace(/\/$/, ""),
        linkedin_username: extractLinkedInUsername(linkedin_url),
        full_name: full_name ?? null,
        notes: notes ?? null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Contact with this LinkedIn URL already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ contact }, { status: 201 });
  } catch (err) {
    console.error("[contacts POST]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

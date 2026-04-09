import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { addProductSchema } from "@/lib/day31/validations/products";

const MAX_PRODUCTS = 50;

export async function GET() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("day31_tracked_products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = addProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  // Check product limit
  const { count } = await supabase
    .from("day31_tracked_products")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= MAX_PRODUCTS) {
    return NextResponse.json(
      { error: `Maximum ${MAX_PRODUCTS} products allowed` },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("day31_tracked_products")
    .insert({
      user_id: user.id,
      url: parsed.data.url,
      product_name: parsed.data.productName || null,
      target_price: parsed.data.targetPrice,
      frequency: parsed.data.frequency,
      notify_price_drop: parsed.data.notifyPriceDrop,
      notify_back_in_stock: parsed.data.notifyBackInStock,
      next_check_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You are already tracking this URL" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data }, { status: 201 });
}

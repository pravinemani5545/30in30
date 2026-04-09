import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { editProductSchema } from "@/lib/day31/validations/products";

export async function PATCH(
  request: Request,
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

  const body = await request.json();
  const parsed = editProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.targetPrice !== undefined)
    updateData.target_price = parsed.data.targetPrice;
  if (parsed.data.frequency !== undefined)
    updateData.frequency = parsed.data.frequency;
  if (parsed.data.notifyPriceDrop !== undefined)
    updateData.notify_price_drop = parsed.data.notifyPriceDrop;
  if (parsed.data.notifyBackInStock !== undefined)
    updateData.notify_back_in_stock = parsed.data.notifyBackInStock;
  if (parsed.data.productName !== undefined)
    updateData.product_name = parsed.data.productName;

  const { data, error } = await supabase
    .from("day31_tracked_products")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Product not found or not owned" },
      { status: 404 },
    );
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(
  _request: Request,
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

  const { error } = await supabase
    .from("day31_tracked_products")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

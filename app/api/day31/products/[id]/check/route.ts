import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { processProductCheck } from "@/lib/day31/extractor/process";
import type { TrackedProduct } from "@/types/day31";

export const maxDuration = 60;

export async function POST(
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

  // Fetch product and verify ownership
  const { data: product, error } = await supabase
    .from("day31_tracked_products")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 },
    );
  }

  // Rate limit: 1 check per product per 5 minutes
  if (product.last_check_at) {
    const lastCheck = new Date(product.last_check_at).getTime();
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    if (lastCheck > fiveMinAgo) {
      return NextResponse.json(
        { error: "Please wait 5 minutes between checks" },
        { status: 429 },
      );
    }
  }

  const summary = await processProductCheck(product as TrackedProduct, supabase);

  // Refetch updated product
  const { data: updated } = await supabase
    .from("day31_tracked_products")
    .select("*")
    .eq("id", id)
    .single();

  return NextResponse.json({ product: updated, check: summary });
}

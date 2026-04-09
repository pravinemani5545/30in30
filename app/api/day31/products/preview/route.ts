import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchProductPage } from "@/lib/day31/extractor/fetch";
import { cleanHtml } from "@/lib/day31/extractor/clean";
import { extractPriceData } from "@/lib/day31/ai/gemini";

export const maxDuration = 60;

export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    return NextResponse.json({ error: "Valid URL required" }, { status: 400 });
  }

  const { html, error: fetchError } = await fetchProductPage(url);

  if (fetchError || !html) {
    return NextResponse.json(
      { error: fetchError || "Could not fetch page" },
      { status: 422 },
    );
  }

  const cleaned = cleanHtml(html);

  if (!cleaned) {
    return NextResponse.json(
      {
        productName: null,
        currentPrice: null,
        availability: "unknown" as const,
        isJsRendered: true,
      },
      { status: 200 },
    );
  }

  const result = await extractPriceData(cleaned);

  return NextResponse.json({
    productName: result.product_name,
    currentPrice: result.price,
    availability: result.availability,
    currency: result.currency,
    isJsRendered: false,
  });
}

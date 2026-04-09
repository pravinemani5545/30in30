import type { FetchResult } from "./fetch";

/**
 * Extract product ID and locale from a Best Buy Canada URL.
 * Patterns:
 *   bestbuy.ca/en-ca/product/some-slug/18169714
 *   bestbuy.ca/fr-ca/product/some-slug/18169714
 */
function extractBestBuyCAProductId(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("bestbuy.ca")) return null;
    const match = u.pathname.match(/\/product\/[^/]+\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Fetch product data from Best Buy Canada's public JSON API.
 * Returns synthetic HTML that the AI extractor can parse.
 */
export async function bestbuyCAFetch(url: string): Promise<FetchResult> {
  const skuId = extractBestBuyCAProductId(url);
  if (!skuId) {
    return { html: "", error: "Could not extract Best Buy CA product ID from URL" };
  }

  try {
    const apiUrl = `https://www.bestbuy.ca/api/v2/json/product/${skuId}`;
    const res = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return { html: "", error: `Best Buy API returned ${res.status}` };
    }

    const data = await res.json();

    // Build synthetic HTML from the API response for the AI extractor
    const availability = data.availability;
    const inStock =
      availability?.isAvailableOnline ||
      availability?.onlineAvailability === "InStock";

    const html = `
      <div class="product-page" data-sku="${data.sku}">
        <h1 itemprop="name">${data.name || ""}</h1>
        <div itemprop="brand">${data.brandName || ""}</div>
        <div class="price" data-price="${data.salePrice ?? data.regularPrice}">
          <span class="current-price">$${(data.salePrice ?? data.regularPrice)?.toFixed(2)}</span>
          ${data.isProductOnSale && data.regularPrice !== data.salePrice ? `<span class="regular-price">$${data.regularPrice?.toFixed(2)}</span>` : ""}
        </div>
        <div class="availability">${inStock ? "In Stock" : "Out of Stock"}</div>
        <div class="category">${data.categoryName || ""}</div>
      </div>
    `;

    return { html };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Best Buy API fetch failed";
    return { html: "", error: message };
  }
}

/**
 * Check if a URL is a Best Buy Canada product page.
 */
export function isBestBuyCA(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname.includes("bestbuy.ca");
  } catch {
    return false;
  }
}

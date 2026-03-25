import type { RawProfileData } from "@/types/day2";
import { normalizeApolloResponse } from "@/lib/day2/enrichment/normalize";

const APOLLO_API_URL = "https://api.apollo.io/api/v1/people/match";

export class ApolloCreditsExhaustedError extends Error {
  constructor() {
    super("Apollo credits exhausted");
    this.name = "ApolloCreditsExhaustedError";
  }
}

export class ApolloNoMatchError extends Error {
  constructor() {
    super("No matching profile found in Apollo database");
    this.name = "ApolloNoMatchError";
  }
}

export async function fetchApolloProfile(
  linkedinUrl: string,
  apiKey: string
): Promise<RawProfileData | null> {
  const startedAt = Date.now();

  // Normalize URL: ensure https://www.linkedin.com/in/username format
  const normalizedUrl = linkedinUrl.startsWith("https://www.")
    ? linkedinUrl
    : linkedinUrl.replace("https://linkedin.com/", "https://www.linkedin.com/");

  const body = {
    api_key: apiKey,
    linkedin_url: normalizedUrl,
    reveal_personal_emails: false,
    reveal_phone_number: false,
  };

  let res: Response;

  try {
    res = await fetch(APOLLO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        // Pass key in header too — newer Apollo API prefers this
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Network error";
    console.error("[apollo] Request failed:", msg);
    throw new Error(`Apollo request failed: ${msg}`);
  }

  const duration = Date.now() - startedAt;

  if (res.status === 402) {
    console.warn("[apollo] Credits exhausted (402)", { duration });
    throw new ApolloCreditsExhaustedError();
  }

  if (res.status === 429) {
    console.warn("[apollo] Rate limited (429), retrying in 1s");
    await new Promise((r) => setTimeout(r, 1000));

    const retry = await fetch(APOLLO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    if (!retry.ok) {
      throw new Error(`Apollo retry failed with status ${retry.status}`);
    }

    res = retry;
  }

  // Log response body on any error for debugging
  if (!res.ok) {
    let errorBody = "";
    try {
      errorBody = await res.text();
    } catch {
      errorBody = "(could not read body)";
    }
    console.error("[apollo] Error response:", { status: res.status, body: errorBody, duration });

    if (res.status >= 500) {
      throw new Error(`Apollo server error: ${res.status}`);
    }

    // 422 = unprocessable (bad URL format, no match, or validation error)
    // 401/403 = auth issue
    // In all non-5xx cases: fall through to manual paste
    return null;
  }

  const data = await res.json() as { person?: Record<string, unknown> | null };

  if (!data.person) {
    console.info("[apollo] No match found", { duration });
    return null;
  }

  console.info("[apollo] Match found", { duration, success: true });
  return normalizeApolloResponse(data.person as Parameters<typeof normalizeApolloResponse>[0]);
}

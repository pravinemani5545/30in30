import type { RawProfileData } from "@/types";
import { normalizeApolloResponse } from "@/lib/enrichment/normalize";

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

  const body = {
    api_key: apiKey,
    linkedin_url: linkedinUrl,
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
    // Rate limited — retry once after 1s
    console.warn("[apollo] Rate limited (429), retrying in 1s");
    await new Promise((r) => setTimeout(r, 1000));

    const retry = await fetch(APOLLO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    if (!retry.ok) {
      throw new Error(`Apollo retry failed with status ${retry.status}`);
    }

    res = retry;
  }

  if (res.status >= 500) {
    console.error("[apollo] Server error:", res.status);
    throw new Error(`Apollo server error: ${res.status}`);
  }

  if (!res.ok) {
    console.error("[apollo] Unexpected status:", res.status);
    throw new Error(`Apollo unexpected status: ${res.status}`);
  }

  const data = await res.json() as { person?: Record<string, unknown> | null };

  if (!data.person) {
    console.info("[apollo] No match found", { duration });
    return null;
  }

  console.info("[apollo] Match found", { duration, success: true });
  return normalizeApolloResponse(data.person as Parameters<typeof normalizeApolloResponse>[0]);
}

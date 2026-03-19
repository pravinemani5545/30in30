import type { RawProfileData } from "@/types";
import { getMockProfileData } from "@/lib/enrichment/providers/mock";
import {
  fetchApolloProfile,
  ApolloCreditsExhaustedError,
} from "@/lib/enrichment/providers/apollo";

export type EnrichmentProviderResult =
  | { data: RawProfileData; creditsConsumed: boolean }
  | { requiresManualPaste: true; creditsRemaining: number };

export async function enrichProfile(
  linkedinUrl: string,
  creditsRemaining: number,
  apiKey: string | undefined,
  provider: "apollo" | "mock"
): Promise<EnrichmentProviderResult> {
  // Mock provider (dev/demo only)
  if (provider === "mock" || !apiKey) {
    const data = getMockProfileData();
    return { data, creditsConsumed: false };
  }

  // No credits left — skip Apollo
  if (creditsRemaining <= 0) {
    return { requiresManualPaste: true, creditsRemaining: 0 };
  }

  try {
    const data = await fetchApolloProfile(linkedinUrl, apiKey);

    if (!data) {
      // Apollo returned no match — fall through to manual paste
      return { requiresManualPaste: true, creditsRemaining };
    }

    return { data, creditsConsumed: true };
  } catch (err) {
    if (err instanceof ApolloCreditsExhaustedError) {
      return { requiresManualPaste: true, creditsRemaining: 0 };
    }
    throw err;
  }
}

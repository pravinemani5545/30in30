import { createSupabaseServer } from "@/lib/supabase/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

type AuthResult =
  | { user: User; supabase: SupabaseClient; isGuest: false }
  | { user: null; supabase: null; isGuest: true };

/**
 * Optional auth — returns the user if logged in, or null for guests.
 * Never throws; never returns 401.
 */
export async function getOptionalUser(): Promise<AuthResult> {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return { user, supabase, isGuest: false };
    }
    return { user: null, supabase: null, isGuest: true };
  } catch {
    return { user: null, supabase: null, isGuest: true };
  }
}

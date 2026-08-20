import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./env";

let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Anonymous reader for the public site. Carries no session, so row-level
 * security applies the `is_published` filter for us and the same instance can
 * be shared across renders and reused at build time.
 *
 * Returns null when Supabase is not configured; callers fall back to the
 * bundled content.
 */
export function publicClient() {
  if (!isSupabaseConfigured) return null;

  cached ??= createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}

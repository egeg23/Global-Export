import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Returns the signed-in administrator, or sends the visitor to the login page.
 *
 * Uses `getUser()` rather than `getSession()`: the session is read straight
 * from a cookie, which the browser controls, while `getUser()` verifies the
 * token with Supabase. The database enforces the same rule independently — the
 * write policies check an allowlist — so a forged cookie gets a visitor as far
 * as an empty panel and no further.
 */
export async function requireAdmin(): Promise<User> {
  if (!isSupabaseConfigured) redirect("/admin/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return user;
}

/** Non-redirecting variant, for the login page's "already signed in" check. */
export async function currentAdmin(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "./types";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./env";

/**
 * Rotates the Supabase auth cookies for an admin request and passes it on.
 *
 * Access tokens are short-lived; without this the panel would sign the owner
 * out roughly every hour. `getUser()` is what triggers the refresh — it
 * verifies the token with the auth server rather than trusting what the cookie
 * claims — and the rotated pair is written onto the response here, which is
 * the only place in the request lifecycle that can set cookies.
 *
 * Note that this only keeps the session alive. Whether the request is allowed
 * is decided in the admin layout, on the server, against a verified user.
 */
export async function refreshSession(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Supabase asks for these so no CDN caches a response carrying one
        // visitor's session cookies.
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

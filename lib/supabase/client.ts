"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./types";
import { supabaseKey, supabaseUrl } from "./env";

/**
 * Browser client. Only the login form and the media uploader use it directly —
 * everything else goes through server actions, so the anon key never has to do
 * more than sign in and stream a file into storage.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}

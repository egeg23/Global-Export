import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "./types";
import { supabaseKey, supabaseUrl } from "./env";

/**
 * Потолок ожидания ответа базы.
 *
 * Спящий проект Supabase не отвечает отказом — он молчит, и без этого предела
 * страница панели ждала бы его больше десяти секунд, чтобы всё равно
 * отрисоваться пустой. Восемь секунд с запасом покрывают холодный старт после
 * пробуждения и при этом не превращают недоступную базу в зависшую вкладку.
 */
const DB_TIMEOUT_MS = 8000;

/**
 * Request-scoped client that reads and writes the auth cookies. Use it in the
 * admin panel — anything that needs to know who is signed in.
 *
 * A new client per request, never a module-level singleton: sharing one would
 * leak one visitor's session into the next request's render.
 */
export async function createClient() {
  const store = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            store.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. The proxy refreshes the
          // session on every admin request, so the write is already covered.
        }
      },
    },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, signal: AbortSignal.timeout(DB_TIMEOUT_MS) }),
    },
  });
}

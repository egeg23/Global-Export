import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { isShowcase, showcaseAccount } from "@/lib/showcase";

import type { Database } from "./types";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./env";

/**
 * Сколько ждём сервер авторизации, прежде чем открыть панель без сеанса.
 *
 * Проект Supabase на бесплатном тарифе засыпает после недели простоя. Клиент
 * считает такую ошибку временной и повторяет запрос с нарастающей паузой —
 * десяток повторов складывается в полминуты ожидания ради результата, который
 * не изменится. Панель в этом случае должна быстро открыться пустой и сказать
 * об этом, а не держать посетителя на белом экране.
 */
const AUTH_TIMEOUT_MS = 3000;

/**
 * Ограничивает ожидание целиком, а не каждую отдельную попытку.
 *
 * Брошенный запрос продолжает выполняться и, если всё же завершится, допишет
 * свои cookie в уже отправленный ответ — то есть просто пропадёт. Следующий
 * запрос попробует снова, и это дешевле, чем задержка на каждой странице.
 */
async function withDeadline<T>(work: Promise<T>, ms: number): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      work,
      new Promise<null>((resolve) => {
        timer = setTimeout(() => resolve(null), ms);
      }),
    ]);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

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
 *
 * На демонстрационной площадке здесь же происходит вход: если сеанса нет,
 * запрос подписывается общей демо-учёткой. Это единственное место в жизни
 * запроса, которое умеет писать cookie, поэтому вход делается один раз, а не
 * на каждой странице панели.
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
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, signal: AbortSignal.timeout(AUTH_TIMEOUT_MS) }),
    },
  });

  // Недоступный сервер авторизации не должен ронять запрос: страница откроется
  // без сеанса, а панель сама скажет, что базы нет.
  const result = await withDeadline(supabase.auth.getUser(), AUTH_TIMEOUT_MS);

  if (isShowcase && !result?.data.user) {
    await withDeadline(
      supabase.auth.signInWithPassword({
        email: showcaseAccount.email,
        password: showcaseAccount.password,
      }),
      AUTH_TIMEOUT_MS,
    );
  }

  return response;
}

import type { ShowcaseId } from "@/lib/showcase/access";

/**
 * Коды на 24 часа к закрытым витринам — пять цифр.
 *
 * Владелец, 06.10.2026: «Сделай пароль из 5 цифр на 24 часа к Golden House и
 * MAVERA. Через 24 часа пароль не подходит уже».
 *
 * Пять цифр — сто тысяч вариантов: отпечаток такого кода в публичном
 * репозитории перебирается за секунды. Поэтому коды живут не здесь, а в базе
 * студии DevUz (Supabase, таблица `showcase_codes`, закрыта для чтения), а
 * витрина спрашивает функцию `showcase_code_check`: живой ли код и до какого
 * времени. Функция же держит предел перебора — 30 неудачных попыток в час на
 * витрину, дальше «нет» на всё. Код выдают в базе студии (миграция 0091 в
 * репозитории egeg23/DevUZ-perfect-).
 *
 * Ключ ниже — публичный (publishable) ключ базы студии: он и предназначен для
 * браузера, права у него — только вызвать эту функцию; таблицы кодов он не
 * читает.
 */

const STUDIO_DB = "https://owbkqoyutubqujdazdcc.supabase.co";
const STUDIO_PUBLIC_KEY = "sb_publishable_7_JGqUZVlouYkzERQjQE6A_HihdkEgd";

/** Подтверждённый код не спрашиваем у базы чаще раза в 10 минут. */
const CACHE_MS = 10 * 60_000;
const cache = new Map<string, { expires: number; checkedAt: number }>();

/** Пять цифр — код на время; пробелы при вводе не важны. */
export function timedDigits(raw: string): string | null {
  const digits = raw.replace(/\s+/g, "");
  return /^\d{5}$/.test(digits) ? digits : null;
}

/** До какого момента код подходит, или null — не подходит (нет, истёк, предел попыток, база молчит). */
export async function timedCodeExpiry(id: ShowcaseId, raw: string, now = Date.now()): Promise<Date | null> {
  const code = timedDigits(raw);
  if (!code) return null;

  const key = `${id}:${code}`;
  const hit = cache.get(key);
  if (hit && now - hit.checkedAt < CACHE_MS) return hit.expires > now ? new Date(hit.expires) : null;

  try {
    const response = await fetch(`${STUDIO_DB}/rest/v1/rpc/showcase_code_check`, {
      method: "POST",
      headers: { apikey: STUDIO_PUBLIC_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ p_showcase: id, p_code: code }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const value: unknown = await response.json();
    const expires = typeof value === "string" ? Date.parse(value) : Number.NaN;
    if (!Number.isFinite(expires) || expires <= now) {
      cache.delete(key);
      return null;
    }
    cache.set(key, { expires, checkedAt: now });
    return new Date(expires);
  } catch {
    return null;
  }
}

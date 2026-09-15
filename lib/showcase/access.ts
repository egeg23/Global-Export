/**
 * Код доступа к витрине MAVERA.
 *
 * Единственная защита, которая по-настоящему работает: кто не знает кода, тот
 * не видит ни макетов, ни разметки, ни скриптов. Всё, что уже попало в
 * браузер, скопировать можно всегда — поэтому граница стоит до отдачи.
 *
 * Код задаётся в `.env.local` строкой `SHOWCASE_ACCESS_CODE=`; без неё
 * действует встроенный, `off` открывает витрину всем. Куки — HMAC от кода,
 * а не сам код: сменили код — старые куки перестали подходить.
 *
 * Работает и в прокси, и в серверной функции: только Web Crypto, никаких
 * модулей Node.
 */

export const ACCESS_COOKIE = "showcase_access";

/** 60 дней: ссылка живёт столько, сколько идёт обсуждение с заказчиком. */
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 60;

const DEFAULT_CODE = "mavera-2026";

/** Что закрыто кодом. Страница ввода кода — исключение, иначе замкнётся. */
const GATED = ["/mavera"];
const OPEN = ["/mavera/access"];

function under(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isGated(pathname: string): boolean {
  if (OPEN.some((prefix) => under(pathname, prefix))) return false;
  return GATED.some((prefix) => under(pathname, prefix));
}

/** Действующий код или null, если витрина открыта. */
export function accessCode(): string | null {
  const value = process.env.SHOWCASE_ACCESS_CODE?.trim();
  if (value === "off") return null;
  return value || DEFAULT_CODE;
}

async function hmac(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Значение куки для данного кода. */
export async function accessToken(code: string): Promise<string> {
  const secret = process.env.SHOWCASE_ACCESS_SECRET?.trim() || `${code}::globalex-showcase`;
  return hmac(secret, "showcase-access-v1");
}

/** Сравнение за постоянное время: длина ответа не выдаёт, где разошлось. */
export function sameSecret(given: string, expected: string): boolean {
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function verifyToken(token: string | undefined, code: string): Promise<boolean> {
  if (!token) return false;
  return sameSecret(token, await accessToken(code));
}

/** Куда вернуть после ввода кода: только свой относительный адрес. */
export function safeNext(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/mavera";
  return value;
}

export const accessCookie = (value: string) => ({
  name: ACCESS_COOKIE,
  value,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ACCESS_MAX_AGE,
});

/**
 * Коды доступа к закрытым витринам.
 *
 * Единственная защита, которая по-настоящему работает: кто не знает кода, тот
 * не видит ни макетов, ни разметки, ни скриптов. Всё, что уже попало в
 * браузер, скопировать можно всегда — поэтому граница стоит до отдачи.
 *
 * Витрин теперь несколько, и у каждой свой код, своя куки и своя переменная
 * окружения: ссылка, отданная одному заказчику, не должна открывать макет
 * другого. Код задаётся в `.env.local`; без переменной действует встроенный,
 * `off` открывает витрину всем. Куки — HMAC от кода, а не сам код: сменили
 * код — старые куки перестали подходить.
 *
 * Работает и в прокси, и в серверной функции: только Web Crypto, никаких
 * модулей Node.
 */

export type ShowcaseId = "mavera" | "gh";

type Showcase = {
  id: ShowcaseId;
  /** Корень витрины в адресе. */
  prefix: string;
  /** Страница ввода кода — единственное, что открыто внутри витрины. */
  gate: string;
  cookie: string;
  codeEnv: string;
  secretEnv: string;
  /**
   * Что подписывается ключом. У MAVERA строка без суффикса — она первая, и
   * менять её нельзя: ссылки с уже выданным кодом перестали бы работать.
   */
  message: string;
  fallback: string;
  /** Как витрина называется на странице ввода кода. */
  label: string;
  intro: string;
};

export const showcases: Showcase[] = [
  {
    id: "mavera",
    prefix: "/mavera",
    gate: "/mavera/access",
    cookie: "showcase_access",
    codeEnv: "SHOWCASE_ACCESS_CODE",
    secretEnv: "SHOWCASE_ACCESS_SECRET",
    message: "showcase-access-v1",
    fallback: "mavera-2026",
    label: "MAVERA",
    intro:
      "Три варианта сайта, панель управления и смета показываются по коду. Код есть в ссылке, которую вам отправили; если ссылка без кода — введите его вручную.",
  },
  {
    id: "gh",
    prefix: "/gh",
    gate: "/gh/access",
    cookie: "showcase_gh_access",
    codeEnv: "GH_ACCESS_CODE",
    secretEnv: "GH_ACCESS_SECRET",
    message: "showcase-access-v1:gh",
    fallback: "golden-2026",
    label: "Golden House",
    intro:
      "Макет главной страницы и панель управления показываются по коду. Код есть в ссылке, которую вам отправили; если ссылка без кода — введите его вручную.",
  },
];

/** 60 дней: ссылка живёт столько, сколько идёт обсуждение с заказчиком. */
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 60;

function under(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Витрина, которой принадлежит адрес, или null для страницы ввода кода. */
export function showcaseFor(pathname: string): Showcase | null {
  for (const showcase of showcases) {
    if (under(pathname, showcase.gate)) return null;
    if (under(pathname, showcase.prefix)) return showcase;
  }
  return null;
}

/** Витрина по имени — для страницы ввода кода и разбора адреса возврата. */
export function showcaseById(id: ShowcaseId): Showcase {
  return showcases.find((showcase) => showcase.id === id) ?? showcases[0];
}

/** Какой витрине принадлежит адрес возврата после формы. */
export function showcaseOfNext(next: string): Showcase {
  return showcases.find((showcase) => under(next, showcase.prefix)) ?? showcases[0];
}

export function isGated(pathname: string): boolean {
  return showcaseFor(pathname) !== null;
}

/** Действующий код или null, если витрина открыта. */
export function accessCode(showcase: Showcase): string | null {
  const value = process.env[showcase.codeEnv]?.trim();
  if (value === "off") return null;
  return value || showcase.fallback;
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
export async function accessToken(showcase: Showcase, code: string): Promise<string> {
  const secret = process.env[showcase.secretEnv]?.trim() || `${code}::globalex-showcase`;
  return hmac(secret, showcase.message);
}

/** Сравнение за постоянное время: длина ответа не выдаёт, где разошлось. */
export function sameSecret(given: string, expected: string): boolean {
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function verifyToken(
  showcase: Showcase,
  token: string | undefined,
  code: string,
): Promise<boolean> {
  if (!token) return false;
  return sameSecret(token, await accessToken(showcase, code));
}

/** Куда вернуть после ввода кода: только свой относительный адрес. */
export function safeNext(showcase: Showcase, value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return showcase.prefix;
  }
  return value;
}

export const accessCookie = (showcase: Showcase, value: string) => ({
  name: showcase.cookie,
  value,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ACCESS_MAX_AGE,
});

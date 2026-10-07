/**
 * Доступ к закрытым витринам: MAVERA, Golden House и Engelberg — по коду.
 *
 * Владелец, 06.10.2026: «Закрой кодом доступ к сайту MAVERA», затем «У
 * golden house тоже закрой кодом». С 23.09 по 06.10 обе были открыты всем.
 * Engelberg (engelberg-window.com) закрыт кодом с первого дня: макет до
 * договора.
 *
 * У каждой витрины свой код, своя куки и своя переменная на сервере:
 * ссылка, отданная одному заказчику, не открывает макет другого.
 *
 * Как устроен код. Репозиторий публичный, поэтому самих кодов в нём нет —
 * только отпечатки (`hash`): SHA-256 от ключа, который выводится из кода
 * через PBKDF2 (100 000 раундов, своя соль у каждой витрины). По отпечатку
 * код не восстановить, а перебор упирается в PBKDF2. Сами коды знают
 * владелец и менеджеры студии.
 *
 * Код на сервере можно сменить без правки кода — переменной из `codeEnv` в
 * `.env.local` (`MAVERA_ACCESS_CODE`, `GOLDEN_ACCESS_CODE`,
 * `ENGELBERG_ACCESS_CODE`): тогда действует
 * она, а встроенный отпечаток — нет; `off` открывает витрину всем. Сменили
 * код — все выданные куки перестают подходить: в куки лежит ключ, выведенный
 * из кода. Имена переменных новые намеренно: старые `SHOWCASE_ACCESS_CODE` и
 * `GH_ACCESS_CODE` могли остаться на сервере с прошлыми кодами (они есть в
 * открытой истории репозитория), и прошлый код не должен снова открыть
 * витрину.
 *
 * Граница стоит в прокси, до отдачи разметки: кто не знает кода, не видит ни
 * макетов, ни разметки, ни скриптов. Всё, что уже попало в браузер,
 * скопировать можно всегда.
 *
 * Кроме постоянных кодов — короткие коды из базы студии: пять цифр на 24 часа
 * (владелец, 06.10.2026) и пароль из четырёх цифр к Engelberg (07.10.2026), см.
 * lib/showcase/timed.ts.
 *
 * Работает и в прокси, и в серверной функции: только Web Crypto и fetch.
 */

import { timedCodeExpiry, timedDigits } from "@/lib/showcase/timed";

export type ShowcaseId = "mavera" | "gh" | "engelberg";

export type Showcase = {
  id: ShowcaseId;
  /** Корень витрины в адресе. */
  prefix: string;
  /** Страница ввода кода. */
  gate: string;
  label: string;
  intro: string;
  /** Куки с ключом доступа — своя у каждой витрины. */
  cookie: string;
  /** Переменная на сервере, которой код меняют без правки кода. */
  codeEnv: string;
  /** Соль PBKDF2 — своя у каждой витрины. */
  salt: string;
  /**
   * Отпечаток встроенного постоянного кода. Сам код в репозиторий не
   * кладётся. null — постоянного кода нет, пускает только пароль из базы
   * студии (lib/showcase/timed.ts).
   */
  hash: string | null;
};

export const showcases: Showcase[] = [
  {
    id: "mavera",
    prefix: "/mavera",
    gate: "/mavera/access",
    label: "MAVERA",
    intro:
      "Три варианта сайта, панель управления и смета показываются по паролю. Введите пароль, который вам дал менеджер DevUz Studio.",
    cookie: "showcase_pass",
    codeEnv: "MAVERA_ACCESS_CODE",
    salt: "globalex:mavera:access:v2",
    hash: "9bc7fd9dd70a6f8326e6ed7c44e52b2d212504c39a476b399f2ead92c64d96f7",
  },
  {
    id: "gh",
    prefix: "/gh",
    gate: "/gh/access",
    label: "Golden House",
    intro:
      "Макет главной страницы и панель управления показываются по паролю. Введите пароль, который вам дал менеджер DevUz Studio.",
    cookie: "showcase_gh_pass",
    codeEnv: "GOLDEN_ACCESS_CODE",
    salt: "globalex:gh:access:v2",
    hash: "11f4cdb3eb7ae8fe790357ea0d7e3cf19e7419d760d5938a59c5d174d64206aa",
  },
  {
    id: "engelberg",
    prefix: "/engelberg",
    gate: "/engelberg/access",
    label: "Engelberg",
    intro:
      "Макет сайта Engelberg показывается по паролю. Введите пароль, который вам дал менеджер DevUz Studio.",
    cookie: "showcase_engelberg_pass",
    codeEnv: "ENGELBERG_ACCESS_CODE",
    salt: "globalex:engelberg:access:v1",
    hash: null,
  },
];

/** Параметр, в котором код приходит в ссылке. */
export const KEY_PARAM = "key";

/** 60 дней: ссылка живёт столько, сколько идёт обсуждение с заказчиком. */
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 60;

const KDF_ROUNDS = 100_000;

function under(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Витрина, которой принадлежит адрес, — вместе со страницей кода. */
export function showcaseFor(pathname: string): Showcase | null {
  return showcases.find((showcase) => under(pathname, showcase.prefix)) ?? null;
}

export function showcaseById(id: ShowcaseId): Showcase {
  return showcases.find((showcase) => showcase.id === id) ?? showcases[0];
}

/** Страница ввода кода. */
export function isGate(showcase: Showcase, pathname: string): boolean {
  return under(pathname, showcase.gate);
}

/**
 * Код как его вводят люди: регистр и пробелы не важны — «gh-7q4k-…» из
 * сообщения и «GH 7Q4K …» с клавиатуры одно и то же.
 */
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "-");
}

const hex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");

/** Ключ доступа из кода — он же значение куки. */
export async function accessKey(showcase: Showcase, code: string): Promise<string> {
  const encoder = new TextEncoder();
  const material = await crypto.subtle.importKey("raw", encoder.encode(normalizeCode(code)), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(showcase.salt), iterations: KDF_ROUNDS },
    material,
    256,
  );
  return hex(bits);
}

async function sha256(value: string): Promise<string> {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

/** Сравнение за постоянное время: длина ответа не выдаёт, где разошлось. */
export function sameSecret(given: string, expected: string): boolean {
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

const envHashes = new Map<ShowcaseId, { code: string; hash: string }>();

/** Код снят на сервере (`off` в переменной витрины) — витрина открыта всем. */
function isOpen(showcase: Showcase): boolean {
  return process.env[showcase.codeEnv]?.trim() === "off";
}

/**
 * Отпечаток действующего постоянного кода: из переменной витрины, если она
 * задана на сервере, иначе встроенный. null — постоянного кода нет.
 */
async function expectedHash(showcase: Showcase): Promise<string | null> {
  const env = process.env[showcase.codeEnv]?.trim();
  if (!env || env === "off") return showcase.hash;
  const cached = envHashes.get(showcase.id);
  if (cached?.code === env) return cached.hash;
  const hash = await sha256(await accessKey(showcase, env));
  envHashes.set(showcase.id, { code: env, hash });
  return hash;
}

/** Закрыта ли витрина сейчас. */
export async function isLocked(showcase: Showcase): Promise<boolean> {
  return !isOpen(showcase);
}

/** Подходит ли ключ из куки этой витрины. */
export async function verifyKey(showcase: Showcase, key: string | undefined): Promise<boolean> {
  if (isOpen(showcase)) return true;
  const hash = await expectedHash(showcase);
  if (hash === null) return false;
  if (!key || !/^[0-9a-f]{64}$/.test(key)) return false;
  return sameSecret(await sha256(key), hash);
}

/** Проверить введённый код. Подошёл — ключ для куки, нет — null. */
export async function checkCode(showcase: Showcase, code: string): Promise<string | null> {
  if (!code.trim()) return null;
  const key = await accessKey(showcase, code);
  return (await verifyKey(showcase, key)) ? key : null;
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

/** Куки с кодом на 24 часа — отдельная от постоянной. */
export const timedCookieName = (showcase: Showcase) => `${showcase.cookie}_t`;

export type Grant = { name: string; value: string; maxAge: number };

/**
 * Пустить по коду: постоянный код студии (длинный, отпечаток здесь) или код
 * на 24 часа (пять цифр, база студии — lib/showcase/timed.ts). Подошёл —
 * какую куки поставить; куки кода на 24 часа живёт ровно до конца его срока.
 */
export async function grantFor(showcase: Showcase, raw: string, now = Date.now()): Promise<Grant | null> {
  const digits = timedDigits(raw);
  if (digits) {
    const expires = await timedCodeExpiry(showcase.id, digits, now);
    if (expires) {
      // Куки живёт до конца срока кода, но не дольше постоянной — у долгих
      // паролей срок в годах.
      const left = Math.floor((expires.getTime() - now) / 1000);
      return { name: timedCookieName(showcase), value: digits, maxAge: Math.max(1, Math.min(left, ACCESS_MAX_AGE)) };
    }
  }
  // Не код на 24 часа — значит, постоянный: пять цифр могут оказаться и им.
  const key = await checkCode(showcase, raw);
  return key ? { name: showcase.cookie, value: key, maxAge: ACCESS_MAX_AGE } : null;
}

/** Есть ли доступ по куки: постоянный ключ или ещё живой код на 24 часа. */
export async function hasAccess(showcase: Showcase, cookie: (name: string) => string | undefined): Promise<boolean> {
  if (await verifyKey(showcase, cookie(showcase.cookie))) return true;
  const timed = cookie(timedCookieName(showcase));
  return Boolean(timed && (await timedCodeExpiry(showcase.id, timed)));
}

export const grantCookie = (grant: Grant) => ({
  name: grant.name,
  value: grant.value,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: grant.maxAge,
});

/**
 * Куда вести после кода: адрес из `next`, если он свой — относительный,
 * внутри этой витрины и не сама страница кода, — иначе корень витрины. Чужой
 * адрес в `next` превратил бы переадресацию в открытый редирект.
 */
export function returnTo(showcase: Showcase, next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return showcase.prefix;
  }
  let url: URL;
  try {
    url = new URL(next, "http://showcase.local");
  } catch {
    return showcase.prefix;
  }
  if (url.origin !== "http://showcase.local") return showcase.prefix;
  if (!under(url.pathname, showcase.prefix) || isGate(showcase, url.pathname)) return showcase.prefix;
  url.searchParams.delete(KEY_PARAM);
  return `${url.pathname}${url.search}${url.hash}`;
}

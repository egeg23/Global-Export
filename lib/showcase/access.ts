/**
 * Доступ к витринам застройщиков: MAVERA и Golden House.
 *
 * MAVERA — по коду. Владелец, 06.10.2026: «Закрой кодом доступ к сайту
 * MAVERA». Golden House открыта всем, у кого есть ссылка, как и вся
 * витрина с 23.09.2026.
 *
 * Как устроен код. Репозиторий публичный, поэтому самого кода в нём нет —
 * только отпечаток (`MAVERA_ACCESS_HASH`): SHA-256 от ключа, который
 * выводится из кода через PBKDF2 (100 000 раундов). По отпечатку код не
 * восстановить, а перебор упирается в PBKDF2. Сам код знают владелец и
 * менеджеры студии.
 *
 * Код на сервере можно сменить без правки кода: `MAVERA_ACCESS_CODE` в
 * `.env.local` — тогда действует он, а встроенный отпечаток — нет; `off`
 * открывает витрину всем. Сменили код — все выданные куки перестают
 * подходить: в куки лежит ключ, выведенный из кода. Переменная новая
 * намеренно: старая `SHOWCASE_ACCESS_CODE` могла остаться на сервере с
 * прошлым кодом, и он не должен снова открыть витрину.
 *
 * Граница стоит в прокси, до отдачи разметки: кто не знает кода, не видит ни
 * макетов, ни разметки, ни скриптов. Всё, что уже попало в браузер,
 * скопировать можно всегда.
 *
 * Старые ссылки Golden House (`/gh?key=…`, `/gh/access?next=…`) приводят на
 * ту же страницу витрины.
 *
 * Работает и в прокси, и в серверной функции: только Web Crypto.
 */

export type ShowcaseId = "mavera" | "gh";

type Showcase = {
  id: ShowcaseId;
  /** Корень витрины в адресе. */
  prefix: string;
  /** Страница ввода кода; у открытой витрины — только переадресация. */
  gate: string;
  /** Закрыта кодом. */
  locked: boolean;
  label: string;
  intro: string;
};

export const showcases: Showcase[] = [
  {
    id: "mavera",
    prefix: "/mavera",
    gate: "/mavera/access",
    locked: true,
    label: "MAVERA",
    intro:
      "Три варианта сайта, панель управления и смета показываются по коду. Код есть в ссылке, которую вам отправили; если ссылка без кода — введите его вручную или запросите у менеджера DevUz Studio.",
  },
  { id: "gh", prefix: "/gh", gate: "/gh/access", locked: false, label: "Golden House", intro: "" },
];

/** Параметр, в котором код приходит в ссылке. */
export const KEY_PARAM = "key";
/** Старое имя — у открытых витрин ключ из адреса просто убирается. */
export const LEGACY_KEY_PARAM = KEY_PARAM;

/** Куки с ключом доступа к MAVERA. */
export const ACCESS_COOKIE = "showcase_access";
/** 60 дней: ссылка живёт столько, сколько идёт обсуждение с заказчиком. */
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 60;

/** Отпечаток встроенного кода MAVERA. Сам код в репозиторий не кладётся. */
export const MAVERA_ACCESS_HASH = "9bc7fd9dd70a6f8326e6ed7c44e52b2d212504c39a476b399f2ead92c64d96f7";

const KDF_SALT = "globalex:mavera:access:v2";
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
 * Код как его вводят люди: регистр и пробелы не важны — «mav-7q4k-…» из
 * сообщения и «MAV 7Q4K …» с клавиатуры одно и то же.
 */
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "-");
}

const hex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");

/** Ключ доступа из кода — он же значение куки. */
export async function accessKey(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const material = await crypto.subtle.importKey("raw", encoder.encode(normalizeCode(code)), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(KDF_SALT), iterations: KDF_ROUNDS },
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

let envHash: { code: string; hash: string } | null = null;

/**
 * Действующий отпечаток или null, если витрина открыта: код из
 * `MAVERA_ACCESS_CODE`, если он задан на сервере, иначе встроенный.
 */
async function expectedHash(): Promise<string | null> {
  const env = process.env.MAVERA_ACCESS_CODE?.trim();
  if (env === "off") return null;
  if (!env) return MAVERA_ACCESS_HASH;
  if (envHash?.code !== env) envHash = { code: env, hash: await sha256(await accessKey(env)) };
  return envHash.hash;
}

/** Закрыта ли витрина сейчас. */
export async function isLocked(showcase: Showcase): Promise<boolean> {
  return showcase.locked && (await expectedHash()) !== null;
}

/** Подходит ли ключ из куки. */
export async function verifyKey(key: string | undefined): Promise<boolean> {
  const hash = await expectedHash();
  if (hash === null) return true;
  if (!key || !/^[0-9a-f]{64}$/.test(key)) return false;
  return sameSecret(await sha256(key), hash);
}

/** Проверить введённый код. Подошёл — ключ для куки, нет — null. */
export async function checkCode(code: string): Promise<string | null> {
  if (!code.trim()) return null;
  const key = await accessKey(code);
  return (await verifyKey(key)) ? key : null;
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

/**
 * Куда вести после кода или со старой страницы кода: адрес из `next`, если
 * он свой — относительный, внутри этой витрины и не сама страница кода, —
 * иначе корень витрины. Чужой адрес в `next` превратил бы переадресацию в
 * открытый редирект.
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

import type { Catalog } from "@/lib/configurator/catalog";

/**
 * Где живёт набор включённых допников.
 *
 * Два места, и оба нужны. Адрес страницы — чтобы конфигурацию можно было
 * отправить ссылкой и открыть на другом устройстве. Хранилище браузера —
 * чтобы набор пережил переход с главной в карточку ЖК: ссылки внутри сайта
 * параметров не несут. Адрес главнее: по чужой ссылке открывается чужой набор.
 *
 * Пустой набор кодируется словом, а не пустой строкой: отсутствие параметра
 * значит «не настраивали, взять пакет», а «ничего не включено» — это выбор.
 *
 * Ключ хранилища — проект и пакет: у MAVERA, ADAR и Global Export свои наборы.
 */

const PARAM = "addons";
const NONE = "none";
const listeners = new Set<() => void>();

const key = (project: string, tier: string) => `${project}:addons:${tier}`;

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Сырая запись: из адреса, если она там есть, иначе из хранилища. null — не настраивали. */
export function read(project: string, tier: string): string | null {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get(PARAM);
    if (fromUrl !== null) return fromUrl;
    return window.localStorage.getItem(key(project, tier));
  } catch {
    return null;
  }
}

/** На сервере и при гидрации — всегда пакет по умолчанию. */
export function readOnServer(): string | null {
  return null;
}

export function parse(raw: string | null, catalog: Catalog, tier: string): string[] {
  if (raw === null) return catalog.included[tier] ?? [];
  if (raw === NONE || raw === "") return [];
  const known = new Set(catalog.addons.map((addon) => addon.id));
  return raw.split(",").filter((id) => known.has(id));
}

function encode(catalog: Catalog, enabled: Iterable<string>): string {
  const set = new Set(enabled);
  const ordered = catalog.addons.filter((addon) => set.has(addon.id)).map((addon) => addon.id);
  return ordered.length ? ordered.join(",") : NONE;
}

function setParam(raw: string | null) {
  const url = new URL(window.location.href);
  if (raw === null) url.searchParams.delete(PARAM);
  else url.searchParams.set(PARAM, raw);
  window.history.replaceState(window.history.state, "", url);
}

export function write(catalog: Catalog, tier: string, enabled: Iterable<string>) {
  const raw = encode(catalog, enabled);
  try {
    window.localStorage.setItem(key(catalog.project, tier), raw);
  } catch {
    /* приватный режим — останется только адрес */
  }
  setParam(raw);
  emit();
}

export function clear(project: string, tier: string) {
  try {
    window.localStorage.removeItem(key(project, tier));
  } catch {
    /* нечего чистить */
  }
  setParam(null);
  emit();
}

/**
 * Набор из чужой ссылки запоминается, чтобы не потеряться при переходе на
 * соседнюю страницу. Вызывается из эффекта: это запись, а не чтение.
 */
export function adopt(project: string, tier: string) {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get(PARAM);
    if (fromUrl !== null) window.localStorage.setItem(key(project, tier), fromUrl);
  } catch {
    /* без хранилища набор живёт только в адресе */
  }
}

/** Адрес текущей страницы с набором в параметре — для ссылки коллеге и для брифа. */
export function shareUrl(catalog: Catalog, enabled: Iterable<string>): string {
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, encode(catalog, enabled));
  return url.toString();
}

/* ------------------------------------------------------------------ */
/* Сеанс: что включили последним, смотрим ли «было», открыт ли док     */
/* ------------------------------------------------------------------ */

/**
 * Живёт в памяти модуля, а не в состоянии компонента: конструктор сам
 * переводит на другую страницу, и там блок должен подъехать и подсветиться,
 * а док — остаться открытым. Перезагрузка страницы это стирает, и правильно:
 * подсветка отвечает на действие, а не на состояние.
 */
export type Session = {
  /** Что включили последним — его блок подъезжает, пульсирует и умеет «было / стало». */
  fresh: { id: string; at: number } | null;
  /** Смотрим «было»: свежий допник временно считается выключенным, цена не меняется. */
  peek: boolean;
  open: boolean;
};

const serverSession: Session = { fresh: null, peek: false, open: false };
let session: Session = serverSession;

export function readSession(): Session {
  return session;
}

export function readSessionOnServer(): Session {
  return serverSession;
}

export function patchSession(patch: Partial<Session>) {
  session = { ...session, ...patch };
  emit();
}

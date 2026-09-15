import type { TierId } from "@/components/present/mavera/theme";
import { addons, included, type AddonId } from "@/content/mavera/addons";

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
 */

const PARAM = "addons";
const NONE = "none";
const known = new Set<string>(addons.map((addon) => addon.id));
const listeners = new Set<() => void>();

const key = (tier: TierId) => `mavera:addons:${tier}`;

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
export function read(tier: TierId): string | null {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get(PARAM);
    if (fromUrl !== null) return fromUrl;
    return window.localStorage.getItem(key(tier));
  } catch {
    return null;
  }
}

/** На сервере и при гидрации — всегда пакет по умолчанию. */
export function readOnServer(): string | null {
  return null;
}

export function parse(raw: string | null, tier: TierId): AddonId[] {
  if (raw === null) return included[tier];
  if (raw === NONE || raw === "") return [];
  return raw.split(",").filter((id): id is AddonId => known.has(id));
}

function encode(enabled: Iterable<AddonId>): string {
  const set = new Set(enabled);
  const ordered = addons.filter((addon) => set.has(addon.id)).map((addon) => addon.id);
  return ordered.length ? ordered.join(",") : NONE;
}

function setParam(raw: string | null) {
  const url = new URL(window.location.href);
  if (raw === null) url.searchParams.delete(PARAM);
  else url.searchParams.set(PARAM, raw);
  window.history.replaceState(window.history.state, "", url);
}

export function write(tier: TierId, enabled: Iterable<AddonId>) {
  const raw = encode(enabled);
  try {
    window.localStorage.setItem(key(tier), raw);
  } catch {
    /* приватный режим — останется только адрес */
  }
  setParam(raw);
  emit();
}

export function clear(tier: TierId) {
  try {
    window.localStorage.removeItem(key(tier));
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
export function adopt(tier: TierId) {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get(PARAM);
    if (fromUrl !== null) window.localStorage.setItem(key(tier), fromUrl);
  } catch {
    /* без хранилища набор живёт только в адресе */
  }
}

/** Адрес текущей страницы с набором в параметре — для кнопки «Скопировать ссылку». */
export function shareUrl(enabled: Iterable<AddonId>): string {
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, encode(enabled));
  return url.toString();
}

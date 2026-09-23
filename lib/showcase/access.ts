/**
 * Витрины, которые раньше открывались по коду: MAVERA и Golden House.
 *
 * С 23.09.2026 витрина — публичное портфолио: на неё ведут с devuz.studio,
 * и обе витрины открыты всем, у кого есть ссылка, без кода и без куки.
 * Кода больше нет совсем — ни встроенного, ни в переменных окружения
 * (`SHOWCASE_ACCESS_CODE` и `GH_ACCESS_CODE` на сервере ни на что не
 * влияют), так что забытая строка в `.env.local` витрину не закроет.
 *
 * Остались две вещи. Старые ссылки: заказчикам уходил адрес с ключом
 * (`/mavera?key=…`) и страница ввода кода (`/mavera/access?next=…`) — они
 * должны приводить на ту же страницу витрины, а не в тупик. И закрытость от
 * поиска: `noindex` на страницах, `X-Robots-Tag` в прокси и строка в
 * robots.txt остаются — показывать по ссылке и пускать поисковики — разные
 * решения.
 *
 * Работает и в прокси, и в серверной функции: ни React, ни модулей Node.
 */

export type ShowcaseId = "mavera" | "gh";

type Showcase = {
  id: ShowcaseId;
  /** Корень витрины в адресе. */
  prefix: string;
  /** Бывшая страница ввода кода — теперь только переадресация. */
  gate: string;
};

export const showcases: Showcase[] = [
  { id: "mavera", prefix: "/mavera", gate: "/mavera/access" },
  { id: "gh", prefix: "/gh", gate: "/gh/access" },
];

/** Параметр, в котором раньше передавали код доступа. */
export const LEGACY_KEY_PARAM = "key";

function under(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Витрина, которой принадлежит адрес, — вместе с бывшей страницей кода. */
export function showcaseFor(pathname: string): Showcase | null {
  return showcases.find((showcase) => under(pathname, showcase.prefix)) ?? null;
}

export function showcaseById(id: ShowcaseId): Showcase {
  return showcases.find((showcase) => showcase.id === id) ?? showcases[0];
}

/** Бывшая страница ввода кода. */
export function isGate(showcase: Showcase, pathname: string): boolean {
  return under(pathname, showcase.gate);
}

/**
 * Куда вести со старой страницы кода: адрес из `next`, если он свой —
 * относительный, внутри этой витрины и не сама страница кода, — иначе
 * корень витрины. Чужой адрес в `next` превратил бы переадресацию в
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
  url.searchParams.delete(LEGACY_KEY_PARAM);
  return `${url.pathname}${url.search}${url.hash}`;
}

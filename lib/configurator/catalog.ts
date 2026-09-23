/**
 * Каталог конструктора: что у проекта можно включить и где это живёт.
 *
 * Конструктор один на все проекты витрины — MAVERA, ADAR, Global Export, —
 * а различаются они ровно этим описанием: варианты, блоки, страницы, где
 * блоки живут. Компоненты (док, обёртка блока, хранилище набора) читают
 * каталог из контекста и про конкретный проект ничего не знают.
 *
 * Цен здесь нет намеренно. Витрина — публичное портфолио, а каталог уходит
 * в браузер целиком (его получает клиентский провайдер). Прайс студии лежит
 * только на сервере, в lib/configurator/prices.ts: по нему маршрут брифа
 * считает сумму для менеджера, а посетитель её не видит нигде.
 *
 * Здесь нет React и нет `window`: каталог читает и сервер — маршрут брифа
 * проверяет по нему присланный набор.
 */

export type NicheTier = 1 | 2 | 3;

export type CatalogTier = {
  id: string;
  /** Подпись в доке: «Люкс», «Каталог», «Концепция A». */
  label: string;
};

export type CatalogAddon = {
  id: string;
  label: string;
  /** Что изменится на странице — одной строкой. */
  effect: string;
  /** Страница, где живёт блок, либо `everywhere` каталога. */
  where: string;
  /** Ключ взаимоисключающей группы: включил один вариант — остальные выключились. */
  exclusive?: string;
};

export type CatalogPage = {
  id: string;
  /** Заголовок группы в доке: «Главная», «Карточка ЖК». */
  label: string;
  /**
   * Живут ли здесь допники «везде» и плавающий чат. По умолчанию да;
   * панель управления MAVERA — нет: там сайт заказчика не показывается.
   */
  shared?: boolean;
  /**
   * Не страница, а группа услуг сверх сайта: интеграции, ИИ-агенты,
   * продвижение. Блока на макете нет, тумблер никуда не переводит и
   * «было / стало» не показывает — только отмечает услугу для брифа.
   */
  virtual?: boolean;
};

export type Catalog = {
  /** Ключ проекта: часть ключа хранилища и поле брифа. */
  project: string;
  /** Как проект зовётся в брифе: «MAVERA — сайт застройщика». */
  label: string;
  /** Ниша клиента и её грейд по ICP — уходят в лид. */
  niche: string;
  nicheTier: NicheTier;
  tiers: CatalogTier[];
  addons: CatalogAddon[];
  /** Что уже входит в вариант — с этим набором страница открывается. */
  included: Record<string, string[]>;
  pages: CatalogPage[];
  /**
   * Блоки всех страниц стоят на каждой — призраками. Тогда тумблер никуда
   * не переводит: у концепций Global Export блок соседней концепции
   * включается прямо здесь, для сравнения на месте.
   */
  crossMounted?: boolean;
  /** Значение `where`, означающее «на всех общих страницах». */
  everywhere?: string;
  everywhereLabel?: string;
  /** Допник, который переключает `data-motion` на корне. */
  motionAddon?: string;
  /** Плавающая кнопка мессенджера — тоже блок с тумблером. */
  chat?: { id: string; text: string; site: string };
};

export function tierOf(catalog: Catalog, tier: string): CatalogTier {
  return catalog.tiers.find((entry) => entry.id === tier) ?? catalog.tiers[0];
}

export function addonOf(catalog: Catalog, id: string): CatalogAddon {
  return catalog.addons.find((addon) => addon.id === id) ?? catalog.addons[0];
}

export function isIncluded(catalog: Catalog, tier: string, id: string): boolean {
  return (catalog.included[tier] ?? []).includes(id);
}

export function pageOf(catalog: Catalog, id: string): CatalogPage | undefined {
  return catalog.pages.find((page) => page.id === id);
}

/** Первая общая страница — туда ведут допники «везде» с панели управления. */
export function firstSharedPage(catalog: Catalog): CatalogPage | undefined {
  return catalog.pages.find((page) => page.shared !== false);
}

/** Включённые блоки сверх варианта — сколько добавлено к тому, что уже входит. */
export function extrasOf(catalog: Catalog, tier: string, enabled: ReadonlySet<string>): CatalogAddon[] {
  return catalog.addons.filter((addon) => enabled.has(addon.id) && !isIncluded(catalog, tier, addon.id));
}

/**
 * Набор после нажатия тумблера. Включение блока из взаимоисключающей
 * группы гасит соседей: подписка на статьи бывает только одна.
 */
export function withToggled(catalog: Catalog, enabled: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(enabled);
  if (next.has(id)) {
    next.delete(id);
    return next;
  }
  const group = addonOf(catalog, id).exclusive;
  if (group) {
    for (const addon of catalog.addons) if (addon.exclusive === group) next.delete(addon.id);
  }
  next.add(id);
  return next;
}

/** «1 блок», «3 блока», «12 блоков» — для дока и брифа. */
export function blocks(count: number): string {
  const tens = count % 100;
  const ones = count % 10;
  if (tens > 10 && tens < 20) return `${count} блоков`;
  if (ones === 1) return `${count} блок`;
  if (ones > 1 && ones < 5) return `${count} блока`;
  return `${count} блоков`;
}

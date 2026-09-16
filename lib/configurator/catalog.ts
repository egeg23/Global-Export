/**
 * Каталог конструктора: что у проекта можно включить и сколько это стоит.
 *
 * Конструктор один на все проекты витрины — MAVERA, ADAR, Global Export, —
 * а различаются они ровно этим описанием: пакеты, допники, страницы, где
 * допники живут. Компоненты (док, обёртка блока, хранилище набора) читают
 * каталог из контекста и про конкретный проект ничего не знают.
 *
 * Здесь нет React и нет `window`: каталог читает и сервер — маршрут брифа
 * пересчитывает по нему цену, не веря цифрам из браузера.
 */

export type NicheTier = 1 | 2 | 3;

export type CatalogTier = {
  id: string;
  /** Подпись в доке: «Люкс», «Каталог», «Концепция A». */
  label: string;
  priceUsd: number;
};

export type CatalogAddon = {
  id: string;
  label: string;
  priceUsd: number;
  /** Что изменится на странице — одной строкой. */
  effect: string;
  /** Страница, где живёт блок, либо `everywhere` каталога. */
  where: string;
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
  /** Что уже входит в пакет — за это тумблер денег не просит. */
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
  /** Плавающая кнопка мессенджера — тоже допник. */
  chat?: { id: string; text: string; site: string };
  /** Одна строка под итогом в доке, если цены ещё ориентировочные. */
  pricingNote?: string;
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

/** Сумма допников сверх пакета. */
export function extrasUsd(catalog: Catalog, tier: string, enabled: ReadonlySet<string>): number {
  return catalog.addons
    .filter((addon) => enabled.has(addon.id) && !isIncluded(catalog, tier, addon.id))
    .reduce((sum, addon) => sum + addon.priceUsd, 0);
}

export function totalUsd(catalog: Catalog, tier: string, enabled: ReadonlySet<string>): number {
  return tierOf(catalog, tier).priceUsd + extrasUsd(catalog, tier, enabled);
}

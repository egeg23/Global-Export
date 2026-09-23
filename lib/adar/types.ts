/**
 * Типы витрины ADAR.
 *
 * Второй проект в этом репозитории: три концепции главной страницы для
 * adar.uz. Он живёт отдельно от сайта Global Export — свой каталог, свои
 * токены оформления, свой корень маршрутов `/adar`, — и удаляется одной
 * папкой, когда заказчик выберет направление.
 */

export type SetLine =
  | "eko"
  | "silver"
  | "gold"
  | "prestige"
  | "lux"
  | "premium"
  | "vip"
  | "platinum";

/** Строка состава: индекс наименования в словаре, вес в граммах, количество. */
export type SetPart = [item: number, grams: number, qty: number];

export type GiftSet = {
  slug: string;
  name: string;
  line: SetLine;
  /** Как линейка называется у самой компании: «EKO Standart», «PLATINUM VIP». */
  lineLabel: string;
  /** Номер варианта внутри линейки; у именных наборов (VIP, PLATINUM) его нет. */
  no?: number;
  /** Сумы. */
  price: number;
  image: string;
  /** Наименований в наборе. */
  count: number;
  /** Суммарный вес, граммы. */
  weight: number;
  /** Во что упакован набор — коробка или мешок. */
  pack: "box" | "bag";
  parts: SetPart[];
};

/** Тематическое направление из меню каталога adar.uz. */
export type Theme = {
  slug: string;
  title: string;
  /** Подпись под заголовком — чем это направление отличается от соседнего. */
  note: string;
  /** Пусто, если направление на сайте заявлено, но товаров в нём ещё нет. */
  count: number;
  /** Без снимка — направление объявлено, а фотографий от заказчика ещё нет. */
  image?: string;
};

export type Client = {
  name: string;
  logo: string;
};

/**
 * Строка состава работ: что делается и что это даёт. Без сумм — витрина
 * стала публичным портфолио, и цены студии на ней не показываются.
 */
export type ScopeLine = {
  title: string;
  detail: string;
};

export type Scope = {
  /** Рабочих дней до сдачи. */
  days: string;
  lines: ScopeLine[];
  /** Что в вариант не входит — чтобы вопрос не всплыл посреди работы. */
  excluded: string[];
};

export type Concept = {
  id: "base" | "plus" | "premium";
  href: string;
  /** Порядковый номер для навигации: 01 / 02 / 03. */
  index: string;
  name: string;
  tagline: string;
  summary: string;
  /** Короткие тезисы для сравнительной таблицы на витрине. */
  highlights: string[];
  scope: Scope;
};

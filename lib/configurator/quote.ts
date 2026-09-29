import { extrasOf, tierOf, type Catalog } from "@/lib/configurator/catalog";

/**
 * Подсчёт суммы по прайсу — без самого прайса.
 *
 * Прайс живёт только на сервере (lib/configurator/prices.ts). Считать по
 * нему нужно в двух местах: маршруту брифа — всегда, а доку конструктора —
 * после того, как сервер проверил код доступа к ценам и отдал прайс проекта
 * (app/api/showcase/prices). Поэтому здесь только арифметика: прайс
 * приходит аргументом, и модуль можно импортировать и в браузере.
 */

export type AddonPrice = {
  usd: number;
  /** Подписка: цена в месяц, в разовый итог не входит. */
  monthly?: boolean;
  /** Цена «от»: точную назовут после разговора. Итог тогда тоже «от». */
  from?: boolean;
  /** По запросу: в сумму не входит. */
  onRequest?: boolean;
};

export type PriceList = {
  tiers: Record<string, number>;
  addons: Record<string, AddonPrice>;
};

export type Quote = {
  tierUsd: number;
  /** Разовый итог: вариант и блоки сверх него, без подписок и «по запросу». */
  totalUsd: number;
  /** Подписки в месяц — отдельной суммой. */
  monthlyUsd: number;
  /** В наборе есть цена «от» — итог тоже «от». */
  fromPrice: boolean;
};

const FREE: AddonPrice = { usd: 0 };

/** Цена блока. Неизвестный блок бесплатен: лучше недосчитать, чем выдумать. */
export function priceOf(list: PriceList | null | undefined, id: string): AddonPrice {
  return list?.addons[id] ?? FREE;
}

export function quoteWith(
  list: PriceList | null | undefined,
  catalog: Catalog,
  tier: string,
  enabled: ReadonlySet<string>,
): Quote {
  const extras = extrasOf(catalog, tier, enabled).map((addon) => priceOf(list, addon.id));
  const tierUsd = list?.tiers[tierOf(catalog, tier).id] ?? 0;
  const once = extras.filter((price) => !price.monthly && !price.onRequest);
  const monthly = extras.filter((price) => price.monthly && !price.onRequest);

  return {
    tierUsd,
    totalUsd: tierUsd + once.reduce((sum, price) => sum + price.usd, 0),
    monthlyUsd: monthly.reduce((sum, price) => sum + price.usd, 0),
    fromPrice: extras.some((price) => price.from && !price.onRequest),
  };
}

/** «$1 600». Неразрывные пробелы — сумма не рвётся на две строки. */
export function usd(value: number): string {
  return `$${Math.round(value).toLocaleString("ru-RU").replace(/\s/g, " ")}`;
}

/** «$1 600», «от $300», «$380/мес», «по запросу», «бесплатно». */
export function formatPrice(price: AddonPrice): string {
  if (price.onRequest) return "по запросу";
  if (!price.usd) return "бесплатно";
  return `${price.from ? "от " : ""}${usd(price.usd)}${price.monthly ? "/мес" : ""}`;
}

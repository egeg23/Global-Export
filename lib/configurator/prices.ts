import "server-only";

import { extrasOf, tierOf, type Catalog } from "@/lib/configurator/catalog";

/**
 * Прайс конструктора — только на сервере.
 *
 * Витрина стала публичным портфолио: её открывают по ссылке с devuz.studio,
 * и цены студии посетитель видеть не должен — ни на странице, ни в разметке,
 * ни в ответе сервера. Поэтому каталог (lib/configurator/catalog.ts) цен не
 * несёт, а они живут здесь. Модуль помечен `server-only`: импорт из
 * клиентского компонента сломает сборку, а не утечёт в браузер.
 *
 * Считает по нему один маршрут — бриф из конструктора
 * (app/api/showcase/brief/route.ts). Сумма уходит в студию и менеджеру в
 * Telegram: по ней он понимает масштаб заказа, а крупный бриф идёт только
 * владельцу.
 *
 * Откуда цифры:
 *
 *  - MAVERA — смета проекта (docs/mavera-estimate.md): пакеты и допники.
 *  - ADAR — смета по трём вариантам: «Каталог» = «Витрина» + поиск с
 *    карточкой (210 + 90) + две сцены (150); «Премиум» = «Каталог» + подбор
 *    по бюджету (130) + корпоративный раздел (100) + шесть сцен (230), из
 *    которых тумблером включаются две тяжёлые — барабан архива и сцена о
 *    компании. Оформление «Премиума» (190) тумблером не включается: это не
 *    блок, а весь сайт. Чата в смете не было — это допродажа, как у MAVERA.
 *  - Global Export — сметы по концепциям нет, цены ориентировочные, в
 *    масштабе MAVERA и ADAR. Перед разговором о деньгах их надо сверить.
 *  - Услуги студии сверх сайта — прайс студии, общий для всех проектов.
 *
 * Подписка считается в месяц и в разовый итог не входит; «от» значит, что
 * точную сумму назовут после разговора; «по запросу» в сумму не входит
 * вовсе — тумблер только отмечает интерес.
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

type PriceList = {
  tiers: Record<string, number>;
  addons: Record<string, AddonPrice>;
};

const studioServices: Record<string, AddonPrice> = {
  "crm-link": { usd: 1300 },
  "crm-own": { usd: 4000 },
  "ai-support": { usd: 2600 },
  "ai-rag": { usd: 26000, from: true },
  "seo-12": { usd: 380, monthly: true },
  "seo-20": { usd: 550, monthly: true },
  "seo-40": { usd: 750, monthly: true },
  social: { usd: 0, onRequest: true },
};

const priceLists: Record<string, PriceList> = {
  mavera: {
    tiers: { standard: 5900, lux: 8900, premium: 14900, noir: 14900 },
    addons: {
      langs: { usd: 0 },
      motion: { usd: 400 },
      magnetic: { usd: 250 },
      chat: { usd: 300 },
      hero: { usd: 600 },
      promo: { usd: 200 },
      reviews: { usd: 350 },
      news: { usd: 600 },
      "commerce-calc": { usd: 600 },
      map: { usd: 0 },
      calc: { usd: 500 },
      chess: { usd: 1200 },
      favorites: { usd: 450 },
      progress: { usd: 350 },
      booking: { usd: 900 },
      tour: { usd: 900 },
      forecast: { usd: 350 },
      roles: { usd: 400 },
      crm: { usd: 1300 },
      import: { usd: 350 },
      metrika: { usd: 250 },
      audit: { usd: 300 },
      cabinet: { usd: 2400 },
      partners: { usd: 1800 },
      pay: { usd: 700 },
      ...studioServices,
    },
  },
  adar: {
    tiers: { base: 900, plus: 1350, premium: 2000 },
    addons: {
      search: { usd: 300 },
      growth: { usd: 90 },
      rail: { usd: 60 },
      budget: { usd: 130 },
      corporate: { usd: 100 },
      archive: { usd: 130 },
      about: { usd: 100 },
      chat: { usd: 120 },
      ...studioServices,
    },
  },
  globalex: {
    tiers: { a: 4900, b: 4900 },
    addons: {
      chat: { usd: 300 },
      manifesto: { usd: 250 },
      journey: { usd: 600 },
      rail: { usd: 450 },
      counters: { usd: 200 },
      about: { usd: 200 },
      categories: { usd: 400 },
      quality: { usd: 350 },
      news: { usd: 300 },
      ...studioServices,
    },
  },
};

const FREE: AddonPrice = { usd: 0 };

/** Цена блока. Неизвестный блок бесплатен: лучше недосчитать, чем выдумать. */
export function addonPrice(catalog: Catalog, id: string): AddonPrice {
  return priceLists[catalog.project]?.addons[id] ?? FREE;
}

export function tierPrice(catalog: Catalog, tier: string): number {
  return priceLists[catalog.project]?.tiers[tierOf(catalog, tier).id] ?? 0;
}

export type Quote = {
  tierUsd: number;
  /** Разовый итог: вариант и блоки сверх него, без подписок и «по запросу». */
  totalUsd: number;
  /** Подписки в месяц — отдельной суммой. */
  monthlyUsd: number;
  /** В наборе есть цена «от» — итог тоже «от». */
  fromPrice: boolean;
};

export function quote(catalog: Catalog, tier: string, enabled: ReadonlySet<string>): Quote {
  const extras = extrasOf(catalog, tier, enabled).map((addon) => addonPrice(catalog, addon.id));
  const tierUsd = tierPrice(catalog, tier);
  const once = extras.filter((price) => !price.monthly && !price.onRequest);
  const monthly = extras.filter((price) => price.monthly && !price.onRequest);

  return {
    tierUsd,
    totalUsd: tierUsd + once.reduce((sum, price) => sum + price.usd, 0),
    monthlyUsd: monthly.reduce((sum, price) => sum + price.usd, 0),
    fromPrice: extras.some((price) => price.from && !price.onRequest),
  };
}

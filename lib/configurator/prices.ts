import "server-only";

import { tierOf, type Catalog } from "@/lib/configurator/catalog";
import { priceOf, quoteWith, type AddonPrice, type PriceList, type Quote } from "@/lib/configurator/quote";

export type { AddonPrice, Quote };

/**
 * Прайс конструктора — только на сервере.
 *
 * Витрина — публичное портфолио: её открывают по ссылке с devuz.studio и из
 * поиска. Цены студии посетитель без кода не видит — ни на странице, ни в
 * разметке, ни в бандле. Поэтому каталог (lib/configurator/catalog.ts) цен
 * не несёт, а они живут здесь. Модуль помечен `server-only`: импорт из
 * клиентского компонента сломает сборку, а не утечёт в браузер.
 *
 * Отсюда цены уходят двумя путями, оба — с сервера:
 *
 *  - бриф из конструктора (app/api/showcase/brief/route.ts): сумма уходит в
 *    студию и менеджеру в Telegram, крупный бриф — только владельцу;
 *  - цены по коду (app/api/showcase/prices/route.ts): решение владельца от
 *    29.09.2026 — код дают бот студии и менеджер (скаут), и с ним док
 *    конструктора показывает цену каждого тумблера и итог. Без верного
 *    кода маршрут не отдаёт ничего (lib/configurator/price-code.ts).
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
 *  - Comfort Mebel — задание владельца студии: сайт 1600, панель
 *    управления 400, остальные допники — скромные ориентиры под мебельный
 *    магазин (калькулятор по размерам, рассрочка, запись в шоурум…).
 *    Обе палитры — один и тот же сайт, цена у них одна.
 *  - MedAcademy — сайт 920 в любом из двух вариантов (назначил владелец,
 *    01.10.2026; было 1400). Допники — по его же решению «дешевле рынка на 15–30%, у них
 *    не сильно много денег»: от медианы прайсов Ташкента и СНГ на 2026 год
 *    скидка 15–30%, сильнее на простом, слабее на сложном. Рынок, медианы и
 *    ссылки — docs/medacademy-research.md, раздел 7. Где публичных цен нет
 *    (проверка сертификата, своя панель), ориентир — ставка 6–14 $/ч.
 *  - Arsenal D (webname.uz) — сайт 1100: середина рынка Ташкента для
 *    сайта такого масштаба (8–12 секций, каталог услуг, калькулятор,
 *    RU/UZ/EN — 12–13 млн сум у студии среднего уровня). Допники — как у
 *    MedAcademy, на 15–30% ниже медианы рынка; где публичных цен нет
 *    (живой WHOIS, табло, DNS-панель, статус), ориентир — ставка 6–14 $/ч.
 *    Рынок и ссылки — docs/webname-research.md, раздел 6.
 *  - Akbar Rich — решение владельца, 02.10.2026: «сильно не жести по
 *    ценам, −20–25% от рынка УЗ». Сайт-каталог 960: рынок Ташкента для
 *    сайта с уникальным дизайном и каталогом — около 15 млн сум (≈ 1 270),
 *    минус 24%. Допники — от медианы прайсов Ташкента минус 20–25%; где
 *    публичных цен нет (примерка, тур, подборка, импорт), ориентир — часы
 *    по 8 $/ч. Рынок и ссылки — docs/akbar-research.md, раздел 6. КП от
 *    24.09 (сайт 1 300, панель 600) было по старой ставке — конструктор
 *    его не повторяет.
 *  - Услуги студии сверх сайта — прайс студии, общий для всех проектов.
 *
 * Подписка считается в месяц и в разовый итог не входит; «от» значит, что
 * точную сумму назовут после разговора; «по запросу» в сумму не входит
 * вовсе — тумблер только отмечает интерес.
 */

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
  comfort: {
    tiers: { a: 1600, b: 1600 },
    addons: {
      admin: { usd: 400 },
      fit: { usd: 200 },
      colors: { usd: 250 },
      view3d: { usd: 350 },
      booking: { usd: 120 },
      installment: { usd: 100 },
      catalog: { usd: 250 },
      uz: { usd: 150 },
      chat: { usd: 100 },
      "tg-bot": { usd: 150 },
      stock: { usd: 300, from: true },
      "seo-start": { usd: 150 },
      ...studioServices,
    },
  },
  medacademy: {
    tiers: { a: 920, b: 920 },
    addons: {
      quiz: { usd: 140 },
      booking: { usd: 190 },
      cert: { usd: 90 },
      cabinet: { usd: 450 },
      pay: { usd: 240 },
      blog: { usd: 120 },
      admin: { usd: 300 },
      uz: { usd: 50 },
      en: { usd: 90 },
      chat: { usd: 15 },
      "tg-bot": { usd: 190 },
      crm: { usd: 90 },
      ...studioServices,
    },
  },
  webname: {
    tiers: { full: 1100 },
    addons: {
      whois: { usd: 160 },
      board: { usd: 65 },
      calc: { usd: 65 },
      compare: { usd: 40 },
      transfer: { usd: 80 },
      dns: { usd: 130 },
      status: { usd: 95 },
      cabinet: { usd: 200 },
      pay: { usd: 230 },
      uz: { usd: 60 },
      en: { usd: 95 },
      chat: { usd: 30 },
      "tg-bot": { usd: 165 },
      crm: { usd: 150 },
      blog: { usd: 115 },
      ...studioServices,
    },
  },
  akbar: {
    tiers: { site: 960 },
    addons: {
      prices: { usd: 65 },
      installment: { usd: 95 },
      favorites: { usd: 65 },
      tryon: { usd: 190 },
      dealer: { usd: 340 },
      journal: { usd: 115 },
      tour: { usd: 190 },
      measure: { usd: 180 },
      pay: { usd: 230 },
      chat: { usd: 32 },
      uz: { usd: 60 },
      en: { usd: 95 },
      admin: { usd: 300 },
      excel: { usd: 65 },
      sync: { usd: 230 },
      "tg-bot": { usd: 165 },
      crm: { usd: 150 },
      ...studioServices,
    },
  },
};

/** Цена блока. Неизвестный блок бесплатен: лучше недосчитать, чем выдумать. */
export function addonPrice(catalog: Catalog, id: string): AddonPrice {
  return priceOf(priceLists[catalog.project], id);
}

export function tierPrice(catalog: Catalog, tier: string): number {
  return priceLists[catalog.project]?.tiers[tierOf(catalog, tier).id] ?? 0;
}

export function quote(catalog: Catalog, tier: string, enabled: ReadonlySet<string>): Quote {
  return quoteWith(priceLists[catalog.project], catalog, tier, enabled);
}

/**
 * Прайс проекта — для маршрута цен по коду (app/api/showcase/prices).
 * Отдаются только варианты и блоки этого каталога, ничего сверх.
 */
export function priceListFor(catalog: Catalog): PriceList | null {
  const list = priceLists[catalog.project];
  if (!list) return null;
  const known = new Set(catalog.addons.map((addon) => addon.id));
  return {
    tiers: Object.fromEntries(catalog.tiers.map((tier) => [tier.id, list.tiers[tier.id] ?? 0])),
    addons: Object.fromEntries(Object.entries(list.addons).filter(([id]) => known.has(id))),
  };
}

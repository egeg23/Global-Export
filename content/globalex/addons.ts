import { servicePages, studioServices } from "@/content/services";
import type { Catalog, CatalogAddon } from "@/lib/configurator/catalog";

/**
 * Конструктор для двух концепций Global Export.
 *
 * Сметы по концепциям в проекте нет — заказчик выбирал оформление, а не
 * пакет. Цены ниже ориентировочные, в масштабе MAVERA и ADAR, и подписаны
 * так в доке (`pricingNote`). Перед тем как показывать заказчику, их надо
 * сверить с реальной сметой — править здесь, в одном месте.
 *
 * Пакет один на обе концепции: они различаются оформлением, а не составом,
 * поэтому и стоят одинаково. Формы заявки тумблером не выключаются — сайт
 * без формы не продаёт.
 */
export const globalexAddons: CatalogAddon[] = [
  /* Обе концепции */
  { id: "chat", label: "Чат WhatsApp / Telegram", priceUsd: 300, effect: "Плавающая кнопка мессенджера", where: "all" },

  /* Концепция A — кинематографичная */
  { id: "manifesto", label: "Манифест", priceUsd: 250, effect: "Крупный текст о компании между экранами", where: "a" },
  { id: "journey", label: "Путь продукта", priceUsd: 600, effect: "Поэтапный разбор производства с закреплённым кадром", where: "a" },
  { id: "rail", label: "Лента товаров", priceUsd: 450, effect: "Горизонтальная лента каталога", where: "a" },

  /* Концепция B — светлый каталог */
  { id: "counters", label: "Счётчики", priceUsd: 200, effect: "Годы, страны, тонны — цифры набегают при прокрутке", where: "b" },
  { id: "about", label: "Плитка о компании", priceUsd: 200, effect: "Коротко о компании с фотографией", where: "b" },
  { id: "categories", label: "Строки категорий", priceUsd: 400, effect: "Широкие строки каталога по категориям", where: "b" },
  { id: "quality", label: "Качество и сертификаты", priceUsd: 350, effect: "Стандарты и сертификаты рядами", where: "b" },
  { id: "news", label: "Новости", priceUsd: 300, effect: "Три последние публикации перед формой", where: "b" },
];

export const globalexCatalog: Catalog = {
  project: "globalex",
  label: "Global Export — сайт экспортёра",
  niche: "экспорт сухофруктов и орехов, дистрибуция",
  nicheTier: 2,
  tiers: [
    { id: "a", label: "Концепция A", priceUsd: 4900 },
    { id: "b", label: "Концепция B", priceUsd: 4900 },
  ],
  addons: [...globalexAddons, ...studioServices],
  included: {
    a: ["manifesto", "journey", "rail"],
    b: ["counters", "about", "categories", "quality", "news"],
  },
  pages: [
    { id: "a", label: "Концепция A" },
    { id: "b", label: "Концепция B" },
    ...servicePages,
  ],
  crossMounted: true,
  everywhere: "all",
  everywhereLabel: "Обе концепции",
  chat: { id: "chat", text: "Здравствуйте! Интересует продукция Global Export.", site: "https://www.globalex.uz" },
  pricingNote: "Цены ориентировочные — сверить со сметой перед показом",
};

export function globalexHrefs(locale: string): Record<string, string> {
  return { a: `/${locale}/concept-a`, b: `/${locale}/concept-b` };
}

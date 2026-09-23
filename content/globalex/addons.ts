import { servicePages, studioServices } from "@/content/services";
import type { Catalog, CatalogAddon } from "@/lib/configurator/catalog";

/**
 * Конструктор для двух концепций Global Export.
 *
 * Концепции различаются оформлением, а не составом: у каждой свои блоки,
 * а блок соседней включается тумблером прямо на месте, для сравнения.
 * Формы заявки тумблером не выключаются — сайт без формы не продаёт.
 * Цен здесь нет — прайс студии только на сервере
 * (lib/configurator/prices.ts).
 */
export const globalexAddons: CatalogAddon[] = [
  /* Обе концепции */
  { id: "chat", label: "Чат WhatsApp / Telegram", effect: "Плавающая кнопка мессенджера", where: "all" },

  /* Концепция A — кинематографичная */
  { id: "manifesto", label: "Манифест", effect: "Крупный текст о компании между экранами", where: "a" },
  { id: "journey", label: "Путь продукта", effect: "Поэтапный разбор производства с закреплённым кадром", where: "a" },
  { id: "rail", label: "Лента товаров", effect: "Горизонтальная лента каталога", where: "a" },

  /* Концепция B — светлый каталог */
  { id: "counters", label: "Счётчики", effect: "Годы, страны, тонны — цифры набегают при прокрутке", where: "b" },
  { id: "about", label: "Плитка о компании", effect: "Коротко о компании с фотографией", where: "b" },
  { id: "categories", label: "Строки категорий", effect: "Широкие строки каталога по категориям", where: "b" },
  { id: "quality", label: "Качество и сертификаты", effect: "Стандарты и сертификаты рядами", where: "b" },
  { id: "news", label: "Новости", effect: "Три последние публикации перед формой", where: "b" },
];

export const globalexCatalog: Catalog = {
  project: "globalex",
  label: "Global Export — сайт экспортёра",
  niche: "экспорт сухофруктов и орехов, дистрибуция",
  nicheTier: 2,
  tiers: [
    { id: "a", label: "Концепция A" },
    { id: "b", label: "Концепция B" },
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
};

export function globalexHrefs(locale: string): Record<string, string> {
  return { a: `/${locale}/concept-a`, b: `/${locale}/concept-b` };
}

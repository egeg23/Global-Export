import { concepts } from "@/content/adar/concepts";
import { servicePages, studioServices } from "@/content/services";
import type { Catalog, CatalogAddon } from "@/lib/configurator/catalog";

/**
 * Конструктор ADAR: блоки, которые можно включить на любом из трёх вариантов.
 *
 * «Каталог» = «Витрина» + поиск с карточкой + две сцены; «Премиум» =
 * «Каталог» + подбор по бюджету + корпоративный раздел + шесть сцен, из
 * которых здесь включаются две тяжёлые — барабан архива и сцена о компании.
 * Оформление «Премиума» тумблером не включается: это не блок, а весь сайт.
 *
 * Цен здесь нет — прайс студии только на сервере
 * (lib/configurator/prices.ts).
 */
export const adarAddons: CatalogAddon[] = [
  { id: "search", label: "Каталог с поиском и карточкой", effect: "Поиск по составу, фильтры, карточка набора", where: "main" },
  { id: "growth", label: "Сцена «набор растёт»", effect: "От эконома до платины: цена и вес меняются на глазах", where: "main" },
  { id: "rail", label: "Лента наборов", effect: "Лента, которую крутят руками", where: "main" },
  { id: "budget", label: "Подбор по бюджету", effect: "Двигаешь бюджет — набор меняется", where: "main" },
  { id: "corporate", label: "Корпоративный раздел", effect: "Заявка на партию с расчётом суммы", where: "main" },
  { id: "archive", label: "Барабан сезонов", effect: "Архив наборов прошлых лет в объёме", where: "main" },
  { id: "about", label: "Сцена о компании", effect: "История и цифры с 2011 года", where: "main" },
  { id: "chat", label: "Чат WhatsApp / Telegram", effect: "Плавающая кнопка мессенджера", where: "main" },
];

export const adarCatalog: Catalog = {
  project: "adar",
  label: "ADAR — подарочные наборы",
  niche: "подарочные наборы, розница и корпоративные заказы",
  nicheTier: 3,
  tiers: concepts.map((concept) => ({ id: concept.id, label: concept.name })),
  addons: [...adarAddons, ...studioServices],
  included: {
    base: [],
    plus: ["search", "growth", "rail"],
    premium: ["search", "growth", "rail", "budget", "corporate", "archive", "about"],
  },
  pages: [{ id: "main", label: "Главная" }, ...servicePages],
  chat: { id: "chat", text: "Здравствуйте! Интересуют подарочные наборы ADAR.", site: "https://adar.uz" },
};

export function adarHrefs(tier: string): Record<string, string> {
  return { main: `/adar/${tier}` };
}

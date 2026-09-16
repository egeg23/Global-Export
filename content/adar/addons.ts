import { concepts } from "@/content/adar/concepts";
import { servicePages, studioServices } from "@/content/services";
import type { Catalog, CatalogAddon } from "@/lib/configurator/catalog";

/**
 * Конструктор ADAR: блоки, которые можно включить на любом из трёх вариантов.
 *
 * Цены — из сметы (content/adar/concepts.ts), чтобы на витрине и в документе
 * стояли одни и те же цифры: «Каталог» = «Витрина» + поиск с карточкой
 * (210 + 90) + две сцены (150); «Премиум» = «Каталог» + подбор по бюджету
 * (130) + корпоративный раздел (100) + шесть сцен (230), из которых здесь
 * включаются две тяжёлые — барабан архива и сцена о компании. Оформление
 * «Премиума» (190) тумблером не включается: это не блок, а весь сайт.
 *
 * Чат в смете не было — это допродажа, как у MAVERA.
 */
export const adarAddons: CatalogAddon[] = [
  { id: "search", label: "Каталог с поиском и карточкой", priceUsd: 300, effect: "Поиск по составу, фильтры, карточка набора", where: "main" },
  { id: "growth", label: "Сцена «набор растёт»", priceUsd: 90, effect: "От эконома до платины: цена и вес меняются на глазах", where: "main" },
  { id: "rail", label: "Лента наборов", priceUsd: 60, effect: "Лента, которую крутят руками", where: "main" },
  { id: "budget", label: "Подбор по бюджету", priceUsd: 130, effect: "Двигаешь бюджет — набор меняется", where: "main" },
  { id: "corporate", label: "Корпоративный раздел", priceUsd: 100, effect: "Заявка на партию с расчётом суммы", where: "main" },
  { id: "archive", label: "Барабан сезонов", priceUsd: 130, effect: "Архив наборов прошлых лет в объёме", where: "main" },
  { id: "about", label: "Сцена о компании", priceUsd: 100, effect: "История и цифры с 2011 года", where: "main" },
  { id: "chat", label: "Чат WhatsApp / Telegram", priceUsd: 120, effect: "Плавающая кнопка мессенджера", where: "main" },
];

export const adarCatalog: Catalog = {
  project: "adar",
  label: "ADAR — подарочные наборы",
  niche: "подарочные наборы, розница и корпоративные заказы",
  nicheTier: 3,
  tiers: concepts.map((concept) => ({
    id: concept.id,
    label: concept.name,
    priceUsd: concept.estimate.total,
  })),
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

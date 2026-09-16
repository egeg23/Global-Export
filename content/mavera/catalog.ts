import { tiers, type TierId } from "@/components/present/mavera/theme";
import { addons, included } from "@/content/mavera/addons";
import type { Catalog } from "@/lib/configurator/catalog";

/**
 * MAVERA в терминах общего конструктора.
 *
 * Допники и пакеты остаются в своих файлах — на них ссылается смета и
 * страницы; здесь только то, что нужно доку: страницы, где живут блоки,
 * и что считать «везде».
 */
export const maveraCatalog: Catalog = {
  project: "mavera",
  label: "MAVERA — сайт застройщика",
  niche: "девелопмент, продажа квартир в новостройках",
  nicheTier: 1,
  tiers: tiers.map((tier) => ({ id: tier.id, label: tier.label, priceUsd: tier.priceUsd })),
  addons,
  included,
  pages: [
    { id: "main", label: "Главная" },
    { id: "object", label: "Карточка ЖК" },
    { id: "admin", label: "Панель управления", shared: false },
  ],
  everywhere: "both",
  everywhereLabel: "Главная и карточка",
  motionAddon: "motion",
  chat: { id: "chat", text: "Здравствуйте! Интересует квартира в MAVERA.", site: "https://mavera.uz" },
};

/** Адреса страниц варианта: конструктор переводит по ним, когда блок живёт не здесь. */
export function maveraHrefs(tier: TierId, objectSlug: string): Record<string, string> {
  return {
    main: `/mavera/${tier}`,
    object: `/mavera/${tier}/${objectSlug}`,
    admin: `/mavera/${tier}/admin`,
  };
}

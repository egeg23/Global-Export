import { tiers, type TierId } from "@/components/present/mavera/theme";
import { addons, included } from "@/content/mavera/addons";
import { servicePages, studioServices } from "@/content/services";
import type { Catalog } from "@/lib/configurator/catalog";

/**
 * MAVERA в терминах общего конструктора.
 *
 * Блоки и варианты остаются в своих файлах — на них ссылаются страницы;
 * здесь только то, что нужно доку: страницы, где живут блоки, и что
 * считать «везде». Услуги студии (content/services.ts) добавляются в
 * конец: они общие для всех проектов витрины.
 */
export const maveraCatalog: Catalog = {
  project: "mavera",
  label: "MAVERA — сайт застройщика",
  niche: "девелопмент, продажа квартир в новостройках",
  nicheTier: 1,
  tiers: tiers.map((tier) => ({ id: tier.id, label: tier.label })),
  // Интеграция с CRM у MAVERA уже есть тумблером в панели (crm) — общий дубль убираем.
  addons: [...addons, ...studioServices.filter((service) => service.id !== "crm-link")],
  included,
  pages: [
    { id: "main", label: "Главная" },
    { id: "object", label: "Карточка ЖК" },
    { id: "admin", label: "Панель управления", shared: false },
    ...servicePages,
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

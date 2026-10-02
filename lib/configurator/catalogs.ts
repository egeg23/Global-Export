import { adarCatalog } from "@/content/adar/addons";
import { akbarCatalog } from "@/content/akbar/addons";
import { comfortCatalog } from "@/content/comfort/catalog";
import { globalexCatalog } from "@/content/globalex/addons";
import { maveraCatalog } from "@/content/mavera/catalog";
import { medacademyCatalog } from "@/content/medacademy/catalog";
import { webnameCatalog, webnamePremiumCatalog } from "@/content/webname/catalog";
import type { Catalog } from "@/lib/configurator/catalog";

/** Все каталоги витрины — по ключу проекта. Сервер брифа ищет здесь. */
export const catalogs: Record<string, Catalog> = {
  [maveraCatalog.project]: maveraCatalog,
  [adarCatalog.project]: adarCatalog,
  [globalexCatalog.project]: globalexCatalog,
  [comfortCatalog.project]: comfortCatalog,
  [medacademyCatalog.project]: medacademyCatalog,
  [webnameCatalog.project]: webnameCatalog,
  [webnamePremiumCatalog.project]: webnamePremiumCatalog,
  [akbarCatalog.project]: akbarCatalog,
};

export function catalogOf(project: string): Catalog | null {
  return Object.prototype.hasOwnProperty.call(catalogs, project) ? catalogs[project] : null;
}

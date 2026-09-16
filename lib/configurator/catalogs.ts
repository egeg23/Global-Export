import { adarCatalog } from "@/content/adar/addons";
import { globalexCatalog } from "@/content/globalex/addons";
import { maveraCatalog } from "@/content/mavera/catalog";
import type { Catalog } from "@/lib/configurator/catalog";

/** Все каталоги витрины — по ключу проекта. Сервер брифа ищет здесь. */
export const catalogs: Record<string, Catalog> = {
  [maveraCatalog.project]: maveraCatalog,
  [adarCatalog.project]: adarCatalog,
  [globalexCatalog.project]: globalexCatalog,
};

export function catalogOf(project: string): Catalog | null {
  return Object.prototype.hasOwnProperty.call(catalogs, project) ? catalogs[project] : null;
}

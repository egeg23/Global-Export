import { categories, models } from "@/lib/akbar/catalog";

/**
 * Лёгкая выжимка каталога для меню: названия, адреса, обложки и первые
 * позиции. Сам каталог в браузер не уезжает — меню получает только это.
 */
export type MenuCategory = {
  id: string;
  name: string;
  short: string;
  href: string;
  cover: string;
  subs: { name: string; href: string; cover: string; count: string; group: string | null; sample: string[] }[];
};

export function menuData(): MenuCategory[] {
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    short: category.short,
    href: `/akbar/katalog/${category.subcategories[0].slug}`,
    cover: category.cover,
    subs: category.subcategories.map((sub) => ({
      name: sub.name,
      href: `/akbar/katalog/${sub.slug}`,
      cover: sub.cover,
      count: models(sub.total),
      group: sub.group,
      sample: sub.items.slice(0, 2).map((item) => item.name),
    })),
  }));
}

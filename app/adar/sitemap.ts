import type { MetadataRoute } from "next";

import { sets } from "@/content/adar/catalog";
import { adarHome } from "@/lib/adar/seo";

/**
 * Карта сайта ADAR.
 *
 * Сайт одностраничный, поэтому адрес в карте один: якоря разделов Google
 * сводит к той же странице, и перечислять их — значит отдавать восемь раз
 * одно и то же. Зато вместе с адресом уходит весь каталог снимками: подарки
 * ищут глазами, и картиночная выдача для них — не довесок, а половина
 * переходов. Разрешение расширения `image:` карта получает автоматически.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: adarHome,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: sets.map((set) => `${adarHome.replace(/\/$/, "")}${set.image}`),
    },
  ];
}

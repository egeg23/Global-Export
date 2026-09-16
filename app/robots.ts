import type { MetadataRoute } from "next";

import { adarIndexable } from "@/lib/adar/seo";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/present", "/mavera", "/motion.html"] }],
    // Вторая карта — сайта ADAR, вместе с его каталогом в снимках. На нашей
    // площадке её нет: там раздел закрыт от индексации, и звать туда робота
    // незачем.
    sitemap: adarIndexable
      ? [`${siteUrl}/sitemap.xml`, `${siteUrl}/adar/sitemap.xml`]
      : `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

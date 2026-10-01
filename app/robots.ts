import type { MetadataRoute } from "next";

import { adarIndexable } from "@/lib/adar/seo";
import { isShowcase } from "@/lib/showcase";
import { siteUrl } from "@/lib/seo";

/**
 * На площадке поисковикам открыто всё, кроме панели и API: проекты витрины —
 * портфолио студии (lib/showcase/seo, решение владельца от 29.09.2026). На
 * боевом сайте Global Export витрина и чужие проекты по-прежнему закрыты.
 */
const CLOSED_ON_SITE = ["/api/", "/admin", "/present", "/mavera", "/gh", "/akbar", "/comfort", "/medacademy", "/motion.html"];
const CLOSED_ON_SHOWCASE = ["/api/", "/admin"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: isShowcase ? CLOSED_ON_SHOWCASE : CLOSED_ON_SITE }],
    // Вторая карта — сайта ADAR, вместе с его каталогом в снимках. На нашей
    // площадке её нет: там раздел закрыт от индексации, и звать туда робота
    // незачем.
    sitemap: adarIndexable
      ? [`${siteUrl}/sitemap.xml`, `${siteUrl}/adar/sitemap.xml`]
      : `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

import type { MetadataRoute } from "next";

import { news } from "@/content/news";
import { products } from "@/content/products";
import { localeTags, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";

/**
 * One entry per page per locale, each carrying the full hreflang alternate set
 * so Google can pair the language variants.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "about", "catalog", "quality", "team", "news", "contacts"];
  const productPaths = products.map((product) => `catalog/${product.slug}`);
  const newsPaths = news.map((item) => `news/${item.slug}`);

  const paths = [...staticPaths, ...productPaths, ...newsPaths];
  const lastModified = new Date();

  return paths.flatMap((path) => {
    const languages: Record<string, string> = {};
    for (const code of locales) {
      languages[localeTags[code]] = `${siteUrl}/${code}${path ? `/${path}` : ""}`;
    }

    return locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path ? `/${path}` : ""}`,
      lastModified,
      changeFrequency: path.startsWith("news") ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path.includes("/") ? 0.6 : 0.8,
      alternates: { languages },
    }));
  });
}

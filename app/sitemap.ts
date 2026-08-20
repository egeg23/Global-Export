import type { MetadataRoute } from "next";

import { getNews, getProducts } from "@/lib/content/source";
import { localeTags, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";

type Entry = {
  path: string;
  lastModified: Date;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

/**
 * One entry per page per locale, each carrying the full hreflang alternate set
 * — including x-default — so Google can pair the language variants.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildDate = new Date();
  const [products, news] = await Promise.all([getProducts(), getNews()]);

  const staticPages: Entry[] = [
    "",
    "about",
    "catalog",
    "quality",
    "team",
    "news",
    "contacts",
  ].map((path) => ({
    path,
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const productPages: Entry[] = products.map((product) => ({
    path: `catalog/${product.slug}`,
    lastModified: buildDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // An article's lastmod is its publication date, not the time of the build —
  // otherwise a 2021 post looks freshly edited on every deploy.
  const newsPages: Entry[] = news.map((item) => {
    const published = new Date(item.date);
    return {
      path: `news/${item.slug}`,
      lastModified: Number.isNaN(published.getTime()) ? buildDate : published,
      changeFrequency: "weekly",
      priority: 0.6,
    };
  });

  return [...staticPages, ...productPages, ...newsPages].flatMap((entry) => {
    const url = (code: string) =>
      `${siteUrl}/${code}${entry.path ? `/${entry.path}` : ""}`;

    const languages: Record<string, string> = { "x-default": url("en") };
    for (const code of locales) {
      languages[localeTags[code]] = url(code);
    }

    return locales.map((locale) => ({
      url: url(locale),
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages },
    }));
  });
}

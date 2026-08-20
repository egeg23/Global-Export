import type { Metadata } from "next";

import { localeTags, locales, ogLocales, type Locale } from "@/lib/i18n";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.globalex.uz"
).replace(/\/$/, "");

/** Absolute URL for an asset stored under /public. */
export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${siteUrl}${path}`;
}

/**
 * Trims a description to fit a search snippet without cutting a word in half.
 */
export function snippet(text: string, max = 280): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max);
  const lastBreak = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "));
  return `${cut.slice(0, lastBreak > 0 ? lastBreak : max).replace(/[,;:.\s]+$/, "")}…`;
}

/**
 * Builds canonical + hreflang alternates for a page.
 *
 * `path` is the route without the locale prefix ("catalog", "news/foo", or ""
 * for the home page), so every locale variant of a page points at the same
 * alternate set — which is what Google needs to serve the right language.
 */
export function alternates(locale: Locale, path = ""): Metadata["alternates"] {
  const clean = path.replace(/^\/+/, "");
  const url = (code: Locale) => `${siteUrl}/${code}${clean ? `/${clean}` : ""}`;

  const languages: Record<string, string> = {};
  for (const code of locales) {
    languages[localeTags[code]] = url(code);
  }
  languages["x-default"] = url("en");

  return { canonical: url(locale), languages };
}

type PageMetaInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  image = "/images/hero.jpg",
  type = "website",
  publishedTime,
}: PageMetaInput): Metadata {
  const clean = path.replace(/^\/+/, "");
  const url = `${siteUrl}/${locale}${clean ? `/${clean}` : ""}`;
  const text = snippet(description);

  // Dimensions are deliberately omitted: the images come in several aspect
  // ratios and a wrong width/height is worse than none at all.
  const images = [{ url: absoluteUrl(image), alt: title }];

  return {
    title,
    description: text,
    alternates: alternates(locale, path),
    openGraph: {
      title,
      description: text,
      url,
      siteName: "Global Export Company",
      locale: ogLocales[locale],
      type,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: text,
      images: [absoluteUrl(image)],
    },
  };
}

/** Organization JSON-LD — rendered once, in the root layout. */
export function organizationJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Global Export Company LLC",
    alternateName: "Global Export",
    url: `${siteUrl}/${locale}`,
    description,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/favicon.svg"),
    },
    image: absoluteUrl("/images/production.jpg"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tashkent",
      addressCountry: "UZ",
    },
    email: "info@globalex.uz",
    sameAs: [
      "https://www.facebook.com/GEC.LLC",
      "https://www.linkedin.com/company/38099307",
      "https://www.instagram.com/globalexportllc/",
    ],
  };
}

/** BreadcrumbList JSON-LD for the detail pages. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

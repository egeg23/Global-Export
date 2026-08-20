import type { Metadata } from "next";

import { localeTags, locales, type Locale } from "@/lib/i18n";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.globalex.uz"
).replace(/\/$/, "");

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
  image,
  type = "website",
  publishedTime,
}: PageMetaInput): Metadata {
  const clean = path.replace(/^\/+/, "");
  const url = `${siteUrl}/${locale}${clean ? `/${clean}` : ""}`;
  const images = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined;

  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      siteName: "Global Export Company",
      locale: localeTags[locale],
      type,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/** Organization JSON-LD — rendered once, in the root layout. */
export function organizationJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Global Export Company LLC",
    alternateName: "Global Export",
    url: `${siteUrl}/${locale}`,
    description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tashkent",
      addressCountry: "UZ",
    },
    email: "info@globalex.uz",
    industry: "Agricultural export",
  };
}

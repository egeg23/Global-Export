export const locales = ["en", "ru", "uz"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  uz: "O‘zbekcha",
};

export const localeShortNames: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  uz: "UZ",
};

/** BCP-47 tags used for <html lang>, hreflang and Open Graph. */
export const localeTags: Record<Locale, string> = {
  en: "en",
  ru: "ru-RU",
  uz: "uz-UZ",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Localised string. Content is authored with `en` required so a page never
 * renders an empty node; `ru`/`uz` fall back to English when a translation
 * has not been supplied yet.
 */
export type Localized = {
  en: string;
  ru?: string;
  uz?: string;
};

export function t(value: Localized | string | undefined, locale: Locale): string {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.en ?? "";
}

/** Builds an href that keeps the current locale prefix. */
export function localeHref(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/**
 * Picks the best supported locale from an Accept-Language header.
 * Used by the root route to redirect bare `/` visits.
 */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return defaultLocale;
}

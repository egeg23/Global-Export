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

/**
 * Language tags for <html lang> and hreflang. Deliberately without a region:
 * the Russian pages serve buyers in Kazakhstan and the Caucasus as much as in
 * Russia, and "ru-RU" would tell Google to target one country only.
 */
export const localeTags: Record<Locale, string> = {
  en: "en",
  ru: "ru",
  uz: "uz",
};

/** Open Graph wants language_TERRITORY, which is a different format again. */
export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
  uz: "uz_UZ",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Localised string. `en` is required in the modules under `content/`; entries
 * written through the admin panel may leave any language blank, which is what
 * the fallback in `t()` is for.
 */
export type Localized = {
  en: string;
  ru?: string;
  uz?: string;
};

/**
 * Reads a localised value, falling back to the first language that has one.
 *
 * The rule matters for the panel: the owner adds a certificate in Russian and
 * saves. Without a fallback the English and Uzbek pages would show an empty
 * heading. With it they show the Russian text — visibly untranslated, which is
 * a prompt to translate it, rather than a hole in the page. English is tried
 * first because it is the language the whole site is authored in.
 */
export function t(value: Localized | string | undefined, locale: Locale): string {
  if (value === undefined) return "";
  if (typeof value === "string") return value;

  const own = value[locale];
  if (own && own.trim()) return own;

  for (const code of [defaultLocale, ...locales]) {
    const candidate = value[code];
    if (candidate && candidate.trim()) return candidate;
  }

  return "";
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

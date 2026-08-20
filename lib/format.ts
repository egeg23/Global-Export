import { localeTags, type Locale } from "@/lib/i18n";

/**
 * Formats an ISO date for display. Uzbek falls back to the Russian pattern
 * when the runtime has no uz-UZ data, which is common on older Node builds.
 */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const tags = locale === "uz" ? ["uz-UZ", "ru-RU"] : [localeTags[locale]];

  try {
    return new Intl.DateTimeFormat(tags, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return iso;
  }
}

/**
 * Picks the right plural form for a count.
 *
 * Russian needs three: 1 товар, 2–4 товара, 5–20 товаров — and the teens all
 * take the last form, which is why 11 and 111 are handled separately from 1
 * and 21. English and Uzbek only ever use `one` and `many`.
 */
export function plural(
  count: number,
  locale: Locale,
  forms: { one: string; few: string; many: string },
): string {
  if (locale !== "ru") return count === 1 ? forms.one : forms.many;

  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;

  if (mod100 >= 11 && mod100 <= 14) return forms.many;
  if (mod10 === 1) return forms.one;
  if (mod10 >= 2 && mod10 <= 4) return forms.few;
  return forms.many;
}

/** Splits an authored body into paragraphs. */
export function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

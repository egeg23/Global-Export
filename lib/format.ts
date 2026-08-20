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

/** Splits an authored body into paragraphs. */
export function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

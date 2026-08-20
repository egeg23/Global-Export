import { locales, type Locale } from "@/lib/i18n";
import type { LocalizedJson, SpecJson } from "@/lib/supabase/types";

/**
 * Reading the panel's forms back into database rows.
 *
 * Localised fields post one input per language, named `title.en`, `title.ru`,
 * `title.uz`. Empty languages are dropped rather than stored as `""` so that
 * `t()` can tell "not translated yet" from "deliberately blank".
 */
export function localizedFromForm(formData: FormData, name: string): LocalizedJson {
  const value: LocalizedJson = {};

  for (const locale of locales) {
    const raw = formData.get(`${name}.${locale}`);
    const text = typeof raw === "string" ? raw.trim() : "";
    if (text) value[locale as Locale] = text;
  }

  return value;
}

export function textFromForm(formData: FormData, name: string): string {
  const raw = formData.get(name);
  return typeof raw === "string" ? raw.trim() : "";
}

/** Optional columns are nullable, and an empty box means "no value". */
export function nullableFromForm(formData: FormData, name: string): string | null {
  return textFromForm(formData, name) || null;
}

export function boolFromForm(formData: FormData, name: string): boolean {
  // An unchecked checkbox posts nothing at all, so absence is false.
  return formData.get(name) === "on" || formData.get(name) === "true";
}

export function intFromForm(formData: FormData, name: string, fallback = 0): number {
  const parsed = Number.parseInt(textFromForm(formData, name), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Specification rows post as `specs.0.label.en`, `specs.0.value.ru` and so on.
 * Rows whose label and value are both empty in every language are dropped —
 * that is what an untouched blank row at the end of the list looks like.
 */
export function specsFromForm(formData: FormData, name = "specs"): SpecJson[] {
  const indexes = new Set<number>();
  for (const key of formData.keys()) {
    const match = key.match(new RegExp(`^${name}\\.(\\d+)\\.`));
    if (match) indexes.add(Number(match[1]));
  }

  return [...indexes]
    .sort((a, b) => a - b)
    .map((index) => ({
      label: localizedFromForm(formData, `${name}.${index}.label`),
      value: localizedFromForm(formData, `${name}.${index}.value`),
    }))
    .filter(
      (spec) => Object.keys(spec.label).length > 0 || Object.keys(spec.value).length > 0,
    );
}

/**
 * Turns a title into a URL slug. Cyrillic is transliterated rather than
 * stripped — the client's current site has Cyrillic in its URLs, which is
 * exactly the thing to avoid repeating.
 */
const translit: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
  щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  ў: "o", қ: "q", ғ: "g", ҳ: "h",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .split("")
    .map((char) => translit[char] ?? char)
    .join("")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

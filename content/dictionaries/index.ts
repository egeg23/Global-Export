import type { Locale } from "@/lib/i18n";

import { en, type Dictionary } from "./en";
import { ru } from "./ru";
import { uz } from "./uz";

const dictionaries: Record<Locale, Dictionary> = { en, ru, uz };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export type { Dictionary };

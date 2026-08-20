"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/cn";
import { localeShortNames, locales, type Locale } from "@/lib/i18n";
import type { LocalizedJson } from "@/lib/supabase/types";

/**
 * One value in three languages, behind a language switch.
 *
 * The inactive languages stay in the DOM — hidden, not unmounted — so all three
 * post together and a half-finished translation is never silently dropped. The
 * dot on a tab marks a language that has text, which is how the owner sees at a
 * glance what still needs translating.
 *
 * Leaving a language empty is allowed on purpose: `t()` falls back to the first
 * language that has content, so a Russian-only entry shows Russian everywhere
 * rather than leaving a hole in the page.
 */
export function LocalizedField({
  name,
  label,
  hint,
  value,
  multiline = false,
  rows = 4,
  required = false,
}: {
  name: string;
  label: string;
  hint?: string;
  value?: LocalizedJson | null;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  const id = useId();
  const [active, setActive] = useState<Locale>("ru");
  const [filled, setFilled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(locales.map((locale) => [locale, Boolean(value?.[locale]?.trim())])),
  );

  const controlClass =
    "w-full rounded-lg border border-forest-900/20 bg-white px-3.5 text-sm text-forest-950 transition-colors focus:border-forest-700";

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-forest-900" id={`${id}-label`}>
          {label}
          {required ? <span className="text-red-600"> *</span> : null}
        </span>

        <div role="group" aria-label="Язык" className="flex gap-1">
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              aria-pressed={active === locale}
              onClick={() => setActive(locale)}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors",
                active === locale
                  ? "bg-forest-800 text-sand-50"
                  : "text-forest-800/70 hover:bg-forest-800/6",
              )}
            >
              {localeShortNames[locale]}
              <span
                aria-hidden="true"
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  filled[locale]
                    ? "bg-harvest-400"
                    : active === locale
                      ? "bg-sand-50/30"
                      : "bg-forest-900/15",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {hint ? <p className="mt-0.5 text-xs text-ink-subtle">{hint}</p> : null}

      <div className="mt-1.5">
        {locales.map((locale) => {
          const props = {
            name: `${name}.${locale}`,
            defaultValue: value?.[locale] ?? "",
            "aria-labelledby": `${id}-label`,
            "aria-label": `${label} — ${localeShortNames[locale]}`,
            onChange: (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) =>
              setFilled((current) => ({
                ...current,
                [locale]: Boolean(event.target.value.trim()),
              })),
          };

          return (
            <div key={locale} hidden={active !== locale}>
              {multiline ? (
                <textarea {...props} rows={rows} className={cn(controlClass, "py-2.5 leading-relaxed")} />
              ) : (
                <input {...props} type="text" className={cn(controlClass, "h-11")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

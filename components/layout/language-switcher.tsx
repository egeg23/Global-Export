"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { localeNames, localeShortNames, locales, type Locale } from "@/lib/i18n";

/**
 * Swaps the locale segment of the current path, so switching language keeps
 * the visitor on the same page instead of dropping them on the home page.
 */
export function LanguageSwitcher({
  locale,
  tone = "dark",
  className,
}: {
  locale: Locale;
  tone?: "dark" | "light";
  className?: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={rest ? `/${code}/${rest}` : `/${code}`}
            hrefLang={code}
            aria-label={localeNames[code]}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors duration-300",
              active
                ? tone === "dark"
                  ? "bg-forest-800 text-sand-50"
                  : "bg-sand-50/95 text-forest-900"
                : tone === "dark"
                  ? "text-ink-muted hover:text-forest-800"
                  : "text-sand-100/70 hover:text-sand-50",
            )}
          >
            {localeShortNames[code]}
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";

import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

type HeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

export function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname() ?? "";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "about", label: dict.nav.about },
    { href: "catalog", label: dict.nav.catalog },
    { href: "quality", label: dict.nav.quality },
    { href: "team", label: dict.nav.team },
    { href: "news", label: dict.nav.news },
    { href: "contacts", label: dict.nav.contacts },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel whenever navigation happens.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // The panel covers the page, so the body behind it must not scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;
  const tone = solid ? "dark" : "light";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        solid
          ? "border-b border-forest-900/10 bg-sand-50/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {/* Scrim so the white nav stays legible over bright hero photography. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-forest-950/75 via-forest-950/35 to-transparent transition-opacity duration-500",
          solid ? "opacity-0" : "opacity-100",
        )}
      />
      <Container className="flex h-18 items-center justify-between gap-6 py-3">
        <Link
          href={localeHref(locale)}
          className="shrink-0"
          aria-label="Global Export Company"
        >
          <Logo tone={tone} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {links.map((link) => {
            const href = localeHref(locale, link.href);
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={link.href}
                href={href}
                data-active={active}
                className={cn(
                  "link-underline text-[0.9rem] transition-colors duration-300",
                  solid
                    ? "text-forest-900/80 hover:text-forest-900"
                    : "text-sand-50/85 hover:text-sand-50",
                  active && (solid ? "text-forest-900" : "text-sand-50"),
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} tone={tone} className="hidden sm:flex" />

          <Link
            href={localeHref(locale, "contacts")}
            className={cn(
              "hidden h-10 items-center rounded-full px-5 text-sm font-medium transition-all duration-300 xl:inline-flex",
              solid
                ? "bg-forest-800 text-sand-50 hover:bg-forest-700"
                : "bg-sand-50/95 text-forest-900 hover:bg-white",
            )}
          >
            {dict.common.requestQuote}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? dict.common.close : dict.common.menu}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden",
              solid
                ? "border-forest-900/15 text-forest-900 hover:bg-forest-900/5"
                : "border-sand-50/25 text-sand-50 hover:bg-sand-50/10",
            )}
          >
            <span className="sr-only">{menuOpen ? dict.common.close : dict.common.menu}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              {menuOpen ? (
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 8h16M4 16h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile panel */}
      <div
        className={cn(
          "overflow-hidden border-t border-forest-900/10 bg-sand-50 transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="flex flex-col gap-1 py-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={localeHref(locale, link.href)}
              className="rounded-xl px-3 py-3 font-display text-xl text-forest-900 transition-colors hover:bg-forest-800/5"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 flex items-center justify-between border-t border-forest-900/10 pt-5">
            <LanguageSwitcher locale={locale} tone="dark" />
            <Link
              href={localeHref(locale, "contacts")}
              className="inline-flex h-11 items-center rounded-full bg-forest-800 px-6 text-sm font-medium text-sand-50"
            >
              {dict.common.requestQuote}
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}

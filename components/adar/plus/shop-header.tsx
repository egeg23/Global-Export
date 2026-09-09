"use client";

import Link from "next/link";
import { useState } from "react";

import { SEARCH_EVENT } from "@/components/adar/plus/catalog-browser";
import { Shell } from "@/components/adar/ui/shell";
import { Wordmark } from "@/components/adar/ui/wordmark";
import { company } from "@/content/adar/company";
import { sets } from "@/content/adar/catalog";
import { cn } from "@/lib/cn";

const nav = [
  { label: "Каталог", href: "#katalog" },
  { label: "Тематики", href: "#tematiki" },
  { label: "О компании", href: "#o-kompanii" },
  { label: "Контакты", href: "#kontakty" },
];

/**
 * Шапка варианта «Каталог».
 *
 * Отличается от витринной не краской, а составом: поиск вынесен в шапку и
 * держится на экране всё время. В магазине, где восемьдесят позиций, строка
 * поиска — главный элемент навигации, а не украшение внутренней страницы.
 */
export function ShopHeader() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function search(event: React.FormEvent) {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: query }));
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-adar-green-900/10 bg-adar-cream-50/95 backdrop-blur-md">
      <Shell size="wide" className="flex items-center gap-5 py-3.5">
        <Link href="#" className="shrink-0" aria-label="ADAR — на главную">
          <Wordmark />
        </Link>

        <form
          onSubmit={search}
          role="search"
          className="relative ml-2 hidden max-w-md flex-1 md:block"
        >
          <label htmlFor="shop-search" className="sr-only">
            Поиск по каталогу
          </label>
          <input
            id="shop-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Поиск по ${sets.length} наборам и их составу`}
            className="w-full rounded-lg border border-adar-green-900/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus-visible:border-adar-green-900"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-adar-ink-subtle"
          >
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </form>

        <nav aria-label="Основное меню" className="ml-auto hidden gap-6 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-adar-ink-muted transition-colors hover:text-adar-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <a
            href={`tel:${company.contacts.phones[2].replace(/\s/g, "")}`}
            className="hidden text-sm font-medium text-adar-ink xl:block"
          >
            {company.contacts.phones[2]}
          </a>
          <a
            href="#kontakty"
            className="rounded-lg bg-adar-green-900 px-5 py-2.5 text-sm font-medium text-adar-cream-50 transition-colors duration-300 hover:bg-adar-green-800"
          >
            Заказать
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="shop-nav"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-adar-green-900/15 lg:hidden"
          >
            <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-adar-ink transition-transform duration-300",
                  open && "top-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 top-1.5 h-px bg-adar-ink transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 top-3 h-px bg-adar-ink transition-transform duration-300",
                  open && "top-1.5 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </Shell>

      <div id="shop-nav" hidden={!open} className="border-t border-adar-green-900/10 lg:hidden">
        <Shell size="wide" className="grid gap-2 py-4">
          <form onSubmit={search} role="search" className="md:hidden">
            <label htmlFor="shop-search-mobile" className="sr-only">
              Поиск по каталогу
            </label>
            <input
              id="shop-search-mobile"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по каталогу"
              className="w-full rounded-lg border border-adar-green-900/15 bg-white px-4 py-3 text-base outline-none focus-visible:border-adar-green-900"
            />
          </form>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base text-adar-ink-muted transition-colors hover:bg-adar-cream-100 hover:text-adar-ink"
            >
              {item.label}
            </a>
          ))}
        </Shell>
      </div>
    </header>
  );
}

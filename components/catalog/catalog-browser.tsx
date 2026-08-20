"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import { ProductCard } from "@/components/cards/product-card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";
import type { Dictionary } from "@/content/dictionaries";
import type { CatalogItem } from "@/lib/content/catalog";
import { type Locale } from "@/lib/i18n";

/** history.replaceState fires no event of its own, so we raise one. */
const LOCATION_EVENT = "catalog:locationchange";

function subscribeToLocation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(LOCATION_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(LOCATION_EVENT, onChange);
  };
}

function writeCategoryToUrl(slug: string) {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set("category", slug);
  else url.searchParams.delete("category");
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(LOCATION_EVENT));
}

/**
 * Category filter + name search over the whole catalogue.
 *
 * Filtering runs in the browser on an already-rendered list: the catalogue is
 * a few dozen items, so this is instant and keeps every product in the
 * server-rendered HTML for search engines.
 *
 * The selected category lives in the URL rather than in component state, so a
 * filtered view is linkable and the back button works. It is read through
 * useSyncExternalStore rather than useSearchParams, which would opt the subtree
 * out of prerendering and leave crawlers with an empty grid.
 */
export function CatalogBrowser({
  items,
  categories,
  locale,
  dict,
}: {
  items: CatalogItem[];
  /** Filter tabs, already translated on the server. */
  categories: { slug: string; label: string }[];
  locale: Locale;
  dict: Dictionary;
}) {
  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    () => window.location.search,
    () => "",
  );

  const requested = new URLSearchParams(locationSearch).get("category") ?? "";
  const category = categories.some((item) => item.slug === requested) ? requested : "";

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category && item.category !== category) return false;
      return !needle || item.search.includes(needle);
    });
  }, [items, category, query]);

  const tabs = [{ slug: "", label: dict.catalog.allCategories }, ...categories];

  const countLabel = plural(filtered.length, locale, {
    one: dict.catalog.resultsOne,
    few: dict.catalog.resultsFew,
    many: dict.catalog.resultsMany,
  });

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* A filter, not a tab set: there are no panels to switch between, so
            these are toggle buttons rather than role="tab". */}
        <div
          role="group"
          aria-label={dict.catalog.filterBy}
          className="-mx-1 flex flex-wrap gap-2 px-1"
        >
          {tabs.map((tab) => {
            const active = tab.slug === category;
            return (
              <button
                key={tab.slug || "all"}
                type="button"
                aria-pressed={active}
                onClick={() => writeCategoryToUrl(tab.slug)}
                className={cn(
                  "h-10 rounded-full px-5 text-sm font-medium transition-all duration-300",
                  active
                    ? "bg-forest-800 text-sand-50"
                    : "border border-forest-900/25 text-forest-800 hover:border-forest-800/60 hover:bg-forest-800/5",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle">
            <Icon name="search" className="h-4 w-4" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.catalog.searchPlaceholder}
            aria-label={dict.catalog.searchPlaceholder}
            className="h-11 w-full rounded-full border border-forest-900/50 bg-white pl-11 pr-4 text-sm text-forest-950 transition-colors duration-300 placeholder:text-ink-subtle focus:border-forest-700"
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-subtle" role="status" aria-live="polite">
        {filtered.length} {countLabel}
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.slug}>
              <ProductCard
                item={item}
                locale={locale}
                showCategory={!category}
                comingSoonLabel={dict.product.comingSoon}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-card border border-dashed border-forest-900/15 px-8 py-16 text-center">
          <p className="text-ink-muted">{dict.catalog.empty}</p>
          <button
            type="button"
            onClick={() => {
              writeCategoryToUrl("");
              setQuery("");
            }}
            className="mt-5 inline-flex h-10 items-center rounded-full bg-forest-800 px-6 text-sm font-medium text-sand-50"
          >
            {dict.catalog.reset}
          </button>
        </div>
      )}
    </div>
  );
}

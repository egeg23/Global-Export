"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/cards/product-card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { categories } from "@/content/categories";
import type { Dictionary } from "@/content/dictionaries";
import type { Product } from "@/lib/content/types";
import { t, type Locale } from "@/lib/i18n";

/**
 * Category filter + name search over the whole catalogue.
 *
 * Filtering runs in the browser on an already-rendered list: the catalogue is
 * a few dozen items, so this is instant and keeps every product in the
 * server-rendered HTML for search engines.
 *
 * The `?category=` link target is read here rather than on the server, which
 * lets the whole page stay statically prerendered.
 */
export function CatalogBrowser({
  products,
  locale,
  dict,
}: {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
}) {
  const searchParams = useSearchParams();
  const requested = searchParams.get("category") ?? "";
  const known = categories.some((item) => item.slug === requested);

  const [override, setOverride] = useState<string | null>(null);
  const category = override ?? (known ? requested : "");
  const setCategory = (value: string) => setOverride(value);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      if (category && product.category !== category) return false;
      if (!needle) return true;
      const haystack = [
        t(product.name, locale),
        product.latinName ?? "",
        t(product.description, locale),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [products, category, query, locale]);

  const tabs = [{ slug: "", label: dict.catalog.allCategories }].concat(
    categories.map((item) => ({ slug: item.slug, label: t(item.name, locale) })),
  );

  const countLabel =
    filtered.length === 1 ? dict.catalog.resultsOne : dict.catalog.resultsMany;

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label={dict.catalog.filterBy}
          className="-mx-1 flex flex-wrap gap-2 px-1"
        >
          {tabs.map((tab) => {
            const active = tab.slug === category;
            return (
              <button
                key={tab.slug || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(tab.slug)}
                className={cn(
                  "h-10 rounded-full px-5 text-sm font-medium transition-all duration-300",
                  active
                    ? "bg-forest-800 text-sand-50"
                    : "border border-forest-900/12 text-forest-800 hover:border-forest-800/40 hover:bg-forest-800/5",
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
            className="h-11 w-full rounded-full border border-forest-900/12 bg-white pl-11 pr-4 text-sm text-forest-950 outline-none transition-colors duration-300 placeholder:text-ink-subtle focus:border-forest-600"
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-subtle">
        {filtered.length} {countLabel}
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} locale={locale} showCategory={!category} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-card border border-dashed border-forest-900/15 px-8 py-16 text-center">
          <p className="text-ink-muted">{dict.catalog.empty}</p>
          <button
            type="button"
            onClick={() => {
              setOverride("");
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

import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { plural } from "@/lib/format";
import { categories } from "@/content/categories";
import type { Dictionary } from "@/content/dictionaries";
import { getProductsByCategory } from "@/content/products";
import { localeHref, t, type Locale } from "@/lib/i18n";

/**
 * Wide category rows instead of a card grid: each row gives the copy, the
 * photograph and the actual variety list side by side, so a buyer sees what
 * is inside a category without opening it.
 */
export function CategoryRows({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-white py-24 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-forest-600">
              {dict.home.categoriesEyebrow}
            </span>
            <h2 className="mt-4 max-w-xl text-3xl leading-tight text-forest-950 sm:text-4xl">
              {dict.home.categoriesTitle}
            </h2>
          </div>

          <Link
            href={localeHref(locale, "catalog")}
            className="group inline-flex items-center gap-2 text-[0.95rem] font-medium text-forest-800"
          >
            <span className="link-underline">{dict.common.viewCatalog}</span>
            <ArrowRight />
          </Link>
        </div>

        <ul className="mt-14 space-y-6">
          {categories.map((category, index) => {
            const items = getProductsByCategory(category.slug);

            return (
              <Reveal as="li" key={category.slug} delay={(index % 2) * 80}>
                <Link
                  href={`${localeHref(locale, "catalog")}?category=${category.slug}`}
                  className="group grid gap-8 rounded-[2rem] border border-forest-900/8 bg-sand-50 p-6 transition-all duration-500 hover:border-forest-800/25 hover:shadow-[var(--shadow-lift)] lg:grid-cols-12 lg:items-center lg:p-8"
                >
                  <div className="lg:col-span-4">
                    <h3 className="font-display text-2xl text-forest-950">
                      {t(category.name, locale)}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                      {t(category.description, locale)}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-forest-700">
                      {dict.common.learnMore}
                      <ArrowRight />
                    </span>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 30vw, 100vw"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-forest-600">
                      {items.length}{" "}
                      {plural(items.length, locale, {
                        one: dict.catalog.resultsOne,
                        few: dict.catalog.resultsFew,
                        many: dict.catalog.resultsMany,
                      })}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {items.slice(0, 5).map((item) => (
                        <li
                          key={item.slug}
                          className="flex items-baseline gap-3 text-sm text-forest-900"
                        >
                          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-harvest-400" />
                          {t(item.name, locale)}
                        </li>
                      ))}
                      {items.length > 5 ? (
                        <li className="pl-4 text-sm text-ink-subtle">
                          + {items.length - 5}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

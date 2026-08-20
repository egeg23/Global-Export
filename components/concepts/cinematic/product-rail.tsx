import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import type { Dictionary } from "@/content/dictionaries";
import { featuredProducts, products } from "@/content/products";
import { localeHref, t, type Locale } from "@/lib/i18n";

/**
 * Products as a horizontal rail rather than a grid — the reading motion runs
 * sideways against the vertical page, which is what makes the section feel
 * "designed" without any script behind it. Scroll snapping is pure CSS.
 */
export function ProductRail({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = (featuredProducts.length > 0 ? featuredProducts : products).slice(0, 8);
  if (items.length === 0) return null;

  return (
    <section className="border-t border-sand-50/8 bg-[#0b0b0a] py-24 lg:py-32">
      <Container className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-harvest-300">
            {dict.home.categoriesEyebrow}
          </p>
          <h2 className="mt-8 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] text-sand-50">
            {dict.catalog.title}
          </h2>
        </div>

        <Link
          href={localeHref(locale, "catalog")}
          className="link-underline pb-2 text-sm text-sand-200/70 transition-colors hover:text-sand-50"
        >
          {dict.common.viewAll} →
        </Link>
      </Container>

      <div className="mt-14 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max snap-x snap-mandatory gap-6 px-5 sm:px-8 lg:px-12">
          {items.map((product) => (
            <li key={product.slug} className="w-[78vw] shrink-0 snap-start sm:w-[22rem]">
              <Link href={localeHref(locale, `catalog/${product.slug}`)} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 22rem, 78vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0b0b0a]/85 via-transparent to-transparent"
                  />
                  {product.availability === "soon" ? (
                    <span className="absolute right-4 top-4 rounded-full bg-harvest-400 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#0b0b0a]">
                      {dict.product.comingSoon}
                    </span>
                  ) : null}
                  <div className="absolute inset-x-5 bottom-5">
                    <h3 className="font-display text-xl leading-tight text-sand-50">
                      {t(product.name, locale)}
                    </h3>
                    {product.latinName ? (
                      <p className="mt-1 text-xs italic text-sand-300/60">
                        {product.latinName}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

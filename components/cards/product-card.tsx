import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/button";
import { getCategory } from "@/content/categories";
import type { Product } from "@/lib/content/types";
import { localeHref, t, type Locale } from "@/lib/i18n";

export function ProductCard({
  product,
  locale,
  showCategory = false,
  comingSoonLabel,
}: {
  product: Product;
  locale: Locale;
  showCategory?: boolean;
  comingSoonLabel?: string;
}) {
  const category = showCategory ? getCategory(product.category) : undefined;
  const firstSpec = product.specs?.[0];

  return (
    <Link
      href={localeHref(locale, `catalog/${product.slug}`)}
      className="group hover-lift flex h-full flex-col overflow-hidden rounded-card border border-forest-900/8 bg-white/80 shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        {category ? (
          <span className="absolute left-4 top-4 rounded-full bg-forest-950/75 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-sand-100 backdrop-blur-sm">
            {t(category.shortName, locale)}
          </span>
        ) : null}

        {product.availability === "soon" && comingSoonLabel ? (
          <span className="absolute right-4 top-4 rounded-full bg-harvest-400 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-forest-950">
            {comingSoonLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg leading-snug text-forest-950">
          {t(product.name, locale)}
        </h3>

        {product.latinName ? (
          <p className="mt-1 text-xs italic text-ink-subtle">{product.latinName}</p>
        ) : null}

        {firstSpec ? (
          <p className="mt-3 text-sm text-ink-muted">
            <span className="text-ink-subtle">{t(firstSpec.label, locale)}: </span>
            {t(firstSpec.value, locale)}
          </p>
        ) : null}

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-forest-700">
          {t(
            { en: "Details", ru: "Подробнее", uz: "Batafsil" },
            locale,
          )}
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

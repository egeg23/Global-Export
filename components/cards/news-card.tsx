import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { NewsItem } from "@/lib/content/types";
import { localeHref, t, type Locale } from "@/lib/i18n";

export function NewsCard({
  item,
  locale,
  readLabel,
}: {
  item: NewsItem;
  locale: Locale;
  readLabel: string;
}) {
  return (
    <Link
      href={localeHref(locale, `news/${item.slug}`)}
      className="group hover-lift flex h-full flex-col overflow-hidden rounded-card border border-forest-900/8 bg-white/80 shadow-[var(--shadow-soft)]"
    >
      {item.image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-7">
        <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.14em] text-forest-500">
          <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
          {item.tag ? (
            <>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-forest-400" />
              <span>{t(item.tag, locale)}</span>
            </>
          ) : null}
        </div>

        <h3 className="mt-4 font-display text-lg leading-snug text-forest-950">
          {t(item.title, locale)}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
          {t(item.excerpt, locale)}
        </p>

        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-forest-700">
          {readLabel}
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

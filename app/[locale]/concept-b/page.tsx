import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutTile } from "@/components/concepts/clean/about-tile";
import { CategoryRows } from "@/components/concepts/clean/category-rows";
import { CounterStrip } from "@/components/concepts/clean/counter-strip";
import { QualityRows } from "@/components/concepts/clean/quality-rows";
import { RoundedHero } from "@/components/concepts/clean/rounded-hero";
import { CtaForm } from "@/components/sections/cta-form";
import { NewsTeaser } from "@/components/sections/news-teaser";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

/**
 * Design concept B — "clean catalogue", the direction the client pointed at
 * with hqdriedfruits.uz: light ground, soft radii, counters and wide category
 * rows.
 *
 * A proposal route, not part of the site: excluded from the sitemap, marked
 * noindex, and removed once a direction is chosen.
 */
export const metadata: Metadata = {
  title: "Концепция B — светлый каталог",
  robots: { index: false, follow: false },
};

export default async function ConceptBPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <RoundedHero locale={locale} dict={dict} />
      <CounterStrip locale={locale} />
      <AboutTile locale={locale} dict={dict} />
      <CategoryRows locale={locale} dict={dict} />
      <QualityRows locale={locale} dict={dict} />
      <NewsTeaser locale={locale} dict={dict} />
      <CtaForm locale={locale} dict={dict} />
    </>
  );
}

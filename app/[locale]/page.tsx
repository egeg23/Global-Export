import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutIntro } from "@/components/sections/about-intro";
import { Advantages } from "@/components/sections/advantages";
import { CategoriesGrid } from "@/components/sections/categories-grid";
import { CtaForm } from "@/components/sections/cta-form";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { Geography } from "@/components/sections/geography";
import { Hero } from "@/components/sections/hero";
import { NewsTeaser } from "@/components/sections/news-teaser";
import { Process } from "@/components/sections/process";
import { QualityTeaser } from "@/components/sections/quality-teaser";
import { StatsBand } from "@/components/sections/stats-band";
import { getDictionary } from "@/content/dictionaries";
import { getProducts } from "@/lib/content/source";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return pageMetadata({
    locale,
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    image: "/images/hero.jpg",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const products = await getProducts();

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <AboutIntro locale={locale} dict={dict} />
      <StatsBand locale={locale} dict={dict} />
      <CategoriesGrid locale={locale} dict={dict} />
      <FeaturedProducts locale={locale} dict={dict} />
      <Advantages locale={locale} dict={dict} />
      <Process locale={locale} dict={dict} />
      <QualityTeaser locale={locale} dict={dict} />
      <Geography locale={locale} dict={dict} />
      <NewsTeaser locale={locale} dict={dict} />
      <CtaForm
        locale={locale}
        dict={dict}
        products={products.map((product) => ({
          value: product.slug,
          label: t(product.name, locale),
        }))}
      />
    </>
  );
}

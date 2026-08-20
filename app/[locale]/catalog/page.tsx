import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { CtaForm } from "@/components/sections/cta-form";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { categories } from "@/content/categories";
import { getDictionary } from "@/content/dictionaries";
import { products } from "@/content/products";
import { toCatalogItems } from "@/lib/content/catalog";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return pageMetadata({
    locale,
    path: "catalog",
    title: dict.meta.catalogTitle,
    description: dict.meta.catalogDescription,
    image: "/images/categories/beans.jpg",
  });
}

export default async function CatalogPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.catalog.eyebrow}
        title={dict.catalog.title}
        text={dict.catalog.intro}
        image="/images/categories/dried-fruits.jpg"
        breadcrumbLabel={dict.common.breadcrumb}
        breadcrumbs={[{ href: "", label: dict.nav.home }, { label: dict.nav.catalog }]}
      />

      {/* Category overview */}
      <section className="bg-sand-50 pt-20 lg:pt-28">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((item) => (
              <li
                key={item.slug}
                className="rounded-card border border-forest-900/8 bg-white/70 p-6 shadow-[var(--shadow-soft)]"
              >
                <h2 className="font-display text-lg text-forest-950">
                  {t(item.name, locale)}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {t(item.description, locale)}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-sand-50 py-16 lg:py-24">
        <Container>
          <CatalogBrowser items={toCatalogItems(products, locale)} locale={locale} dict={dict} />
        </Container>
      </section>

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

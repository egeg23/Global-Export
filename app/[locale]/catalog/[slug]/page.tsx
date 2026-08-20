import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/cards/product-card";
import { CtaForm } from "@/components/sections/cta-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategory } from "@/content/categories";
import { getDictionary } from "@/content/dictionaries";
import { getProduct, getProductsByCategory, products } from "@/content/products";
import { isLocale, locales, localeHref, t, type Locale } from "@/lib/i18n";
import { pageMetadata, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    products.map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const product = getProduct(slug);
  if (!product) return {};

  return pageMetadata({
    locale,
    path: `catalog/${slug}`,
    title: t(product.name, locale),
    description: t(product.description, locale).slice(0, 300),
    image: product.image,
  });
}

export default async function ProductPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const product = getProduct(slug);
  if (!product) notFound();

  const dict = getDictionary(locale);
  const category = getCategory(product.category);
  const related = getProductsByCategory(product.category)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: t(product.name, locale),
    description: t(product.description, locale),
    image: `${siteUrl}${product.image}`,
    category: category ? t(category.name, locale) : undefined,
    brand: { "@type": "Brand", name: "Global Export Company" },
    countryOfOrigin: "UZ",
  };

  return (
    <>
      <section className="bg-forest-950 pt-32 lg:pt-40">
        <Container>
          <nav aria-label="Breadcrumb" className="pb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-sand-300/55">
              <li>
                <Link
                  href={localeHref(locale)}
                  className="link-underline transition-colors hover:text-sand-100"
                >
                  {dict.nav.home}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={localeHref(locale, "catalog")}
                  className="link-underline transition-colors hover:text-sand-100"
                >
                  {dict.nav.catalog}
                </Link>
              </li>
              {category ? (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`${localeHref(locale, "catalog")}?category=${category.slug}`}
                      className="link-underline transition-colors hover:text-sand-100"
                    >
                      {t(category.name, locale)}
                    </Link>
                  </li>
                </>
              ) : null}
              <li aria-hidden="true">/</li>
              <li className="text-sand-200/80">{t(product.name, locale)}</li>
            </ol>
          </nav>
        </Container>
      </section>

      <section className="bg-forest-950 pb-20 lg:pb-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                <Image
                  src={product.image}
                  alt={t(product.name, locale)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              {category ? (
                <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-harvest-300">
                  <span aria-hidden="true" className="h-px w-6 bg-harvest-300/60" />
                  {t(category.name, locale)}
                </span>
              ) : null}

              <h1 className="mt-5 text-3xl leading-[1.1] text-sand-50 sm:text-4xl lg:text-5xl">
                {t(product.name, locale)}
              </h1>

              {product.latinName ? (
                <p className="mt-2 text-sm italic text-sand-300/60">{product.latinName}</p>
              ) : null}

              <p className="mt-6 text-base leading-relaxed text-sand-200/80">
                {t(product.description, locale)}
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="#enquiry"
                  className="inline-flex h-12 items-center rounded-full bg-sand-50 px-7 text-[0.95rem] font-medium text-forest-900 transition-colors duration-300 hover:bg-white"
                >
                  {dict.common.requestQuote}
                </Link>
                <Link
                  href={localeHref(locale, "catalog")}
                  className="inline-flex h-12 items-center rounded-full border border-sand-50/25 px-7 text-[0.95rem] font-medium text-sand-50 transition-colors duration-300 hover:border-sand-50/60 hover:bg-sand-50/10"
                >
                  {dict.catalog.allCategories}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Specifications */}
      <section className="bg-sand-50 py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-display text-2xl text-forest-950">
                {dict.product.specifications}
              </h2>

              <dl className="mt-8 divide-y divide-forest-900/8 border-y border-forest-900/8">
                {product.specs.map((spec) => (
                  <div
                    key={t(spec.label, locale)}
                    className="grid gap-1 py-4 sm:grid-cols-5 sm:gap-6"
                  >
                    <dt className="text-sm text-ink-subtle sm:col-span-2">
                      {t(spec.label, locale)}
                    </dt>
                    <dd className="text-[0.95rem] text-forest-950 sm:col-span-3">
                      {t(spec.value, locale)}
                    </dd>
                  </div>
                ))}

                {product.hsCode ? (
                  <div className="grid gap-1 py-4 sm:grid-cols-5 sm:gap-6">
                    <dt className="text-sm text-ink-subtle sm:col-span-2">
                      {dict.product.hsCode}
                    </dt>
                    <dd className="text-[0.95rem] text-forest-950 sm:col-span-3">
                      {product.hsCode}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="space-y-6">
                {product.packaging ? (
                  <div className="rounded-card border border-forest-900/8 bg-white/70 p-7 shadow-[var(--shadow-soft)]">
                    <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-500">
                      {dict.product.packaging}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {t(product.packaging, locale)}
                    </p>
                  </div>
                ) : null}

                {product.regions ? (
                  <div className="rounded-card border border-forest-900/8 bg-white/70 p-7 shadow-[var(--shadow-soft)]">
                    <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-500">
                      {dict.product.regions}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {t(product.regions, locale)}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 ? (
        <section className="bg-sand-100 py-20 lg:py-28">
          <Container>
            <SectionHeading
              eyebrow={category ? t(category.shortName, locale) : dict.catalog.eyebrow}
              title={dict.product.related}
            />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal as="li" key={item.slug} delay={index * 80}>
                  <ProductCard product={item} locale={locale} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <CtaForm
        locale={locale}
        dict={dict}
        defaultProduct={t(product.name, locale)}
        products={products.map((item) => ({
          value: item.slug,
          label: t(item.name, locale),
        }))}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

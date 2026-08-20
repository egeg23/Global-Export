import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsCard } from "@/components/cards/news-card";
import { CtaForm } from "@/components/sections/cta-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/content/dictionaries";
import { getNewsItem, news } from "@/content/news";
import { formatDate, paragraphs } from "@/lib/format";
import { isLocale, locales, localeHref, t, type Locale } from "@/lib/i18n";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => news.map((item) => ({ locale, slug: item.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const item = getNewsItem(slug);
  if (!item) return {};

  return pageMetadata({
    locale,
    path: `news/${slug}`,
    title: t(item.title, locale),
    description: t(item.excerpt, locale),
    image: item.image,
    type: "article",
    publishedTime: item.date,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const item = getNewsItem(slug);
  if (!item) notFound();

  const dict = getDictionary(locale);
  const related = news.filter((entry) => entry.slug !== item.slug).slice(0, 3);
  const body = paragraphs(t(item.body, locale));

  const articleUrl = `${siteUrl}/${locale}/news/${item.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: t(item.title, locale),
    description: t(item.excerpt, locale),
    datePublished: item.date,
    dateModified: item.date,
    inLanguage: locale,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    image: item.image ? absoluteUrl(item.image) : undefined,
    author: { "@type": "Organization", name: "Global Export Company" },
    publisher: {
      "@type": "Organization",
      name: "Global Export Company",
      logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.svg") },
    },
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: dict.nav.home, path: `/${locale}` },
    { name: dict.nav.news, path: `/${locale}/news` },
    { name: t(item.title, locale), path: `/${locale}/news/${item.slug}` },
  ]);

  return (
    <>
      <section className="bg-forest-950 pb-16 pt-32 lg:pb-20 lg:pt-40">
        <Container size="narrow">
          <nav aria-label={dict.common.breadcrumb}>
            <ol className="flex flex-wrap items-center gap-2 text-xs text-sand-300/75">
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
                  href={localeHref(locale, "news")}
                  className="link-underline transition-colors hover:text-sand-100"
                >
                  {dict.nav.news}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.14em] text-harvest-300">
            <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
            {item.tag ? (
              <>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-harvest-300/70" />
                <span>{t(item.tag, locale)}</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-5 text-3xl leading-[1.12] text-sand-50 sm:text-4xl lg:text-[3rem]">
            {t(item.title, locale)}
          </h1>
        </Container>
      </section>

      {item.image ? (
        <div className="bg-forest-950">
          <Container size="narrow">
            <div className="relative aspect-[16/9] -mb-16 overflow-hidden rounded-card lg:-mb-24">
              <Image
                src={item.image}
                alt={t(item.title, locale)}
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </Container>
        </div>
      ) : null}

      <article className="bg-sand-50 pb-20 pt-28 lg:pb-28 lg:pt-36">
        <Container size="narrow">
          <div className="space-y-6">
            {body.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-[1.75] text-ink-muted sm:text-[1.0625rem]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-14 border-t border-forest-900/10 pt-8">
            <Link
              href={localeHref(locale, "news")}
              className="link-underline text-sm font-medium text-forest-700"
            >
              ← {dict.news.allNews}
            </Link>
          </div>
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="bg-sand-100 py-20 lg:py-28">
          <Container>
            <SectionHeading eyebrow={dict.news.eyebrow} title={dict.news.related} />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((entry, index) => (
                <Reveal as="li" key={entry.slug} delay={index * 80}>
                  <NewsCard item={entry} locale={locale} readLabel={dict.common.readMore} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <CtaForm locale={locale} dict={dict} />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}

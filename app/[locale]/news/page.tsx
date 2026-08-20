import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsCard } from "@/components/cards/news-card";
import { CtaForm } from "@/components/sections/cta-form";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/content/dictionaries";
import { news } from "@/content/news";
import { isLocale, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return pageMetadata({
    locale,
    path: "news",
    title: dict.meta.newsTitle,
    description: dict.meta.newsDescription,
    image: news[0]?.image,
  });
}

export default async function NewsPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.news.eyebrow}
        title={dict.news.title}
        text={dict.news.intro}
        breadcrumbLabel={dict.common.breadcrumb}
        breadcrumbs={[{ href: "", label: dict.nav.home }, { label: dict.nav.news }]}
      />

      <section className="bg-sand-50 py-20 lg:py-28">
        <Container>
          {/* The cards carry h3 headings; this keeps the outline h1 → h2 → h3
              without adding a redundant visible title under the page hero. */}
          <h2 className="sr-only">{dict.news.allNews}</h2>

          {news.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item, index) => (
                <Reveal as="li" key={item.slug} delay={(index % 3) * 80}>
                  <NewsCard
                    item={item}
                    locale={locale}
                    readLabel={dict.common.readMore}
                    priority={index < 3}
                  />
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="text-ink-muted">{dict.news.empty}</p>
          )}
        </Container>
      </section>

      <CtaForm locale={locale} dict={dict} />
    </>
  );
}

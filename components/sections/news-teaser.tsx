import Link from "next/link";

import { NewsCard } from "@/components/cards/news-card";
import { ArrowRight } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Dictionary } from "@/content/dictionaries";
import { getLatestNews } from "@/content/news";
import { localeHref, type Locale } from "@/lib/i18n";

export function NewsTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = getLatestNews(3);
  if (items.length === 0) return null;

  return (
    <section className="bg-sand-100 py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={dict.home.newsEyebrow}
          title={dict.home.newsTitle}
          action={
            <Link
              href={localeHref(locale, "news")}
              className="group inline-flex items-center gap-2 text-[0.95rem] font-medium text-forest-800"
            >
              <span className="link-underline">{dict.news.allNews}</span>
              <ArrowRight />
            </Link>
          }
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal as="li" key={item.slug} delay={index * 80}>
              <NewsCard item={item} locale={locale} readLabel={dict.common.readMore} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

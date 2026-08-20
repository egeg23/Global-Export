import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories } from "@/content/categories";
import type { Dictionary } from "@/content/dictionaries";
import { localeHref, t, type Locale } from "@/lib/i18n";

export function CategoriesGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-sand-100 py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={dict.home.categoriesEyebrow}
          title={dict.home.categoriesTitle}
          text={dict.home.categoriesText}
          action={
            <Link
              href={localeHref(locale, "catalog")}
              className="group inline-flex items-center gap-2 text-[0.95rem] font-medium text-forest-800"
            >
              <span className="link-underline">{dict.common.viewCatalog}</span>
              <ArrowRight />
            </Link>
          }
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {categories.map((category, index) => (
            <Reveal as="li" key={category.slug} delay={index * 90}>
              <Link
                href={`${localeHref(locale, "catalog")}?category=${category.slug}`}
                className="group hover-lift relative flex h-full flex-col overflow-hidden rounded-card bg-forest-950 shadow-[var(--shadow-soft)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={t(category.name, locale)}
                    fill
                    sizes="(min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/25 to-transparent"
                  />
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-2xl text-sand-50">
                    {t(category.name, locale)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-sand-200/70">
                    {t(category.description, locale)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-harvest-300">
                    {dict.common.learnMore}
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

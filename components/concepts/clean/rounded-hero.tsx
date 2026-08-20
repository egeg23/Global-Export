import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { company } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { localeHref, t, type Locale } from "@/lib/i18n";

/**
 * Concept B hero. The deep bottom radius is the move the client's own
 * reference leans on: the photograph reads as a card set into the page rather
 * than a full-bleed banner, which keeps the page feeling light.
 */
export function RoundedHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative isolate flex min-h-[46rem] items-center overflow-hidden rounded-b-[3rem] bg-forest-900 pb-20 pt-36 sm:rounded-b-[5rem] lg:min-h-[48rem]">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/90 via-forest-950/65 to-forest-950/25"
      />

      <Container className="relative">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-sand-50/25 bg-sand-50/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sand-100 backdrop-blur-sm">
            {dict.home.heroEyebrow}
          </span>

          <h1 className="mt-8 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.08] text-sand-50">
            {t(company.tagline, locale)}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-sand-200/85 sm:text-lg">
            {t(company.description, locale)}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={localeHref(locale, "catalog")}
              className="inline-flex h-13 items-center rounded-full bg-harvest-400 px-8 text-base font-medium text-forest-950 transition-colors duration-300 hover:bg-harvest-300"
            >
              {dict.home.heroCtaPrimary}
            </Link>
            <Link
              href={localeHref(locale, "contacts")}
              className="inline-flex h-13 items-center rounded-full border border-sand-50/30 bg-sand-50/10 px-8 text-base font-medium text-sand-50 backdrop-blur-sm transition-colors duration-300 hover:bg-sand-50/20"
            >
              {dict.home.heroCtaSecondary}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

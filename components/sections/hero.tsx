import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { company, stats } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { localeHref, t, type Locale } from "@/lib/i18n";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const headline = t(company.tagline, locale);
  // Capacity, reach and footprint — the three figures a buyer screens on first.
  const highlights = stats.slice(0, 3);

  return (
    <section className="relative isolate flex min-h-[94svh] flex-col justify-end overflow-hidden bg-forest-950 pb-10 pt-32">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Two overlays: a vertical scrim for the text, a warm tint for mood. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/75 to-forest-950/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(120% 80% at 15% 100%, rgba(224,170,61,0.35), transparent 60%)",
        }}
      />

      <Container className="relative">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-harvest-300">
            <span aria-hidden="true" className="h-px w-6 bg-harvest-300/60" />
            {dict.home.heroEyebrow}
          </span>

          <h1 className="mt-6 text-4xl leading-[1.06] text-sand-50 sm:text-6xl lg:text-[4.25rem]">
            {headline}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-sand-200/85 sm:text-lg">
            {t(company.description, locale)}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={localeHref(locale, "catalog")}
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-sand-50 px-8 text-base font-medium text-forest-900 transition-all duration-300 hover:bg-white hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)]"
            >
              {dict.home.heroCtaPrimary}
              <ArrowRight />
            </Link>
            <Link
              href={localeHref(locale, "contacts")}
              className="group inline-flex h-13 items-center gap-2 rounded-full border border-sand-50/30 px-8 text-base font-medium text-sand-50 transition-all duration-300 hover:border-sand-50/70 hover:bg-sand-50/10"
            >
              {dict.home.heroCtaSecondary}
              <ArrowRight />
            </Link>
          </div>
        </div>

        <dl className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-sand-50/12 bg-sand-50/12 sm:grid-cols-3">
          {highlights.map((stat) => (
            <div key={stat.value + t(stat.label, locale)} className="bg-forest-950/70 px-6 py-6 backdrop-blur-sm">
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sand-300/60">
                {t(stat.label, locale)}
              </dt>
              <dd className="mt-2 font-display text-3xl text-sand-50">
                {stat.value}
                {stat.suffix ? (
                  <span className="ml-1 text-lg text-harvest-300">{t(stat.suffix, locale)}</span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

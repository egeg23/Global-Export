import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { company, stats } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { localeHref, t, type Locale } from "@/lib/i18n";

/**
 * Concept A hero: a full-height black frame with the photograph inset and
 * masked, so the page opens like a title card rather than a banner.
 */
export function CinematicHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#0b0b0a] pb-16 pt-28">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="-z-20 scale-105 object-cover opacity-55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b0b0a] via-[#0b0b0a]/55 to-[#0b0b0a]"
      />
      {/* Film-grain wash keeps the large flat areas from banding. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 0.5px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />

      <Container className="relative flex min-h-[calc(100svh-11rem)] flex-col justify-between">
        <div className="pt-[12vh]">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-harvest-300">
            {dict.home.heroEyebrow}
          </p>

          <h1 className="mt-10 max-w-5xl font-display text-[clamp(2.75rem,7.5vw,6.5rem)] font-normal leading-[0.95] tracking-[-0.02em] text-sand-50">
            {t(company.tagline, locale)}
          </h1>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
            <Link
              href={localeHref(locale, "catalog")}
              className="group inline-flex items-center gap-3 text-base font-medium text-sand-50"
            >
              <span className="link-underline">{dict.home.heroCtaPrimary}</span>
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-50/30 transition-all duration-500 group-hover:border-harvest-300 group-hover:bg-harvest-300 group-hover:text-[#0b0b0a]"
              >
                →
              </span>
            </Link>

            <Link
              href={localeHref(locale, "contacts")}
              className="link-underline text-base text-sand-200/70 transition-colors hover:text-sand-50"
            >
              {dict.home.heroCtaSecondary}
            </Link>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-y-8 border-t border-sand-50/12 pt-8 md:grid-cols-4">
          {stats.slice(0, 4).map((stat) => (
            <div key={stat.value + t(stat.label, locale)}>
              <dd className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-none text-sand-50">
                {stat.value}
                {stat.suffix ? (
                  <span className="ml-1 text-base text-harvest-300">
                    {t(stat.suffix, locale)}
                  </span>
                ) : null}
              </dd>
              <dt className="mt-3 max-w-[14rem] text-[0.7rem] uppercase tracking-[0.18em] text-sand-300/55">
                {t(stat.label, locale)}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

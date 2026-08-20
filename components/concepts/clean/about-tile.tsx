import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { capacityLines, company } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { localeHref, t, type Locale } from "@/lib/i18n";

/** Photo tile left, copy right — the reference's about block, softened. */
export function AboutTile({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-sand-50 pb-8 pt-4 lg:pb-12">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
              <Image
                src="/images/production.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-7 lg:pt-6">
            <Reveal delay={100}>
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-forest-600">
                {dict.home.aboutEyebrow}
              </span>
              <h2 className="mt-4 text-3xl leading-tight text-forest-950 sm:text-4xl">
                {dict.about.title}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted sm:text-lg">
                {t(company.mission, locale)}
              </p>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                {dict.about.facilitiesText}
              </p>

              <Link
                href={localeHref(locale, "about")}
                className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-forest-800 px-7 text-[0.95rem] font-medium text-sand-50 transition-colors duration-300 hover:bg-forest-700"
              >
                {dict.common.learnMore}
                <ArrowRight />
              </Link>
            </Reveal>

            <Reveal delay={180}>
              <dl className="mt-12 grid gap-4 border-t border-forest-900/10 pt-8 sm:grid-cols-3">
                {capacityLines.map((line) => (
                  <div key={line.label.en}>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-600">
                      {t(line.label, locale)}
                    </dt>
                    <dd className="mt-2 font-display text-2xl text-forest-900">
                      {t(line.value, locale)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import type { Dictionary } from "@/content/dictionaries";
import { getCertificates } from "@/lib/content/source";
import { localeHref, t, type Locale } from "@/lib/i18n";

export async function QualityTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const certificates = await getCertificates();

  return (
    <section className="bg-sand-50 py-24 lg:py-32">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="order-2 lg:order-1 lg:col-span-5">
            <div className="relative aspect-[5/6] overflow-hidden rounded-card">
              <Image
                src="/images/quality.jpg"
                alt={dict.quality.title}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <Reveal>
              <Eyebrow>{dict.home.qualityEyebrow}</Eyebrow>
              <h2 className="mt-5 text-3xl leading-[1.15] text-forest-950 sm:text-4xl lg:text-[2.75rem]">
                {dict.home.qualityTitle}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink-muted sm:text-lg">
                {dict.quality.intro}
              </p>
            </Reveal>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {certificates.map((certificate, index) => (
                <Reveal as="li" key={certificate.slug} delay={index * 80}>
                  <div className="h-full rounded-2xl border border-forest-900/8 bg-white/70 p-6 shadow-[var(--shadow-soft)]">
                    <p className="font-display text-lg text-forest-900">{certificate.name}</p>
                    {certificate.issuer ? (
                      <p className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-forest-500">
                        {certificate.issuer}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {t(certificate.description, locale)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={160}>
              <Link
                href={localeHref(locale, "quality")}
                className="group mt-9 inline-flex items-center gap-2 text-[0.95rem] font-medium text-forest-800"
              >
                <span className="link-underline">{dict.common.learnMore}</span>
                <ArrowRight />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

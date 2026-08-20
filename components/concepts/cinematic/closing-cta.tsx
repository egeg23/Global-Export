import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { certificates } from "@/content/certificates";
import { contacts } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { localeHref, t, type Locale } from "@/lib/i18n";

/** Certificates as a quiet rule of text, then a full-bleed closing frame. */
export function ClosingCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <>
      <section className="border-t border-sand-50/8 bg-[#0b0b0a] py-20">
        <Container>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-harvest-300">
            {dict.home.qualityEyebrow}
          </p>
          <ul className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-6">
            {certificates.map((certificate) => (
              <li
                key={certificate.slug}
                className="font-display text-[clamp(1.25rem,2.4vw,2rem)] text-sand-50/85"
              >
                {certificate.name}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-[#0b0b0a]">
        <Image
          src="/images/production.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b0b0a] via-[#0b0b0a]/60 to-[#0b0b0a]/80"
        />

        <Container className="relative py-24 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-4xl font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] text-sand-50">
              {dict.home.ctaTitle}
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-sand-300/70">
              {dict.home.ctaText}
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              <Link
                href={localeHref(locale, "contacts")}
                className="group inline-flex items-center gap-3 rounded-full bg-harvest-300 px-9 py-4 text-base font-medium text-[#0b0b0a] transition-colors duration-300 hover:bg-harvest-200"
              >
                {dict.common.requestQuote}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {contacts.emails[0] ? (
                <a
                  href={contacts.emails[0].href}
                  className="link-underline text-base text-sand-200/70 transition-colors hover:text-sand-50"
                >
                  {contacts.emails[0].value}
                </a>
              ) : null}
            </div>
          </Reveal>

          <p className="mt-14 text-[0.7rem] uppercase tracking-[0.3em] text-sand-300/45">
            {t(contacts.address, locale)}
          </p>
        </Container>
      </section>
    </>
  );
}

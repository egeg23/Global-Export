import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { capacityLines, company } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { localeHref, t, type Locale } from "@/lib/i18n";

export function AboutIntro({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-sand-50 py-24 lg:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow>{dict.home.aboutEyebrow}</Eyebrow>
              <h2 className="mt-5 text-3xl leading-[1.15] text-forest-950 sm:text-4xl lg:text-[2.75rem]">
                {t(company.mission, locale)}
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-7 text-base leading-relaxed text-ink-muted sm:text-lg">
                {t(company.description, locale)}
              </p>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                {locale === "ru"
                  ? "Современные производственные площадки, собственная лаборатория, сертифицированные системы пищевой безопасности и полный пакет экспортных документов обеспечивают эффективное управление международными отгрузками."
                  : locale === "uz"
                    ? "Zamonaviy ishlab chiqarish maydonchalari, o‘z laboratoriyamiz, sertifikatlangan oziq-ovqat xavfsizligi tizimlari va to‘liq eksport hujjatlari xalqaro jo‘natmalarni samarali boshqarishni ta’minlaydi."
                    : "Modern production facilities, an in-house laboratory, certified food safety systems, and complete export documentation support the efficient management of international shipments."}
              </p>

              <Link
                href={localeHref(locale, "about")}
                className="group mt-9 inline-flex items-center gap-2 text-[0.95rem] font-medium text-forest-800"
              >
                <span className="link-underline">{dict.common.learnMore}</span>
                <ArrowRight />
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={80} className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                <Image
                  src="/images/production.jpg"
                  alt={t(company.name, locale)}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>

              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                {capacityLines.map((line, index) => (
                  <div
                    key={line.value}
                    className="rounded-2xl border border-forest-900/8 bg-white/70 px-5 py-5 shadow-[var(--shadow-soft)]"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-500">
                      {t(line.label, locale)}
                    </dt>
                    <dd className="mt-2 font-display text-2xl text-forest-900">{line.value}</dd>
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

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Advantages } from "@/components/sections/advantages";
import { CtaForm } from "@/components/sections/cta-form";
import { PageHero } from "@/components/sections/page-hero";
import { Process } from "@/components/sections/process";
import { StatsBand } from "@/components/sections/stats-band";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { capacityLines, company, facilities } from "@/content/company";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return pageMetadata({
    locale,
    path: "about",
    title: dict.meta.aboutTitle,
    description: dict.meta.aboutDescription,
    image: "/images/production.jpg",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.about.eyebrow}
        title={t(company.tagline, locale)}
        text={t(company.description, locale)}
        image="/images/production.jpg"
        breadcrumbs={[
          { href: "", label: dict.nav.home },
          { label: dict.nav.about },
        ]}
      />

      {/* Mission */}
      <section className="bg-sand-50 py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading eyebrow={dict.about.eyebrow} title={dict.about.missionTitle} />
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={100}>
                <p className="text-xl leading-relaxed text-forest-900 sm:text-2xl">
                  {t(company.mission, locale)}
                </p>
                <p className="mt-6 text-base leading-relaxed text-ink-muted">
                  {locale === "ru"
                    ? "Современные производственные мощности, собственная лаборатория, сертифицированные системы безопасности пищевой продукции и полный пакет экспортной документации обеспечивают эффективную организацию международных поставок."
                    : locale === "uz"
                      ? "Zamonaviy ishlab chiqarish quvvatlari, o‘z laboratoriyamiz, sertifikatlangan oziq-ovqat xavfsizligi tizimlari va to‘liq eksport hujjatlari xalqaro yetkazib berishni samarali tashkil etishni ta’minlaydi."
                      : "Modern production facilities, an in-house laboratory, certified food safety systems, and complete export documentation support the efficient management of international shipments."}
                </p>
              </Reveal>

              <dl className="mt-12 grid gap-5 sm:grid-cols-3">
                {capacityLines.map((line, index) => (
                  <Reveal key={line.value} delay={index * 80}>
                    <div className="rounded-2xl border border-forest-900/8 bg-white/70 px-6 py-6 shadow-[var(--shadow-soft)]">
                      <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-500">
                        {t(line.label, locale)}
                      </dt>
                      <dd className="mt-2 font-display text-2xl text-forest-900">{line.value}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <StatsBand locale={locale} dict={dict} />

      {/* Facilities */}
      <section className="bg-sand-100 py-24 lg:py-32">
        <Container>
          <SectionHeading
            eyebrow={dict.about.eyebrow}
            title={dict.about.facilitiesTitle}
          />

          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {facilities.map((facility, index) => (
              <Reveal as="li" key={t(facility.name, locale)} delay={(index % 2) * 90}>
                <div className="flex h-full flex-col rounded-card border border-forest-900/8 bg-white/70 p-8 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="font-display text-xl text-forest-950">
                      {t(facility.name, locale)}
                    </h3>
                    {facility.capacity ? (
                      <span className="shrink-0 rounded-full bg-forest-800/8 px-3 py-1 text-xs font-semibold text-forest-700">
                        {facility.capacity}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                    {t(facility.description, locale)}
                  </p>
                  <p className="mt-5 text-[0.7rem] uppercase tracking-[0.14em] text-forest-500">
                    {t(facility.location, locale)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <Process locale={locale} dict={dict} />
      <Advantages locale={locale} dict={dict} />

      {/* Photo band */}
      <section className="relative h-[38vh] min-h-64 overflow-hidden lg:h-[52vh]">
        <Image
          src="/images/quality.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-forest-950/35" />
      </section>

      <CtaForm locale={locale} dict={dict} />
    </>
  );
}

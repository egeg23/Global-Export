import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaForm } from "@/components/sections/cta-form";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { certificates, qualityStages, recognitions } from "@/content/certificates";
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
    path: "quality",
    title: dict.meta.qualityTitle,
    description: dict.meta.qualityDescription,
    image: "/images/quality.jpg",
  });
}

export default async function QualityPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.quality.eyebrow}
        title={dict.quality.title}
        text={dict.quality.intro}
        image="/images/quality.jpg"
        breadcrumbs={[{ href: "", label: dict.nav.home }, { label: dict.nav.quality }]}
      />

      {/* Certificates */}
      <section className="bg-sand-50 py-24 lg:py-32">
        <Container>
          <SectionHeading
            eyebrow={dict.quality.eyebrow}
            title={dict.quality.certificatesTitle}
          />

          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {certificates.map((certificate, index) => (
              <Reveal as="li" key={certificate.slug} delay={(index % 2) * 90}>
                <div className="flex h-full flex-col rounded-card border border-forest-900/8 bg-white/70 p-8 shadow-[var(--shadow-soft)]">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-800/8 text-forest-700">
                    <Icon name="shield" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-forest-950">
                    {certificate.name}
                  </h3>
                  {certificate.issuer ? (
                    <p className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-forest-500">
                      {certificate.issuer}
                    </p>
                  ) : null}
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {t(certificate.description, locale)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Control stages */}
      <section className="bg-forest-900 py-24 text-sand-50 lg:py-32">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow={dict.quality.eyebrow}
            title={dict.quality.controlTitle}
          />

          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {qualityStages.map((stage, index) => (
              <Reveal as="li" key={stage.icon} delay={(index % 3) * 90}>
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sand-50/8 text-harvest-300">
                    <Icon name={stage.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-2xl text-harvest-300/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl text-sand-50">
                  {t(stage.title, locale)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-sand-200/70">
                  {t(stage.description, locale)}
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Recognition */}
      <section className="bg-sand-100 py-24 lg:py-32">
        <Container>
          <SectionHeading
            eyebrow={dict.quality.eyebrow}
            title={dict.quality.traceabilityTitle}
            text={
              locale === "ru"
                ? "Каждая упакованная партия имеет код, по которому прослеживается регион выращивания, дата переработки и протокол лаборатории. Арбитражные пробы хранятся весь срок годности партии."
                : locale === "uz"
                  ? "Har bir qadoqlangan partiyada kod bo‘ladi — u yetishtirish hududi, qayta ishlash sanasi va laboratoriya bayonnomasiga olib boradi. Namunalar partiyaning yaroqlilik muddati davomida saqlanadi."
                  : "Every packed lot carries a code that traces back to the growing region, the processing date and the laboratory report. Retained samples are kept for the shelf life of the lot."
            }
          />

          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {recognitions.map((item, index) => (
              <Reveal as="li" key={t(item.title, locale)} delay={index * 90}>
                <div className="h-full rounded-card border border-forest-900/8 bg-white/70 p-8 shadow-[var(--shadow-soft)]">
                  <h3 className="font-display text-xl text-forest-950">
                    {t(item.title, locale)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {t(item.description, locale)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CtaForm locale={locale} dict={dict} />
    </>
  );
}

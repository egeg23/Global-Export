import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { certificates, qualityStages } from "@/content/certificates";
import type { Dictionary } from "@/content/dictionaries";
import { t, type Locale } from "@/lib/i18n";

/**
 * Control stages as full-width rows, then the certificates as a snap-scrolling
 * rail — both taken from the pattern the client's reference uses.
 */
export function QualityRows({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-sand-100 py-24 lg:py-32">
      <Container>
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-forest-600">
          {dict.home.qualityEyebrow}
        </span>
        <h2 className="mt-4 max-w-2xl text-3xl leading-tight text-forest-950 sm:text-4xl">
          {dict.quality.controlTitle}
        </h2>

        <ul className="mt-12 divide-y divide-forest-900/10 border-y border-forest-900/10">
          {qualityStages.map((stage, index) => (
            <Reveal as="li" key={stage.icon} delay={(index % 3) * 70}>
              <div className="grid gap-4 py-6 sm:grid-cols-12 sm:items-center sm:gap-8">
                <div className="flex items-center gap-4 sm:col-span-5">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-forest-700 shadow-[var(--shadow-soft)]">
                    <Icon name={stage.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg text-forest-950">
                    {t(stage.title, locale)}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted sm:col-span-7">
                  {t(stage.description, locale)}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>

      <div className="mt-14 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max snap-x snap-mandatory gap-4 px-5 sm:px-8 lg:px-12">
          {certificates.map((certificate) => (
            <li
              key={certificate.slug}
              className="w-[20rem] shrink-0 snap-start rounded-[1.5rem] border border-forest-900/8 bg-white p-7 shadow-[var(--shadow-soft)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-800/8 text-forest-700">
                <Icon name="shield" className="h-5 w-5" />
              </span>
              <p className="mt-5 font-display text-xl text-forest-950">{certificate.name}</p>
              {certificate.issuer ? (
                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-forest-600">
                  {certificate.issuer}
                </p>
              ) : null}
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                {t(certificate.description, locale)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

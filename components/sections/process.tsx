import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { process } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { t, type Locale } from "@/lib/i18n";

export function Process({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-sand-100 py-24 lg:py-32">
      <Container>
        <SectionHeading eyebrow={dict.home.processEyebrow} title={dict.home.processTitle} />

        <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {process.map((step, index) => (
            <Reveal as="li" key={step.step} delay={(index % 3) * 90} className="relative">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-4xl leading-none text-harvest-400/70">
                  {step.step}
                </span>
                <span className="h-px flex-1 bg-forest-900/12" />
              </div>
              <h3 className="mt-5 font-display text-xl text-forest-950">
                {t(step.title, locale)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {t(step.description, locale)}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

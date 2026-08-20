import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { advantages } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { t, type Locale } from "@/lib/i18n";

export function Advantages({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-sand-50 py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={dict.home.advantagesEyebrow}
          title={dict.home.advantagesTitle}
        />

        <ul className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage, index) => (
            <Reveal as="li" key={advantage.icon} delay={(index % 3) * 90}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-800/8 text-forest-700">
                <Icon name={advantage.icon} />
              </span>
              <h3 className="mt-5 font-display text-xl text-forest-950">
                {t(advantage.title, locale)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {t(advantage.description, locale)}
              </p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

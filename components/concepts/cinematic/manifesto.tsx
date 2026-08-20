import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { company } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { t, type Locale } from "@/lib/i18n";

/**
 * A single statement at display size, the way an editorial spread opens a
 * feature. No image, no card — the pause between two dense sections.
 */
export function Manifesto({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-[#0b0b0a] py-28 lg:py-40">
      <Container>
        <Reveal>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-harvest-300">
            {dict.home.aboutEyebrow}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-12 max-w-5xl font-display text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.25] tracking-[-0.01em] text-sand-50">
            {t(company.mission, locale)}
          </p>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-12 max-w-2xl text-base leading-relaxed text-sand-300/60">
            {t(company.description, locale)}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

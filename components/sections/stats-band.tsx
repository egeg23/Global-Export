import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { stats } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { t, type Locale } from "@/lib/i18n";

export function StatsBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-forest-900 py-20 text-sand-50 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(250,246,238,0.9) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <Container className="relative">
        <Reveal>
          <Eyebrow tone="light">{dict.home.statsTitle}</Eyebrow>
        </Reveal>

        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal key={t(stat.label, locale)} delay={index * 70}>
              <dd className="font-display text-4xl leading-none text-sand-50 sm:text-5xl">
                {stat.value}
                {stat.suffix ? (
                  <span className="ml-1.5 text-2xl text-harvest-300">{t(stat.suffix, locale)}</span>
                ) : null}
              </dd>
              <dt className="mt-3 text-sm leading-snug text-sand-300/70">
                {t(stat.label, locale)}
              </dt>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}

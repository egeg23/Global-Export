import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { geographyNote, regions } from "@/content/geography";
import type { Dictionary } from "@/content/dictionaries";
import { t, type Locale } from "@/lib/i18n";

export function Geography({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-forest-950 py-24 text-sand-50 lg:py-32">
      {/* Meridian lines — a quiet nod to the globe in the logo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(250,246,238,0.6) 0 1px, transparent 1px 88px), repeating-linear-gradient(0deg, rgba(250,246,238,0.35) 0 1px, transparent 1px 88px)",
        }}
      />

      <Container className="relative">
        <SectionHeading
          tone="light"
          eyebrow={dict.home.geographyEyebrow}
          title={dict.home.geographyTitle}
          text={t(geographyNote, locale)}
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-card border border-sand-50/10 bg-sand-50/10 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region, index) => (
            <Reveal key={region.key} delay={index * 80} className="bg-forest-950 p-7">
              <h3 className="font-display text-lg text-harvest-300">
                {t(region.name, locale)}
              </h3>
              <ul className="mt-4 space-y-2">
                {region.countries.map((country) => (
                  <li key={country.en} className="text-sm text-sand-200/70">
                    {t(country, locale)}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

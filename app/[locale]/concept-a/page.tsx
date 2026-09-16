import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClosingCta } from "@/components/concepts/cinematic/closing-cta";
import { CinematicHero } from "@/components/concepts/cinematic/hero";
import { Manifesto } from "@/components/concepts/cinematic/manifesto";
import { ProcessJourney } from "@/components/concepts/cinematic/process-journey";
import { ProductRail } from "@/components/concepts/cinematic/product-rail";
import { AboutTile } from "@/components/concepts/clean/about-tile";
import { CategoryRows } from "@/components/concepts/clean/category-rows";
import { CounterStrip } from "@/components/concepts/clean/counter-strip";
import { QualityRows } from "@/components/concepts/clean/quality-rows";
import { Extra, GlobalexConfigurator } from "@/components/concepts/showcase/configurator";
import { Addon } from "@/components/configurator/context";
import { NewsTeaser } from "@/components/sections/news-teaser";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

/**
 * Design concept A — "cinematic", the direction the client pointed at with
 * loeschs.de: near-black frames, display typography and a pinned sequence.
 *
 * A proposal route, not part of the site: it is excluded from the sitemap and
 * marked noindex, and comes out once a direction is chosen.
 *
 * On the showcase every block is behind a toggle in the configurator dock, and
 * the blocks of concept B stand here as ghosts — switch one on to compare.
 * Without SHOWCASE_ROOT the page renders exactly as before.
 */
export const metadata: Metadata = {
  title: "Концепция A — кинематографичная",
  robots: { index: false, follow: false },
};

export default async function ConceptAPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <GlobalexConfigurator locale={locale} tier="a">
      <div className="bg-[#0b0b0a]">
        <CinematicHero locale={locale} dict={dict} />
        <Addon id="manifesto">
          <Manifesto locale={locale} dict={dict} />
        </Addon>
        <Addon id="journey">
          <ProcessJourney locale={locale} dict={dict} />
        </Addon>
        <Addon id="rail">
          <ProductRail locale={locale} dict={dict} />
        </Addon>
        <Extra id="counters">
          <CounterStrip locale={locale} />
        </Extra>
        <Extra id="about">
          <AboutTile locale={locale} dict={dict} />
        </Extra>
        <Extra id="categories">
          <CategoryRows locale={locale} dict={dict} />
        </Extra>
        <Extra id="quality">
          <QualityRows locale={locale} dict={dict} />
        </Extra>
        <Extra id="news">
          <NewsTeaser locale={locale} dict={dict} />
        </Extra>
        <ClosingCta locale={locale} dict={dict} />
      </div>
    </GlobalexConfigurator>
  );
}

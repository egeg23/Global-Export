import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClosingCta } from "@/components/concepts/cinematic/closing-cta";
import { CinematicHero } from "@/components/concepts/cinematic/hero";
import { Manifesto } from "@/components/concepts/cinematic/manifesto";
import { ProcessJourney } from "@/components/concepts/cinematic/process-journey";
import { ProductRail } from "@/components/concepts/cinematic/product-rail";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

/**
 * Design concept A — "cinematic", the direction the client pointed at with
 * loeschs.de: near-black frames, display typography and a pinned sequence.
 *
 * A proposal route, not part of the site: it is excluded from the sitemap and
 * marked noindex, and comes out once a direction is chosen.
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
    <div className="bg-[#0b0b0a]">
      <CinematicHero locale={locale} dict={dict} />
      <Manifesto locale={locale} dict={dict} />
      <ProcessJourney locale={locale} dict={dict} />
      <ProductRail locale={locale} dict={dict} />
      <ClosingCta locale={locale} dict={dict} />
    </div>
  );
}

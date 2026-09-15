import type { Metadata } from "next";

import { Advantages } from "@/components/adar/base/advantages";
import { Hero } from "@/components/adar/base/hero";
import { PopularSets } from "@/components/adar/base/popular-sets";
import { SiteHeader } from "@/components/adar/base/site-header";
import { ThemesGrid } from "@/components/adar/base/themes-grid";
import { Ticker } from "@/components/adar/base/ticker";
import { SkipLink } from "@/components/adar/ui/skip-link";
import { ConceptBar } from "@/components/adar/showcase/concept-bar";
import { EstimatePanel } from "@/components/adar/showcase/estimate-panel";
import { ClientsWall } from "@/components/adar/ui/clients-wall";
import { ContactSection } from "@/components/adar/ui/contact-section";
import { SiteFooter } from "@/components/adar/ui/site-footer";
import { getConcept } from "@/content/adar/concepts";
import { showcaseChrome } from "@/lib/adar/showcase";

export const metadata: Metadata = {
  title: "Вариант 01 — «Витрина»",
};

/**
 * Вариант 01 — «Витрина».
 *
 * Кремовый фон, фирменные зелёный и золотой, крупная типографика и ничего,
 * что отвлекает от двух действий: посмотреть наборы и оставить заявку.
 * Движение здесь только одно — появление блоков при прокрутке.
 */
export default function AdarBaseConcept() {
  const concept = getConcept("base");

  return (
    <>
      <SkipLink />
      {showcaseChrome ? <ConceptBar current="base" /> : null}
      <SiteHeader />
      <main id="content">
        <Hero />
        <Ticker />
        <ThemesGrid />
        <PopularSets />
        <Advantages />
        <ClientsWall />
        <ContactSection />
      </main>
      <SiteFooter />
      {showcaseChrome ? <EstimatePanel concept={concept} /> : null}
    </>
  );
}

import type { Metadata } from "next";

import { Advantages } from "@/components/adar/base/advantages";
import { SiteHeader } from "@/components/adar/base/site-header";
import { ThemesGrid } from "@/components/adar/base/themes-grid";
import { CatalogBrowser } from "@/components/adar/plus/catalog-browser";
import { GrowthScene } from "@/components/adar/plus/growth-scene";
import { PlusHero } from "@/components/adar/plus/hero";
import { VelocityRail } from "@/components/adar/plus/velocity-rail";
import { ConceptBar } from "@/components/adar/showcase/concept-bar";
import { EstimatePanel } from "@/components/adar/showcase/estimate-panel";
import { ClientsWall } from "@/components/adar/ui/clients-wall";
import { ContactSection } from "@/components/adar/ui/contact-section";
import { SiteFooter } from "@/components/adar/ui/site-footer";
import { sets } from "@/content/adar/catalog";
import { getConcept } from "@/content/adar/concepts";
import { featuredSets, growthStages } from "@/lib/adar/catalog";

export const metadata: Metadata = {
  title: "Вариант 02 — «Каталог»",
};

/**
 * Срез каталога для одной ленты: каждый шестой набор, начиная со своего
 * смещения. Каталог отсортирован по цене, поэтому в ряд попадают и наборы
 * за 50 000, и за полтора миллиона, а соседние ряды не повторяются.
 */
function railRow(offset: number) {
  return sets.filter((_, index) => index % 6 === offset);
}

/**
 * Вариант 02 — «Каталог».
 *
 * Та же витрина, но с живым каталогом и двумя сценами: лента, которая
 * слушает прокрутку, и закреплённый кадр, где набор растёт от эконома до
 * платины. Всё движение подчинено одной задаче — показать ассортимент,
 * а не украсить страницу.
 */
export default function AdarPlusConcept() {
  const concept = getConcept("plus");

  return (
    <>
      <ConceptBar current="plus" />
      <SiteHeader />
      <main>
        <PlusHero showcase={featuredSets(3)} />
        <VelocityRail rows={[railRow(0), railRow(3)]} />
        <GrowthScene stages={growthStages} />
        <CatalogBrowser />
        <ThemesGrid />
        <Advantages />
        <ClientsWall />
        <ContactSection />
      </main>
      <SiteFooter />
      <EstimatePanel concept={concept} />
    </>
  );
}

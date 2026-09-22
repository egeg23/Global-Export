import type { Metadata } from "next";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Advantages } from "@/components/adar/base/advantages";
import { Hero } from "@/components/adar/base/hero";
import { PopularSets } from "@/components/adar/base/popular-sets";
import { SiteHeader } from "@/components/adar/base/site-header";
import { ThemesGrid } from "@/components/adar/base/themes-grid";
import { Ticker } from "@/components/adar/base/ticker";
import { CatalogBrowser } from "@/components/adar/plus/catalog-browser";
import { GrowthScene } from "@/components/adar/plus/growth-scene";
import { AboutCompany } from "@/components/adar/premium/about-company";
import { ArchiveDrum } from "@/components/adar/premium/archive-drum";
import { BudgetPicker } from "@/components/adar/premium/budget-picker";
import { CorporateBlock } from "@/components/adar/premium/corporate-block";
import { SkipLink } from "@/components/adar/ui/skip-link";
import { ConceptBar } from "@/components/adar/showcase/concept-bar";
import { AdarConfigurator, Extra } from "@/components/adar/showcase/configurator";
import { EstimatePanel } from "@/components/adar/showcase/estimate-panel";
import { ClientsWall } from "@/components/adar/ui/clients-wall";
import { ContactSection } from "@/components/adar/ui/contact-section";
import { SetShowcase } from "@/components/adar/ui/set-showcase";
import { SiteFooter } from "@/components/adar/ui/site-footer";
import { sets } from "@/content/adar/catalog";
import { getConcept } from "@/content/adar/concepts";
import { showcaseChrome } from "@/lib/adar/showcase";
import { growthStages } from "@/lib/adar/catalog";

/**
 * Вариант остаётся закрытым от поиска и на сервере заказчика: сайт у него
 * один, а два адреса с тем же содержимым делят между собой показы.
 */
export const metadata: Metadata = {
  title: "Вариант 01 — «Витрина»",
  robots: { index: false, follow: false },
};

/**
 * Вариант 01 — «Витрина».
 *
 * Кремовый фон, фирменные зелёный и золотой, крупная типографика и ничего,
 * что отвлекает от двух действий: посмотреть наборы и оставить заявку.
 * Движение здесь только одно — появление блоков при прокрутке.
 *
 * Блоки старших вариантов (`Extra`) на витрине стоят призраками с тумблером:
 * заказчик включает их и видит, за что платит. На его сервере их нет.
 */
export default function AdarBaseConcept() {
  const concept = getConcept("base");

  return (
    <AdarConfigurator tier="base">
      <DevuzIntro project="adar" />
      <SkipLink />
      {showcaseChrome ? <ConceptBar current="base" /> : null}
      <SiteHeader />
      <main id="content">
        <Hero />
        <Ticker />
        <ThemesGrid />
        <PopularSets />
        <Extra id="search">
          <CatalogBrowser />
        </Extra>
        <Extra id="growth">
          <GrowthScene stages={growthStages} />
        </Extra>
        <Extra id="rail">
          <SetShowcase
            sets={sets.filter((_, index) => index % 6 === 0)}
            title="Вся линейка одним движением"
            note="Четырнадцать наборов от эконома до платины. Пролистайте и откройте любой — внутри полный состав и вес."
          />
        </Extra>
        <Advantages />
        <Extra id="budget">
          <BudgetPicker />
        </Extra>
        <Extra id="corporate">
          <CorporateBlock />
        </Extra>
        <Extra id="archive">
          <ArchiveDrum />
        </Extra>
        <Extra id="about">
          <AboutCompany />
        </Extra>
        <ClientsWall />
        <ContactSection />
      </main>
      <SiteFooter />
      {showcaseChrome ? <EstimatePanel concept={concept} /> : null}
    </AdarConfigurator>
  );
}

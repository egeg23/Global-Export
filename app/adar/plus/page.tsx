import type { Metadata } from "next";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Advantages } from "@/components/adar/base/advantages";
import { ThemesGrid } from "@/components/adar/base/themes-grid";
import { CatalogBrowser } from "@/components/adar/plus/catalog-browser";
import { GrowthScene } from "@/components/adar/plus/growth-scene";
import { PlusHero } from "@/components/adar/plus/hero";
import { ShopHeader } from "@/components/adar/plus/shop-header";
import { AboutCompany } from "@/components/adar/premium/about-company";
import { ArchiveDrum } from "@/components/adar/premium/archive-drum";
import { BudgetPicker } from "@/components/adar/premium/budget-picker";
import { CorporateBlock } from "@/components/adar/premium/corporate-block";
import { Addon } from "@/components/configurator/context";
import { SkipLink } from "@/components/adar/ui/skip-link";
import { ConceptBar } from "@/components/adar/showcase/concept-bar";
import { AdarConfigurator, Extra } from "@/components/adar/showcase/configurator";
import { ScopePanel } from "@/components/adar/showcase/scope-panel";
import { ClientsWall } from "@/components/adar/ui/clients-wall";
import { ContactSection } from "@/components/adar/ui/contact-section";
import { SetShowcase } from "@/components/adar/ui/set-showcase";
import { SiteFooter } from "@/components/adar/ui/site-footer";
import { sets } from "@/content/adar/catalog";
import { getConcept } from "@/content/adar/concepts";
import { showcaseChrome } from "@/lib/adar/showcase";
import { featuredSets, growthStages } from "@/lib/adar/catalog";

/**
 * Вариант остаётся закрытым от поиска и на сервере заказчика: сайт у него
 * один, а два адреса с тем же содержимым делят между собой показы.
 */
export const metadata: Metadata = {
  title: "Вариант 02 — «Каталог»",
  robots: { index: false, follow: false },
};

/**
 * Срез каталога для ленты: каждый шестой набор. Каталог отсортирован по цене,
 * поэтому в ряд попадают и наборы за 50 000, и за полтора миллиона.
 */
function railRow(offset: number) {
  return sets.filter((_, index) => index % 6 === offset);
}

/**
 * Вариант 02 — «Каталог».
 *
 * Другое оформление, а не то же самое с другим содержимым: белый фон вместо
 * кремового, рубленый шрифт вместо засечного, узкие скругления и красная
 * кнопка — новогодний цвет с их упаковки. Всё это включается атрибутом
 * `data-concept="shop"`: переменные темы переопределяются, компоненты
 * остаются общими.
 *
 * По содержанию — живой каталог, лента, которую крутят руками, и
 * закреплённый кадр, где набор растёт от эконома до платины. На витрине
 * каждый из них под тумблером конструктора, а блоки «Премиума» стоят
 * призраками — их можно включить и посмотреть.
 */
export default function AdarPlusConcept() {
  const concept = getConcept("plus");

  return (
    <AdarConfigurator tier="plus">
      <DevuzIntro project="adar" />
      <SkipLink />
      {showcaseChrome ? <ConceptBar current="plus" /> : null}
      <div data-concept="shop">
        <ShopHeader />
        <main id="content">
          <PlusHero showcase={featuredSets(3)} />
          <Addon id="rail">
            <SetShowcase
              sets={railRow(0)}
              title="Вся линейка одним движением"
              note="Четырнадцать наборов от эконома до платины. Пролистайте и откройте любой — внутри полный состав и вес."
            />
          </Addon>
          <Addon id="growth">
            <GrowthScene stages={growthStages} />
          </Addon>
          <Addon id="search">
            <CatalogBrowser />
          </Addon>
          <ThemesGrid />
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
        {showcaseChrome ? <ScopePanel concept={concept} /> : null}
      </div>
    </AdarConfigurator>
  );
}

import type { Metadata } from "next";

import { Advantages } from "@/components/adar/base/advantages";
import { ThemesGrid } from "@/components/adar/base/themes-grid";
import { CatalogBrowser } from "@/components/adar/plus/catalog-browser";
import { GrowthScene } from "@/components/adar/plus/growth-scene";
import { PlusHero } from "@/components/adar/plus/hero";
import { ShopHeader } from "@/components/adar/plus/shop-header";
import { ConceptBar } from "@/components/adar/showcase/concept-bar";
import { EstimatePanel } from "@/components/adar/showcase/estimate-panel";
import { ClientsWall } from "@/components/adar/ui/clients-wall";
import { ContactSection } from "@/components/adar/ui/contact-section";
import { SetShowcase } from "@/components/adar/ui/set-showcase";
import { SiteFooter } from "@/components/adar/ui/site-footer";
import { sets } from "@/content/adar/catalog";
import { getConcept } from "@/content/adar/concepts";
import { featuredSets, growthStages } from "@/lib/adar/catalog";

export const metadata: Metadata = {
  title: "Вариант 02 — «Каталог»",
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
 * закреплённый кадр, где набор растёт от эконома до платины.
 */
export default function AdarPlusConcept() {
  const concept = getConcept("plus");

  return (
    <>
      <ConceptBar current="plus" />
      <div data-concept="shop">
        <ShopHeader />
        <main>
          <PlusHero showcase={featuredSets(3)} />
          <SetShowcase
            sets={railRow(0)}
            title="Вся линейка одним движением"
            note="Четырнадцать наборов от эконома до платины. Пролистайте и откройте любой — внутри полный состав и вес."
          />
          <GrowthScene stages={growthStages} />
          <CatalogBrowser />
          <ThemesGrid />
          <Advantages />
          <ClientsWall />
          <ContactSection />
        </main>
        <SiteFooter />
        <EstimatePanel concept={concept} />
      </div>
    </>
  );
}

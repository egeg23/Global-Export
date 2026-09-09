import type { Metadata } from "next";

import { Advantages } from "@/components/adar/base/advantages";
import { ThemesGrid } from "@/components/adar/base/themes-grid";
import { CatalogBrowser } from "@/components/adar/plus/catalog-browser";
import { BudgetPicker } from "@/components/adar/premium/budget-picker";
import { CatalogFrame } from "@/components/adar/premium/catalog-frame";
import { CinematicHero } from "@/components/adar/premium/cinematic-hero";
import { CorporateBlock } from "@/components/adar/premium/corporate-block";
import { PremiumHeader } from "@/components/adar/premium/header";
import { NumbersBand } from "@/components/adar/premium/numbers-band";
import { ConceptBar } from "@/components/adar/showcase/concept-bar";
import { EstimatePanel } from "@/components/adar/showcase/estimate-panel";
import { ClientsWall } from "@/components/adar/ui/clients-wall";
import { ContactSection } from "@/components/adar/ui/contact-section";
import { SetShowcase } from "@/components/adar/ui/set-showcase";
import { SiteFooter } from "@/components/adar/ui/site-footer";
import { sets } from "@/content/adar/catalog";
import { getConcept } from "@/content/adar/concepts";
import { growthStages } from "@/lib/adar/catalog";

export const metadata: Metadata = {
  title: "Вариант 03 — «Премиум»",
};

/**
 * Вариант 03 — «Премиум».
 *
 * Тёмно-зелёный с золотом — цвета их же фирменного пакета, — засечный шрифт
 * в заголовках и шесть связанных сцен: кадр, цифры, каталог в объёме, подбор
 * по бюджету, расчёт партии и лента. Каталог оставлен светлым намеренно:
 * выбирать товар на тёмном тяжело, а перепад делает его центром страницы.
 */
export default function AdarPremiumConcept() {
  const concept = getConcept("premium");

  return (
    <>
      <ConceptBar current="premium" />
      <div className="bg-adar-green-950">
        <PremiumHeader />
        <main>
          <CinematicHero />
          <NumbersBand />
          <CatalogFrame showcase={growthStages} />
          <BudgetPicker />
          <CatalogBrowser />
          <SetShowcase
            tone="dark"
            sets={sets.filter((_, index) => index % 6 === 2)}
            title="Каталог целиком"
            note="Крутите ленту и открывайте любой набор — состав, вес и упаковка внутри."
          />
          <CorporateBlock />
          <ThemesGrid tone="dark" />
          <Advantages tone="dark" />
          <ClientsWall tone="dark" />
          <ContactSection tone="dark" />
        </main>
        <SiteFooter />
      </div>
      <EstimatePanel concept={concept} />
    </>
  );
}

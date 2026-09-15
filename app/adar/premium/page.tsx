import type { Metadata } from "next";

import { Advantages } from "@/components/adar/base/advantages";
import { ThemesGrid } from "@/components/adar/base/themes-grid";
import { CatalogBrowser } from "@/components/adar/plus/catalog-browser";
import { BudgetPicker } from "@/components/adar/premium/budget-picker";
import { CatalogFrame } from "@/components/adar/premium/catalog-frame";
import { AboutCompany } from "@/components/adar/premium/about-company";
import { ArchiveDrum } from "@/components/adar/premium/archive-drum";
import { HeroStage } from "@/components/adar/premium/hero-stage";
import { CorporateBlock } from "@/components/adar/premium/corporate-block";
import { PremiumHeader } from "@/components/adar/premium/header";
import { CartPanel } from "@/components/adar/ui/cart-panel";
import { SkipLink } from "@/components/adar/ui/skip-link";
import { ConceptBar } from "@/components/adar/showcase/concept-bar";
import { EstimatePanel } from "@/components/adar/showcase/estimate-panel";
import { ClientsWall } from "@/components/adar/ui/clients-wall";
import { ContactSection } from "@/components/adar/ui/contact-section";
import { SetShowcase } from "@/components/adar/ui/set-showcase";
import { SiteFooter } from "@/components/adar/ui/site-footer";
import { sets } from "@/content/adar/catalog";
import { getConcept } from "@/content/adar/concepts";
import { CartProvider } from "@/lib/adar/cart";
import { showcaseChrome } from "@/lib/adar/showcase";
import { growthStages } from "@/lib/adar/catalog";

export const metadata: Metadata = {
  title: "Вариант 03 — «Премиум»",
  // Своё описание, а не унаследованное от витрины: оно говорит про выбор из
  // трёх вариантов, а эта страница — будущий сайт компании, и в выдаче должна
  // описывать её, а не наше предложение.
  description:
    "Подарочные наборы ADAR: 80 готовых вариантов от 50 000 до 1 500 000 сум, состав и вес каждого, подбор по бюджету и расчёт партии для организаций. Ташкент, с 2011 года.",
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
    <CartProvider>
      <SkipLink />
      {showcaseChrome ? <ConceptBar current="premium" /> : null}
      <div className="bg-adar-green-950">
        <PremiumHeader />
        <main id="content">
          <HeroStage />
          <AboutCompany />
          <ArchiveDrum />
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
          <Advantages tone="dark" anchor="pochemu-adar" kicker="Почему ADAR" />
          <ClientsWall tone="dark" />
          <ContactSection tone="dark" />
        </main>
        <SiteFooter />
      </div>
      <CartPanel />
      {showcaseChrome ? <EstimatePanel concept={concept} /> : null}
    </CartProvider>
  );
}

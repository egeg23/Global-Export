import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Configurator } from "@/components/akbar/configurator";
import { DealerCabinet, Journal, Measure, Prepay, Tour, TryOn } from "@/components/akbar/extras";
import { AkbarFooter } from "@/components/akbar/footer";
import { AkbarHeader } from "@/components/akbar/header";
import { AkbarHero } from "@/components/akbar/hero";
import { Lead } from "@/components/akbar/lead";
import { Beyond, Collections, Hidden, Partners, Popular, Process, Proof, Tall } from "@/components/akbar/sections";
import { Showroom } from "@/components/akbar/showroom";
import { Addon, ConfiguratorProvider } from "@/components/configurator/context";
import { akbarCatalog, akbarHrefs } from "@/content/akbar/addons";
import { configurator } from "@/lib/akbar/catalog";

/**
 * Akbar Rich — главная.
 *
 * Порядок — порядок решения о покупке двери: сначала впечатление (дверь
 * открывается в дом), потом доверие (фабрика, цифры), выбор (разделы,
 * конструктор, популярные модели), то, чем фабрика отличается (три метра,
 * интерьер у одного производителя, скрытые двери), как всё пройдёт — и
 * куда прийти или позвонить.
 *
 * Допники конструктора сайта (док справа внизу) встают каждый на своё место
 * в этом порядке: примерка — сразу за конструктором двери, кабинет — за
 * блоком дилерам, тур — перед шоурумом, замер и предоплата — перед заявкой.
 */
export default function AkbarPage() {
  return (
    <ConfiguratorProvider catalog={akbarCatalog} tier="site" page="main" hrefs={akbarHrefs()}>
      <DevuzIntro project="akbar" />
      <AkbarHeader />
      <main id="content">
        <AkbarHero />
        <Proof />
        <Collections />
        <Configurator models={configurator} />
        <Addon id="tryon">
          <TryOn />
        </Addon>
        <Popular />
        <Tall />
        <Beyond />
        <Hidden />
        <Process />
        <Partners />
        <Addon id="dealer">
          <DealerCabinet models={configurator.slice(0, 4).map((model) => model.name)} />
        </Addon>
        <Addon id="journal">
          <Journal />
        </Addon>
        <Addon id="tour">
          <Tour />
        </Addon>
        <Showroom />
        <Addon id="measure">
          <Measure />
        </Addon>
        <Addon id="pay">
          <Prepay />
        </Addon>
        <Lead />
      </main>
      <AkbarFooter />
    </ConfiguratorProvider>
  );
}

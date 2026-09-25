import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Configurator } from "@/components/akbar/configurator";
import { AkbarFooter } from "@/components/akbar/footer";
import { AkbarHeader } from "@/components/akbar/header";
import { AkbarHero } from "@/components/akbar/hero";
import { Lead } from "@/components/akbar/lead";
import { Beyond, Collections, Hidden, Partners, Popular, Process, Proof, Tall } from "@/components/akbar/sections";
import { Showroom } from "@/components/akbar/showroom";
import { configurator } from "@/lib/akbar/catalog";

/**
 * Akbar Rich — главная.
 *
 * Порядок — порядок решения о покупке двери: сначала впечатление (дверь
 * открывается в дом), потом доверие (фабрика, цифры), выбор (разделы,
 * конструктор, популярные модели), то, чем фабрика отличается (три метра,
 * интерьер у одного производителя, скрытые двери), как всё пройдёт — и
 * куда прийти или позвонить.
 */
export default function AkbarPage() {
  return (
    <>
      <DevuzIntro project="akbar" />
      <AkbarHeader />
      <main id="content">
        <AkbarHero />
        <Proof />
        <Collections />
        <Configurator models={configurator} />
        <Popular />
        <Tall />
        <Beyond />
        <Hidden />
        <Process />
        <Partners />
        <Showroom />
        <Lead />
      </main>
      <AkbarFooter />
    </>
  );
}

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { WebnameSite } from "@/components/webname/site";
import { webnameCatalog, webnameHrefs } from "@/content/webname/catalog";

/** Макет сайта Arsenal D, версия «Реестр» (окно выбора вариантов — /webname). */
export default function Webname() {
  return (
    <ConfiguratorProvider catalog={webnameCatalog} tier="full" page="main" hrefs={webnameHrefs()}>
      <DevuzIntro project="webname" />
      <WebnameSite />
    </ConfiguratorProvider>
  );
}

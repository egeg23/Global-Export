import { DevuzIntro } from "@/components/brand/devuz-intro";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { PremiumSite } from "@/components/webname/premium/site";
import { webnamePremiumCatalog, webnamePremiumHrefs } from "@/content/webname/catalog";

/** Макет сайта Arsenal D, вариант «Премиум» — жидкое стекло. */
export default function WebnamePremium() {
  return (
    <ConfiguratorProvider catalog={webnamePremiumCatalog} tier="premium" page="main" hrefs={webnamePremiumHrefs()}>
      <DevuzIntro project="webname" />
      <PremiumSite />
    </ConfiguratorProvider>
  );
}

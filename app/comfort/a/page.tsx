import type { Metadata } from "next";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { ComfortSite } from "@/components/cf/site";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { comfortCatalog, comfortHrefs } from "@/content/comfort/catalog";

export const metadata: Metadata = {
  title: "Палитра A · Wine Ash + Turquoise",
};

/** Сайт Comfort Mebel в палитре A — «Wine Ash + Turquoise». */
export default function ComfortPaletteA() {
  return (
    <ConfiguratorProvider catalog={comfortCatalog} tier="a" page="a" hrefs={comfortHrefs()}>
      <DevuzIntro project="comfort" />
      <ComfortSite palette="a" />
    </ConfiguratorProvider>
  );
}

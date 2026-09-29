import type { Metadata } from "next";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { ComfortSite } from "@/components/cf/site";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { comfortCatalog, comfortHrefs } from "@/content/comfort/catalog";

export const metadata: Metadata = {
  title: "Палитра B · Cosmic + Vanilla",
};

/** Сайт Comfort Mebel в палитре B — «Cosmic + Vanilla». */
export default function ComfortPaletteB() {
  return (
    <ConfiguratorProvider catalog={comfortCatalog} tier="b" page="b" hrefs={comfortHrefs()}>
      <DevuzIntro project="comfort" />
      <ComfortSite palette="b" />
    </ConfiguratorProvider>
  );
}

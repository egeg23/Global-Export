import type { Metadata } from "next";
import { Suspense } from "react";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { HostingFlow } from "@/components/webname/flow";
import { PREMIUM, PremiumShell } from "@/components/webname/premium/shell";
import { webnamePremiumCatalog, webnamePremiumHrefs } from "@/content/webname/catalog";

export const metadata: Metadata = {
  title: "Заказ хостинга",
  description: "Arsenal D Премиум: заказ хостинга в сумах в четыре шага — тариф, домен, срок и допы, оплата.",
};

/** Пошаговая страница варианта «Премиум» — те же шаги, в стекле. */
export default function Page() {
  return (
    <ConfiguratorProvider catalog={webnamePremiumCatalog} tier="premium" page="hosting" hrefs={webnamePremiumHrefs()}>
      <DevuzIntro project="webname" />
      <PremiumShell>
        <Suspense>
          <HostingFlow base={PREMIUM} />
        </Suspense>
      </PremiumShell>
    </ConfiguratorProvider>
  );
}

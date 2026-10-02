import type { Metadata } from "next";
import { Suspense } from "react";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { HostingFlow } from "@/components/webname/flow";
import { WebnameShell } from "@/components/webname/site";
import { webnameCatalog, webnameHrefs } from "@/content/webname/catalog";

export const metadata: Metadata = {
  title: "Заказ хостинга",
  description: "Макет Arsenal D: заказ хостинга в сумах в четыре шага — тариф, домен, срок и допы, оплата.",
};

/** Пошаговая страница из меню макета — что идёт после первого экрана. */
export default function Page() {
  return (
    <ConfiguratorProvider catalog={webnameCatalog} tier="full" page="hosting" hrefs={webnameHrefs()}>
      <DevuzIntro project="webname" />
      <WebnameShell>
        {/* Параметр из адреса (?name=, ?plan=) читается в браузере. */}
        <Suspense>
          <HostingFlow />
        </Suspense>
      </WebnameShell>
    </ConfiguratorProvider>
  );
}

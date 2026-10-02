import type { Metadata } from "next";
import { Suspense } from "react";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { DomainFlow } from "@/components/webname/flow";
import { PREMIUM, PremiumShell } from "@/components/webname/premium/shell";
import { webnamePremiumCatalog, webnamePremiumHrefs } from "@/content/webname/catalog";

export const metadata: Metadata = {
  title: "Регистрация домена",
  description: "Arsenal D Премиум: регистрация домена .UZ в четыре шага — имя и зоны, владелец, настройка NS, оплата.",
};

/** Пошаговая страница варианта «Премиум» — те же шаги, в стекле. */
export default function Page() {
  return (
    <ConfiguratorProvider catalog={webnamePremiumCatalog} tier="premium" page="domains" hrefs={webnamePremiumHrefs()}>
      <DevuzIntro project="webname" />
      <PremiumShell>
        <Suspense>
          <DomainFlow base={PREMIUM} />
        </Suspense>
      </PremiumShell>
    </ConfiguratorProvider>
  );
}

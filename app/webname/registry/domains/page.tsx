import type { Metadata } from "next";
import { Suspense } from "react";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { DomainFlow } from "@/components/webname/flow";
import { WebnameShell } from "@/components/webname/site";
import { webnameCatalog, webnameHrefs } from "@/content/webname/catalog";

export const metadata: Metadata = {
  title: "Регистрация домена",
  description: "Макет Arsenal D: регистрация домена .UZ в четыре шага — имя и зоны, владелец, настройка NS, оплата Payme, Click или Uzum.",
};

/** Пошаговая страница из меню макета — что идёт после первого экрана. */
export default function Page() {
  return (
    <ConfiguratorProvider catalog={webnameCatalog} tier="full" page="domains" hrefs={webnameHrefs()}>
      <DevuzIntro project="webname" />
      <WebnameShell>
        {/* Параметр из адреса (?name=, ?plan=) читается в браузере. */}
        <Suspense>
          <DomainFlow />
        </Suspense>
      </WebnameShell>
    </ConfiguratorProvider>
  );
}

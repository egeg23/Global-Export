import type { Metadata } from "next";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { SiteB } from "@/components/medacademy/b/site";
import { medacademyCatalog, medacademyHrefs } from "@/content/medacademy/catalog";

export const metadata: Metadata = {
  title: "Вариант B · Лаборатория",
  description: "MedAcademy, вариант B «Лаборатория»: смелый ультрафиолет, таблица элементов на первом экране, экспресс-тест с конфетти и калькулятор балла DTM.",
};

/** Сайт MedAcademy, вариант B — «Лаборатория». */
export default function MedacademyB() {
  return (
    <ConfiguratorProvider catalog={medacademyCatalog} tier="b" page="b" hrefs={medacademyHrefs()}>
      <DevuzIntro project="medacademy" />
      <SiteB />
    </ConfiguratorProvider>
  );
}

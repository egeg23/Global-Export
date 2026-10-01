import type { Metadata } from "next";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { SiteA } from "@/components/medacademy/a/site";
import { medacademyCatalog, medacademyHrefs } from "@/content/medacademy/catalog";

export const metadata: Metadata = {
  title: "Вариант A · Клиника",
  description: "MedAcademy, вариант A «Клиника»: строгий клинический премиум, линия ЭКГ из логотипа и калькулятор балла DTM с баллами преподавателей.",
};

/** Сайт MedAcademy, вариант A — «Клиника». */
export default function MedacademyA() {
  return (
    <ConfiguratorProvider catalog={medacademyCatalog} tier="a" page="a" hrefs={medacademyHrefs()}>
      <DevuzIntro project="medacademy" />
      <SiteA />
    </ConfiguratorProvider>
  );
}

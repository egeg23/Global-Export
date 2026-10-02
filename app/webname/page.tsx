import type { Metadata } from "next";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { VariantsHub } from "@/components/webname/hub";

export const metadata: Metadata = {
  title: "Варианты сайта",
  description: "Макет сайта Arsenal D (webname.uz): два дизайна — «Реестр» и «Премиум» — и три логотипа в одном окне. Выберите сочетание и откройте сайт.",
};

/** Окно выбора вариантов макета Arsenal D — одна ссылка на всё. */
export default function WebnameVariants() {
  return (
    <>
      <DevuzIntro project="webname" />
      <VariantsHub />
    </>
  );
}

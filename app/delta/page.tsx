import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Cabinet } from "@/components/delta/cabinet";
import { Deltcoin } from "@/components/delta/deltcoin";
import { Faq } from "@/components/delta/faq";
import { DeltaFooter } from "@/components/delta/footer";
import { DeltaHeader } from "@/components/delta/header";
import { DeltaHero } from "@/components/delta/hero";
import { Lead } from "@/components/delta/lead";
import { DeltaPicker } from "@/components/delta/picker";
import { FirstLesson, Openness, Results, Teacher } from "@/components/delta/sections";
import { DeltaSteps } from "@/components/delta/steps";

/**
 * Delta IT-School — главная сайта-платформы.
 *
 * Порядок разделов — порядок вопросов родителя: интересно ли ребёнку (сам
 * попробуй), с чего начать (ступени и подбор), что будет на первом уроке,
 * кто учит, работает ли это (истории с источником), как мотивируют
 * (Deltcoin), как я узнаю, что он учится (кабинет и открытый экзамен),
 * остальные «а если…» — и запись.
 */
export default function DeltaPage() {
  return (
    <>
      <DevuzIntro project="delta" />
      <DeltaHeader />
      <main id="content">
        <DeltaHero />
        <DeltaSteps />
        <DeltaPicker />
        <FirstLesson />
        <Teacher />
        <Results />
        <Deltcoin />
        <Cabinet />
        <Openness />
        <Faq />
        <Lead />
      </main>
      <DeltaFooter />
    </>
  );
}

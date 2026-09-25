import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Hero } from "@/components/gh/hero";
import { Intro } from "@/components/gh/intro";
import {
  Awards,
  Commerce,
  Contacts,
  Footer,
  Header,
  News,
  Progress,
  Projects,
  Section,
  Steps,
} from "@/components/gh/sections";
import { Picker } from "@/components/gh/tools";

/**
 * Golden House — один макет главной.
 *
 * Не «три варианта на выбор», как было у MAVERA, а один, доведённый до
 * конца: у заказчика уже есть приличный сайт, и разговор идёт не о том,
 * каким он будет, а о том, чего ему не хватает. Не хватает трёх вещей —
 * движения, подбора квартиры и расчёта платежа, — и все три здесь работают
 * на их собственных данных, а не на выдуманном жилом комплексе.
 *
 * Порядок разделов повторяет gh.uz: квартиры, подбор, ипотека, коммерция,
 * ход стройки, покупка, новости, контакты.
 */
export default function GoldenHousePage() {
  return (
    <>
      <DevuzIntro project="gh" />
      {/* Заставка живёт на верхнем уровне, а не внутри первого экрана: у
          секции свой контекст наложения, и полноэкранный слой из него не
          перекрыл бы липкую шапку. */}
      <Intro />
      <Header />

      <main>
        <Hero />

        <div className="py-10 sm:py-14">
          <Awards />
        </div>

        <Section
          id="projects"
          eyebrow="Жилые комплексы"
          title="Семь кварталов в Ташкенте — от комфорта до клубного дома"
          note="Выберите комплекс: карточка меняется целиком, вместе с фотографией и тем, что есть рядом."
        >
          <Projects />
        </Section>

        <Section
          id="picker"
          eyebrow="Подбор квартиры"
          title="Свободные квартиры — сразу, без звонка в отдел продаж"
          note="Выберите квартиру, и под ней откроется расчёт ипотеки по вашим условиям: взнос от 15%, ставка 20%."
          tone="paper"
        >
          <Picker />
        </Section>

        <Section
          id="commerce"
          eyebrow="Коммерция"
          title="Первые этажи: помещения под аренду и продажу"
        >
          <Commerce />
        </Section>

        <Section
          id="progress"
          eyebrow="Ход строительства"
          title="Что сдано, что на площадке и что впереди"
          note="Раздел, которого на сайте нет вовсе: сегодня о стадии стройки спрашивают у менеджера."
          tone="paper"
        >
          <Progress />
        </Section>

        <Section id="buy" eyebrow="Покупка" title="Пять шагов от звонка до ключей">
          <Steps />
        </Section>

        <Section id="news" eyebrow="Новости и акции" title="Что происходит в компании" tone="paper">
          <News />
        </Section>

        <Section id="contacts" eyebrow="Контакты" title="Приезжайте в офис продаж">
          <Contacts />
        </Section>
      </main>

      <Footer />
    </>
  );
}

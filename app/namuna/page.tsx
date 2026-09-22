import { Hero, ReadingProgress } from "@/components/nm/hero";
import { Configurator, PriceBar } from "@/components/nm/configurator";
import {
  Chapter,
  Compare,
  Contacts,
  DeepCta,
  DeepTitle,
  Faq,
  Footer,
  Header,
  Partners,
  Production,
  Projects,
  Timeline,
} from "@/components/nm/sections";

/**
 * Namuna — один макет главной.
 *
 * Страница построена главами: скилл ui-ux-pro-max для этого продукта
 * выдал схему «Scroll-Triggered Storytelling» — вступление, главы, финальный
 * призыв, — и к ней требование индикатора прочитанного, который стоит
 * сверху. Внутрь этой схемы вложен второй шаблон, «Interactive
 * Configurator»: выбор, характеристики рядом, цена и заявка на месте.
 *
 * Тёмных глав две — производство и финал. Они не красятся руками: на
 * разделе стоит `data-tone="deep"`, токены мира переопределяются для
 * поддерева, и те же компоненты сами становятся тёмными.
 */
export default function NamunaPage() {
  return (
    <>
      <ReadingProgress />
      <Header />

      <main>
        <Hero />

        <Chapter
          id="configurator"
          number="02 — Конфигуратор"
          title={
            <>
              Соберите свою кухню и <span className="nm-accent">увидите цену</span> сразу
            </>
          }
          lead="Планировка, фасады, столешница и фурнитура. Вилка сметы и срок пересчитываются на каждом нажатии — звонить, чтобы узнать порядок цифр, не нужно."
        >
          <Configurator />
        </Chapter>

        <Chapter
          id="projects"
          number="03 — Работы"
          title={
            <>
              Больше тысячи проектов. <span className="nm-accent">Вот девять</span>
            </>
          }
          lead="Кухни, гардеробные и корпусная мебель с объектов фабрики. Подписано только то, что видно на кадре: тип мебели и материалы."
        >
          <Projects />
        </Chapter>

        <Chapter
          id="compare"
          number="04 — Разница"
          title={
            <>
              Что меняет <span className="nm-accent">мебель на заказ</span>
            </>
          }
        >
          <Compare />
        </Chapter>

        <Chapter
          id="production"
          number="05 — Производство"
          tone="deep"
          title={<DeepTitle>Почему их мебель стоит столько, сколько стоит</DeepTitle>}
          lead="Шесть доводов фабрики, каждый из которых виден в смете строкой — и через несколько лет в том, как открываются ящики."
        >
          <Production />
          <DeepCta href="#configurator">Собрать кухню</DeepCta>
        </Chapter>

        <Chapter
          id="materials"
          number="06 — Материалы"
          title={
            <>
              Работают с теми, чьё имя <span className="nm-accent">стоит на петле</span>
            </>
          }
          lead="Сначала те, чьи петли, плита и техника стоят внутри их мебели. Следом — жилые комплексы, которые фабрика меблировала целиком."
        >
          <Partners />
        </Chapter>

        <Chapter
          id="timeline"
          number="07 — Сроки"
          title={
            <>
              Пять шагов от заявки <span className="nm-accent">до ключей от кухни</span>
            </>
          }
          lead="Даты считаются от сегодняшнего дня при среднем объёме — чтобы было видно не «15–45 дней», а конкретное число в календаре."
        >
          <Timeline />
        </Chapter>

        <Chapter
          id="faq"
          number="08 — Вопросы"
          title={
            <>
              О чём спрашивают <span className="nm-accent">чаще всего</span>
            </>
          }
        >
          <Faq />
        </Chapter>

        <Chapter
          id="contacts"
          number="09 — Контакты"
          title={
            <>
              Приезжайте в салон — <span className="nm-accent">материал надо трогать</span>
            </>
          }
          lead="Экран врёт про оттенок и не передаёт, как закрывается ящик. Два филиала, в обоих есть образцы и фурнитура."
        >
          <Contacts />
        </Chapter>
      </main>

      <Footer />
      <PriceBar />
    </>
  );
}

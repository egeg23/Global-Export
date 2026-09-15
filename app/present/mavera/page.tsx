import type { Metadata } from "next";

import { AdminGallery } from "@/components/present/mavera/admin-gallery";
import { MaveraGallery } from "@/components/present/mavera/gallery";
import { MaveraHero } from "@/components/present/mavera/hero";
import { StandSwitch } from "@/components/present/stand-switch";
import { Container } from "@/components/ui/container";

/**
 * Вкладка MAVERA в витрине.
 *
 * Отдельная страница, а не ещё один пункт в списке: макетов восемь, у них свой
 * тумблер пакетов со сметой и развёрнутый просмотр, а панель управления идёт
 * отдельным блоком. Из витрины на неё ведёт подпункт.
 */
export const metadata: Metadata = {
  title: "MAVERA — макеты сайта",
  description:
    "Три варианта сайта застройщика со сметой: кликабельные макеты, интерактивный генплан и подбор квартиры, отдельно — панель управления.",
  robots: { index: false, follow: false, nocache: true },
};

/** Что подсмотрено у крупных девелоперов и зачем это здесь. */
const benchmarks = [
  {
    source: "Донстрой",
    taken: "Цифры масштаба на главной (млн м², жителей, награды) и отдельный поиск по параметрам с выходом на карту.",
  },
  {
    source: "Level Group",
    taken: "Карточка проекта со стартовой ценой и сроком сдачи, статусы «сдан / скоро / IV кв. 2027» и счётчик найденных квартир.",
  },
  {
    source: "FORMA",
    taken: "Строка условий покупки поверх шапки — ипотека, рассрочка, скидка — и разделение на квартиры, ретейл и офисы.",
  },
  {
    source: "Общая практика рынка",
    taken: "Интерактивный генплан с кликабельными корпусами, шахматка этажей с планировкой и фотоотчёт о ходе строительства по месяцам.",
  },
];

export default function MaveraPresentPage() {
  return (
    <main className="pb-24">
      <StandSwitch active="mavera" />

      <MaveraHero />

      <Container className="pt-14 lg:pt-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-sand-300/60">Три варианта, панель управления и ориентиры</p>

          <nav aria-label="Разделы страницы" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="#variants" className="link-underline text-sand-200/75 hover:text-sand-50">
              Варианты сайта
            </a>
            <a href="#admin" className="link-underline text-sand-200/75 hover:text-sand-50">
              Панель управления
            </a>
            <a href="#benchmarks" className="link-underline text-sand-200/75 hover:text-sand-50">
              Ориентиры
            </a>
          </nav>
        </div>

        <section id="variants" className="mt-10 scroll-mt-8">
          <MaveraGallery />
        </section>
      </Container>

      {/* Панель управления — вне тумблера вариантов. */}
      <Container className="pt-24">
        <section id="admin" className="scroll-mt-8 border-t border-sand-50/10 pt-14">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-harvest-300">
            Пункт 7 брифа · отдельно от вариантов
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl leading-tight text-sand-50 sm:text-4xl">
            Панель управления
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-sand-200/75">
            За основу взята админка Global Export — она уже работает у действующего
            клиента. Владелец сам добавляет проекты и коммерческие объекты, грузит
            рендеры, правит страницы и разбирает заявки. Без разработчика.
          </p>

          <div className="mt-10">
            <AdminGallery />
          </div>
        </section>
      </Container>

      {/* На что ориентировались. */}
      <Container className="pt-24">
        <section id="benchmarks" className="scroll-mt-8 border-t border-sand-50/10 pt-14">
          <h2 className="font-display text-3xl leading-tight text-sand-50">
            На что смотрели: рынок РФ
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-sand-200/75">
            «Премиум» собран не из головы. Разобрали, как устроены сайты крупных
            московских девелоперов, и взяли то, что у них действительно работает на
            продажи.
          </p>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-card bg-sand-50/12 lg:grid-cols-2">
            {benchmarks.map((item) => (
              <div key={item.source} className="bg-forest-950 p-6 sm:p-7">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-harvest-300">
                  {item.source}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-sand-200/75">{item.taken}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-sand-300/55">
            Чего у них нет, а у MAVERA должно быть: три языка во всех разделах и
            отдельный раздел коммерческой недвижимости со своей линией заявок — это
            требования брифа, и они в макетах есть.
          </p>
        </section>
      </Container>

      {/* Тот же принцип, что и на витрине: не выдавать заглушки за данные. */}
      <Container className="pt-20">
        <div className="grid gap-10 border-t border-sand-50/10 pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl text-sand-50">
              Что здесь настоящее, а что — заглушка
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-sand-300/55">
              Макеты показывают устройство страниц, а не содержание сайта.
            </p>
          </div>

          <div className="space-y-5 text-sm leading-relaxed text-sand-200/75 lg:col-span-7">
            <p>
              Настоящие здесь структура и поведение: состав страниц, набор полей в
              карточке проекта, вкладки «Продажа» и «Аренда», переключатель языка,
              генплан и подбор квартиры, поведение при прокрутке и на телефоне.
            </p>
            <p>
              Заглушки — названия жилых комплексов, районы, цифры, цены, телефоны и
              адрес. Портфель MAVERA мы не знаем и выдумывать его за компанию не
              будем: поля заполняются вашими данными при наполнении.
            </p>
            <p>
              Виды застройки нарисованы кодом, а не фотографиями. Рендеров у нас нет,
              а подставлять в макет застройщика чужие дома нечестно — на их место
              встанут ваши изображения.
            </p>
            <p className="text-sand-300/55">
              Цены в смете — за разработку, без допников: перевод носителями, CRM,
              3D-тур, съёмка и поддержка считаются отдельно.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}

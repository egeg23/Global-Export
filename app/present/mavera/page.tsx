import type { Metadata } from "next";
import Link from "next/link";

import { MaveraGallery } from "@/components/present/mavera/gallery";
import { MaveraHero } from "@/components/present/mavera/hero";
import { Container } from "@/components/ui/container";

/**
 * Вкладка MAVERA в витрине.
 *
 * Отдельная страница, а не ещё один пункт в списке: макетов шесть, у них свой
 * тумблер оформления и развёрнутый просмотр, и в общем перечне это утонуло бы.
 * Из витрины на неё ведёт подпункт.
 */
export const metadata: Metadata = {
  title: "MAVERA — макеты сайта",
  description:
    "Шесть страниц из брифа MAVERA в двух направлениях оформления: кликабельные макеты с параллаксом, десктоп и телефон.",
  robots: { index: false, follow: false, nocache: true },
};

const packages = [
  {
    name: "Стандарт",
    text: "Одно направление на выбор, адаптация проверенного макета, один круг правок. Ровно то, что перечислено в брифе.",
  },
  {
    name: "Люкс",
    text: "Оба направления прорабатываются как концепции, выбранное доводится до дизайн-системы: параллакс на первом экране, появления при прокрутке, фильтры и статусы объектов.",
  },
  {
    name: "Премиум",
    text: "Сверх этого — сценарий движения между разделами, генплан с кликабельными блоками, подбор квартиры по параметрам, интеграция с CRM.",
  },
];

export default function MaveraPresentPage() {
  return (
    <main className="pb-24">
      <MaveraHero />

      <Container className="pt-14 lg:pt-20">
        <Link
          href="/present"
          prefetch={false}
          className="inline-flex items-center gap-2 text-sm text-sand-300/60 transition-colors hover:text-sand-50"
        >
          <span aria-hidden="true">←</span> Ко всей витрине
        </Link>

        <div className="mt-10">
          <MaveraGallery />
        </div>
      </Container>

      {/* Связь макетов с пакетами из сметы. */}
      <Container className="pt-20">
        <div className="border-t border-sand-50/10 pt-12">
          <h2 className="font-display text-2xl text-sand-50">
            Что из увиденного входит в какой пакет
          </h2>
          <dl className="mt-8 grid gap-px overflow-hidden rounded-card bg-sand-50/12 lg:grid-cols-3">
            {packages.map((item) => (
              <div key={item.name} className="bg-forest-950 p-6 sm:p-7">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-harvest-300">
                  {item.name}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-sand-200/75">{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      {/* Тот же принцип, что и на витрине: не выдавать заглушки за данные. */}
      <Container className="pt-16">
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
              Настоящие здесь структура и поведение: состав страниц, набор полей
              в карточке проекта, вкладки «Продажа» и «Аренда», переключатель
              языка, поведение при прокрутке и на телефоне — всё это собрано
              строго по пунктам брифа.
            </p>
            <p>
              Заглушки — названия жилых комплексов, районы, цифры, телефоны и
              адрес. Портфель MAVERA мы не знаем и выдумывать его за компанию не
              будем: поля заполняются вашими данными при наполнении.
            </p>
            <p>
              Виды застройки нарисованы кодом, а не фотографиями. Рендеров у нас
              нет, а подставлять в макет застройщика чужие дома нечестно — на
              их место встанут ваши изображения.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}

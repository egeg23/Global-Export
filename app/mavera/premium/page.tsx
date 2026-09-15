import type { Metadata } from "next";
import Image from "next/image";

import { Genplan, Picker } from "@/components/present/mavera/interactive";
import { CinemaHero, Counters, FilmRail } from "@/components/mavera/premium/scenes";
import { Rise } from "@/components/mavera/reveal";
import { VariantBar } from "@/components/mavera/variant-bar";
import { stats, terms } from "@/content/mavera/data";

export const metadata: Metadata = { title: "Вариант 03 — «Премиум»" };

/**
 * Вариант 03 — «Премиум», кинозал.
 *
 * Глубокий тёмный фон (не чистый чёрный — на OLED он даёт рваные градиенты),
 * индиговый акцент вместо бронзы «Люкса», радиус 16, стеклянная шапка и
 * сцены на весь экран. Главное отличие не в цвете: здесь два экрана, которые
 * по-настоящему работают — генплан с кликабельными корпусами и шахматка
 * квартир. Именно они превращают сайт-визитку в инструмент продаж.
 */
export default function MaveraPremium() {
  return (
    <div data-world="premium">
      <VariantBar current="premium" />

      {/* Стеклянная шапка поверх кадра. */}
      <header className="sticky top-0 z-40 border-b border-[var(--w-line)] bg-[var(--w-bg)]/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <span className="text-lg font-semibold tracking-[0.3em]">MAVERA</span>
          <nav className="hidden gap-8 text-sm text-[var(--w-muted)] md:flex">
            {["Проекты", "Генплан", "Подбор", "Ход работ", "Контакты"].map((item) => (
              <span key={item} className="transition-colors hover:text-[var(--w-ink)]">
                {item}
              </span>
            ))}
          </nav>
          <span className="w-glow rounded-full bg-[var(--w-accent)] px-5 py-2.5 text-sm font-medium text-white">
            Забронировать
          </span>
        </div>
      </header>

      <CinemaHero />

      {/* Условия покупки — стеклянной лентой сразу под кадром. */}
      <section className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
        <Rise className="-mt-10 grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] sm:grid-cols-3">
          {terms.map((term) => (
            <div key={term.label} className="bg-[var(--w-paper)]/90 p-6 backdrop-blur-xl">
              <p className="text-2xl font-semibold text-[var(--w-accent)]">{term.value}</p>
              <p className="mt-2 text-sm text-[var(--w-muted)]">{term.label}</p>
            </div>
          ))}
        </Rise>
      </section>

      {/* Цифры, которые досчитываются. */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
        <Rise className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">Масштаб</p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">
            Четырнадцать лет, которые можно посчитать
          </h2>
        </Rise>
        <Rise delay={120} className="mt-12">
          <Counters items={stats} />
        </Rise>
      </section>

      {/* Кинолента проектов. */}
      <section className="py-4">
        <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
          <Rise className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-[clamp(1.9rem,3.6vw,3rem)]">Портфель</h2>
            <p className="text-sm text-[var(--w-muted)]">Наведите на карточку · листайте вбок</p>
          </Rise>
        </div>
        <Rise delay={80} className="mx-auto mt-10 w-full max-w-[1500px] px-5 sm:px-8">
          <FilmRail />
        </Rise>
      </section>

      {/* Генплан — работает по-настоящему. */}
      <section className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
          <Rise className="max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">Шаг 1</p>
            <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">Выберите корпус</h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--w-muted)]">
              Корпуса кликабельны: статус, этажность, срок сдачи и стартовая цена
              меняются справа. Отсюда же переход в подбор квартиры.
            </p>
          </Rise>

          <Rise delay={120} className="mt-12 text-[1.05rem]">
            <Genplan live currency="uzs" />
          </Rise>
        </div>
      </section>

      {/* Шахматка. */}
      <section className="border-t border-[var(--w-line)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
          <Rise className="max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">Шаг 2</p>
            <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">
              Выберите квартиру
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--w-muted)]">
              Шахматка этажей со статусами: свободна, бронь, продана. Клик по клетке
              открывает планировку и цену.
            </p>
          </Rise>

          <Rise delay={120} className="mt-12 text-[1.05rem]">
            <Picker live currency="uzs" />
          </Rise>
        </div>
      </section>

      {/* Ход строительства. */}
      <section className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
          <Rise className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">Шаг 3</p>
              <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,3rem)]">Следите за стройкой</h2>
            </div>
            <p className="text-sm text-[var(--w-muted)]">Обновляется каждый месяц</p>
          </Rise>

          <Rise delay={100} className="mt-10">
            <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--w-line)]">
              <span className="block h-full w-[68%] rounded-full bg-[var(--w-accent)]" />
            </div>
            <p className="mt-3 text-sm text-[var(--w-muted)]">
              ЖК «Чинор» · готовность 68% · монтаж фасадов, внутренние работы
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["Июнь", "Июль", "Август", "Сентябрь"].map((month, index) => (
                <figure key={month} className="overflow-hidden rounded-[var(--w-radius)] border border-[var(--w-line)]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={index % 2 ? "/images/mavera/construction.jpg" : "/images/mavera/facade.jpg"}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover opacity-90"
                    />
                  </div>
                  <figcaption className="px-4 py-3 text-sm text-[var(--w-muted)]">{month} 2026</figcaption>
                </figure>
              ))}
            </div>
          </Rise>
        </div>
      </section>

      {/* Финальный кадр. */}
      <section className="relative isolate overflow-hidden border-t border-[var(--w-line)]">
        <Image
          src="/images/mavera/park.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover opacity-30"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--w-bg)] via-[var(--w-bg)]/80 to-[var(--w-bg)]/60" />

        <div className="mx-auto w-full max-w-[1500px] px-5 py-28 text-center sm:px-8">
          <Rise>
            <h2 className="mx-auto max-w-3xl text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05]">
              Забронируйте квартиру онлайн
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--w-muted)]">
              Пять дней брони, ноль звонков до вашего решения. Договор и оплата —
              в личном кабинете.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <span className="w-glow rounded-full bg-[var(--w-accent)] px-9 py-4 text-sm font-medium text-white">
                Забронировать
              </span>
              <span className="rounded-full border border-[var(--w-line)] px-9 py-4 text-sm">
                Рассчитать рассрочку
              </span>
            </div>
          </Rise>
        </div>
      </section>

      <footer className="border-t border-[var(--w-line)]">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-6 px-5 py-10 text-sm text-[var(--w-muted)] sm:px-8">
          <span className="text-base tracking-[0.3em] text-[var(--w-ink)]">MAVERA</span>
          <span>Ташкент, ул. ______, 00 · +998 (__) ___-__-__</span>
          <span className="flex gap-5">
            <span>Instagram</span>
            <span>Telegram</span>
            <span>WhatsApp</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

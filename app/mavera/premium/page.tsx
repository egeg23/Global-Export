import type { Metadata } from "next";
import Image from "next/image";

import { Addon, ConfiguratorProvider } from "@/components/mavera/configurator/context";
import { Genplan, Picker } from "@/components/present/mavera/interactive";
import { CinemaHero, Counters, FilmRail } from "@/components/mavera/premium/scenes";
import { Rise } from "@/components/mavera/reveal";
import { News, Reviews } from "@/components/mavera/sections";
import { VariantBar } from "@/components/mavera/variant-bar";
import { stats, terms } from "@/content/mavera/data";
import { faq, investment, voices } from "@/content/mavera/voice";

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
const voice = voices.premium;

export default function MaveraPremium() {
  return (
    <ConfiguratorProvider tier="premium" page="main">
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
          <div className="flex items-center gap-3">
            <Addon id="langs" inline scroll={false}>
              <span className="hidden rounded-full border border-[var(--w-line)] px-3 py-1.5 text-[0.7rem] tracking-[0.12em] text-[var(--w-muted)] sm:inline-block">
                RU <span className="opacity-40">EN UZ</span>
              </span>
            </Addon>
            <span className="w-glow rounded-full bg-[var(--w-accent)] px-5 py-2.5 text-sm font-medium text-white">
              {voice.closing.primary}
            </span>
          </div>
        </div>
      </header>

      <CinemaHero hero={voice.hero} />

      {/* Условия покупки — стеклянной лентой сразу под кадром. Допник «Строка условий». */}
      <Addon id="promo" as="section" className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
        <Rise className="relative z-10 -mt-10 grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] sm:grid-cols-3">
          {terms.map((term) => (
            <div key={term.label} className="bg-[var(--w-paper)]/90 p-6 backdrop-blur-xl">
              <p className="text-2xl font-semibold text-[var(--w-accent)]">{term.value}</p>
              <p className="mt-2 text-sm text-[var(--w-muted)]">{term.label}</p>
            </div>
          ))}
        </Rise>
      </Addon>

      {/* Цифры, которые досчитываются. */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
        <Rise className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">
            {voice.stats.eyebrow}
          </p>
          <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">{voice.stats.title}</h2>
        </Rise>
        <Rise delay={120} className="mt-12">
          <Counters items={stats} />
        </Rise>
      </section>

      {/* Кинолента проектов. */}
      <section className="py-4">
        <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
          <Rise className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-[clamp(1.9rem,3.6vw,3rem)]">{voice.portfolio.title}</h2>
            <p className="max-w-xs text-sm text-[var(--w-muted)]">{voice.portfolio.note}</p>
          </Rise>
        </div>
        <Rise delay={80} className="mx-auto mt-10 w-full max-w-[1500px] px-5 sm:px-8">
          <FilmRail claims={voice.claims} />
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

      {/* Ход строительства — допник, в «Премиуме» входит в пакет. */}
      <Addon id="progress" as="section" className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
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
      </Addon>

      {/* Только в «Премиуме»: как росла цена по стадиям. */}
      <section className="border-t border-[var(--w-line)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
          <Rise className="max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">
              Инвестору
            </p>
            <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">{investment.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--w-muted)]">{investment.note}</p>
          </Rise>

          <Rise delay={120} className="mt-14">
            <div className="flex h-56 items-end gap-3 sm:gap-6">
              {investment.stages.map((stage) => (
                <div key={stage.stage} className="flex flex-1 flex-col items-center gap-3">
                  <span className="text-sm tabular-nums text-[var(--w-accent)]">{stage.label}</span>
                  <span
                    className="w-full rounded-t-[var(--w-radius)] bg-gradient-to-t from-[var(--w-accent-soft)] to-[var(--w-accent)] transition-all duration-700 ease-[var(--w-ease)]"
                    style={{ height: `${((stage.value - 90) / 60) * 100}%` }}
                  />
                  <span className="text-center text-xs text-[var(--w-muted)]">{stage.stage}</span>
                </div>
              ))}
            </div>
          </Rise>
        </div>
      </section>

      {/* Только в «Премиуме»: порядок онлайн-сделки и вопросы к нему. */}
      <section className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
          <Rise className="max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">
              Сделка
            </p>
            <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">{voice.steps.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--w-muted)]">{voice.steps.note}</p>
          </Rise>

          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {voice.steps.items.map((step, index) => (
              <Rise
                as="li"
                key={step.title}
                delay={index * 80}
                className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-bg)] p-6"
              >
                <span className="text-sm tabular-nums text-[var(--w-accent)]">0{index + 1}</span>
                <h3 className="mt-4 text-xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--w-muted)]">{step.text}</p>
              </Rise>
            ))}
          </ol>

          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {faq.map((item, index) => (
              <Rise
                key={item.q}
                delay={index * 70}
                className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] p-6"
              >
                <h3 className="text-lg">{item.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--w-muted)]">{item.a}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* Допники «Отзывы» и «Новости» — перед финальным кадром. */}
      <Addon id="reviews" as="section" className="border-t border-[var(--w-line)]">
        <Reviews variant="premium" />
      </Addon>
      <Addon id="news" as="section" className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
        <News variant="premium" />
      </Addon>

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
              {voice.closing.title}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--w-muted)]">
              {voice.closing.text}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <span className="w-glow rounded-full bg-[var(--w-accent)] px-9 py-4 text-sm font-medium text-white">
                {voice.closing.primary}
              </span>
              <span className="rounded-full border border-[var(--w-line)] px-9 py-4 text-sm">
                {voice.closing.secondary}
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
    </ConfiguratorProvider>
  );
}

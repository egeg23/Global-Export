import type { Metadata } from "next";
import Image from "next/image";

import { Addon, ConfiguratorProvider } from "@/components/configurator/context";
import { maveraCatalog, maveraHrefs } from "@/content/mavera/catalog";
import { DemoSubmit } from "@/components/mavera/demo-submit";
import { Genplan, Picker } from "@/components/present/mavera/interactive";
import { Commerce } from "@/components/mavera/commerce/section";
import { ProjectForecast } from "@/components/mavera/forecast/project-forecast";
import { PaletteBar, PaletteRoot, PaletteSection } from "@/components/mavera/premium/palette";
import { CinemaHero, Counters, FilmRail } from "@/components/mavera/premium/scenes";
import { Rise } from "@/components/mavera/reveal";
import { News, Reviews } from "@/components/mavera/sections";
import { VariantBar } from "@/components/mavera/variant-bar";
import { projects, stats, terms } from "@/content/mavera/data";
import { faq, investment, voices } from "@/content/mavera/voice";

export const metadata: Metadata = { title: "Вариант 03 — «Премиум»" };

/**
 * Вариант 03 — «Премиум», светлый зал.
 *
 * Премиальность здесь набирается не тёмным фоном, а воздухом, крупным
 * скруглением и одним приглушённым акцентом: слоновая кость, песок или
 * жемчуг на выбор. Разделы лежат листами внахлёст, и мягкая линия на стыке
 * заменяет канцелярскую границу в один пиксель.
 *
 * Палитра переключается прямо на странице — целиком или у отдельного
 * раздела: спор на встрече идёт про конкретный экран, и проверять его надо
 * на месте. Главное отличие варианта при этом не в цвете: здесь два экрана,
 * которые по-настоящему работают — генплан с кликабельными корпусами и
 * шахматка квартир. Именно они превращают сайт-визитку в инструмент продаж.
 */
const voice = voices.premium;

export default function MaveraPremium() {
  return (
    <ConfiguratorProvider catalog={maveraCatalog} tier="premium" page="main" hrefs={maveraHrefs("premium", projects[0].slug)} frame="world">
      <VariantBar current="premium" />

      <PaletteRoot>
        {/* Стеклянная шапка поверх кадра. */}
        <header className="sticky top-0 z-40 border-b border-[var(--w-line)] bg-[var(--w-bg)]/70 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-6 px-5 py-4 sm:px-8">
            <span className="text-lg font-semibold tracking-[0.3em]">MAVERA</span>
            <nav className="hidden gap-8 text-sm text-[var(--w-muted)] md:flex">
              {[
                ["Проекты", "#projects"],
                ["Генплан", "#genplan"],
                ["Подбор", "#picker"],
                ["Ход работ", "#progress"],
                ["Коммерция", "#commerce"],
                ["Контакты", "#contacts"],
              ].map(([item, href]) => (
                <a key={item} href={href} className="transition-colors hover:text-[var(--w-ink)]">
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Addon id="langs" inline scroll={false}>
                <span className="hidden rounded-full border border-[var(--w-line)] px-3 py-1.5 text-[0.7rem] tracking-[0.12em] text-[var(--w-muted)] sm:inline-block">
                  RU <span className="opacity-40">EN UZ</span>
                </span>
              </Addon>
              <a href="#picker" className="w-glow rounded-full bg-[var(--w-accent)] px-5 py-2.5 text-sm font-medium text-[var(--w-accent-ink)]">
                {voice.closing.primary}
              </a>
            </div>
          </div>
        </header>

        {/* Наш инструмент показа, а не часть сайта: тёмная плашка поверх света. */}
        <PaletteBar />

        {/* Кадр и условия покупки — один раздел: лента лежит на самом кадре. */}
        <PaletteSection id="hero" curved={false} className="pb-16">
          <CinemaHero hero={voice.hero} />

          {/* Условия покупки — стеклянной лентой сразу под кадром. Допник «Строка условий». */}
          <Addon id="promo" className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
            <Rise className="relative z-10 -mt-10 grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] shadow-[var(--w-shadow)] sm:grid-cols-3">
              {terms.map((term) => (
                <div key={term.label} className="bg-[var(--w-surface)]/90 p-6 backdrop-blur-xl">
                  <p className="text-2xl font-semibold text-[var(--w-accent)]">{term.value}</p>
                  <p className="mt-2 text-sm text-[var(--w-muted)]">{term.label}</p>
                </div>
              ))}
            </Rise>
          </Addon>
        </PaletteSection>

        {/* Цифры, которые досчитываются. */}
        <PaletteSection id="stats" tone="paper">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
            <Rise className="max-w-2xl">
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">
                {voice.stats.eyebrow}
              </p>
              <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">{voice.stats.title}</h2>
            </Rise>
            <Rise delay={120} className="mt-12">
              <Counters items={stats} />
            </Rise>
          </div>
        </PaletteSection>

        {/* Кинолента проектов. */}
        <PaletteSection id="projects" anchor="projects">
          <div className="mx-auto w-full max-w-[1500px] px-5 pt-24 sm:px-8">
            <Rise className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="text-[clamp(1.9rem,3.6vw,3rem)]">{voice.portfolio.title}</h2>
              <p className="max-w-xs text-sm text-[var(--w-muted)]">{voice.portfolio.note}</p>
            </Rise>
          </div>
          <Rise delay={80} className="mx-auto mb-24 mt-10 w-full max-w-[1500px] px-5 sm:px-8">
            <FilmRail claims={voice.claims} projects={projects} />
          </Rise>
        </PaletteSection>

        {/* Генплан — работает по-настоящему. */}
        <PaletteSection id="genplan" tone="paper" anchor="genplan">
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
        </PaletteSection>

        {/* Шахматка. */}
        <PaletteSection id="picker" anchor="picker">
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
        </PaletteSection>

        {/* Ход строительства — допник, в «Премиуме» входит в пакет. */}
        <PaletteSection id="progress" tone="paper" anchor="progress">
          <Addon id="progress">
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
                    <figure key={month} className="overflow-hidden rounded-[var(--w-radius)] border border-[var(--w-line)] bg-[var(--w-surface)]">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={index % 2 ? "/images/mavera/construction.jpg" : "/images/mavera/facade.jpg"}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="px-4 py-3 text-sm text-[var(--w-muted)]">{month} 2026</figcaption>
                    </figure>
                  ))}
                </div>
              </Rise>
            </div>
          </Addon>
        </PaletteSection>

        {/* Только в «Премиуме»: как росла цена по стадиям. */}
        <PaletteSection id="invest">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
            <Rise className="max-w-2xl">
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--w-accent)]">
                Инвестору
              </p>
              <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">{investment.title}</h2>
              <p className="mt-5 text-lg leading-relaxed text-[var(--w-muted)]">{investment.note}</p>
            </Rise>

            <Rise delay={120} className="mt-14 overflow-x-auto">
              <div className="flex h-56 min-w-[22rem] items-end gap-3 sm:gap-6">
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

            {/* Обычная квартира: не доходность, а что будет с ценой через пять лет. */}
            <Rise delay={160} className="mt-16">
              <ProjectForecast variant="premium" />
            </Rise>
          </div>
        </PaletteSection>

        {/* Коммерческая недвижимость: объекты в Ташкенте, доходность, заявка в банк. */}
        <PaletteSection id="commerce" tone="paper" anchor="commerce">
          <Commerce variant="premium" title={voice.commercial.title} note={voice.commercial.note} />
        </PaletteSection>

        {/* Только в «Премиуме»: порядок онлайн-сделки и вопросы к нему. */}
        <PaletteSection id="deal" tone="bg">
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
                  className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6"
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
        </PaletteSection>

        {/* Допники «Отзывы» и «Новости» — перед финальным кадром. */}
        <PaletteSection id="voices" tone="paper">
          <Addon id="reviews">
            <Reviews variant="premium" />
          </Addon>
          <Addon id="news">
            <News variant="premium" />
          </Addon>
        </PaletteSection>

        {/* Финальный кадр. */}
        <PaletteSection id="contacts" tone="paper" anchor="contacts" className="overflow-hidden">
          <Image
            src="/images/mavera/park.jpg"
            alt=""
            fill
            sizes="100vw"
            className="-z-20 object-cover opacity-25"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--w-paper)] via-[var(--w-paper)]/85 to-[var(--w-paper)]/65" />

          <div className="mx-auto w-full max-w-[1500px] px-5 py-28 text-center sm:px-8">
            <Rise>
              <h2 className="mx-auto max-w-3xl text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05]">
                {voice.closing.title}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--w-muted)]">
                {voice.closing.text}
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <DemoSubmit
                  label={voice.closing.primary}
                  done="Заявка принята. Менеджер свяжется в течение 15 минут."
                  className="w-glow rounded-full bg-[var(--w-accent)] px-9 py-4 text-sm font-medium text-[var(--w-accent-ink)]"
                />
                <a href="#picker" className="rounded-full border border-[var(--w-line)] px-9 py-4 text-sm">
                  {voice.closing.secondary}
                </a>
              </div>
            </Rise>
          </div>
        </PaletteSection>

        <footer className="border-t border-[var(--w-line)] bg-[var(--w-bg)]">
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
      </PaletteRoot>
    </ConfiguratorProvider>
  );
}

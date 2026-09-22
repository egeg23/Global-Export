import type { Metadata } from "next";
import Image from "next/image";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Addon, ConfiguratorProvider } from "@/components/configurator/context";
import { maveraCatalog, maveraHrefs } from "@/content/mavera/catalog";
import { DemoSubmit } from "@/components/mavera/demo-submit";
import { Genplan, Picker } from "@/components/present/mavera/interactive";
import { Amenities, Collection, Manifesto, NoirHero } from "@/components/mavera/noir/scenes";
import { Commerce } from "@/components/mavera/commerce/section";
import { ProjectForecast } from "@/components/mavera/forecast/project-forecast";
import { PaletteBar, PaletteRoot, PaletteSection } from "@/components/mavera/premium/palette";
import { Counters } from "@/components/mavera/premium/scenes";
import { Rise } from "@/components/mavera/reveal";
import { News, Reviews } from "@/components/mavera/sections";
import { VariantBar } from "@/components/mavera/variant-bar";
import { projects, stats, terms } from "@/content/mavera/data";
import { noirPhotos } from "@/content/mavera/noir";
import { faq, investment, voices } from "@/content/mavera/voice";

export const metadata: Metadata = { title: "Вариант 04 — «Премиум Noir»" };

/**
 * Вариант 04 — «Премиум Noir». Люкс-сегмент по американской модели.
 *
 * Тот же пакет и те же рабочие экраны, что у «Премиума» — генплан,
 * шахматка, планировки, бронь, — но подача другая: тёмный экран, ночной
 * кадр во весь рост, латунь, засечный заголовок и тишина вместо кнопок с
 * восклицаниями. Так продают резиденции в Нью-Йорке и Майами: не «оставьте
 * заявку», а «частный показ по записи»; не «удобства», а «сервис
 * резиденций»; не квадратные метры, а адрес.
 *
 * Палитра переключается прямо на странице — целиком и по разделам, как у
 * светлого «Премиума», только набор тёмный: чёрный, тёмно-синий, мокрый
 * асфальт. Глубина двойная: прокрутка двигает слои и на телефоне, курсор
 * добавляет своё на компьютере.
 */
const voice = voices.noir;

export default function MaveraNoir() {
  return (
    <ConfiguratorProvider catalog={maveraCatalog} tier="noir" page="main" hrefs={maveraHrefs("noir", projects[0].slug)} frame="world">
      <DevuzIntro project="mavera" />
      <VariantBar current="noir" />

      <PaletteRoot set="dark">
        {/* Шапка: тонкая, стеклянная, с латунной кнопкой показа. */}
        <header className="sticky top-0 z-40 border-b border-[var(--w-line)] bg-[var(--w-bg)]/70 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-6 px-5 py-4 sm:px-8">
            <span className="text-lg font-light tracking-[0.42em]">MAVERA</span>
            <nav className="hidden gap-8 text-sm text-[var(--w-muted)] md:flex">
              {[
                ["Резиденции", "#projects"],
                ["Генплан", "#genplan"],
                ["Подбор", "#picker"],
                ["Сервис", "#amenities"],
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
                <span className="hidden rounded-[var(--w-radius)] border border-[var(--w-line)] px-3 py-1.5 text-[0.7rem] tracking-[0.12em] text-[var(--w-muted)] sm:inline-block">
                  RU <span className="opacity-40">EN UZ</span>
                </span>
              </Addon>
              <a href="#contacts" className="w-glow rounded-[var(--w-radius)] bg-[var(--w-accent)] px-5 py-2.5 text-sm font-medium text-[var(--w-accent-ink)]">
                {voice.closing.primary}
              </a>
            </div>
          </div>
        </header>

        {/* Наш инструмент показа, а не часть сайта. */}
        <PaletteBar />

        {/* Кадр и условия покупки. */}
        <PaletteSection id="hero" curved={false} className="pb-16">
          <NoirHero hero={voice.hero} />

          {/* Условия покупки — латунные цифры на стекле под кадром. Допник «Строка условий». */}
          <Addon id="promo" className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
            <Rise className="relative z-10 -mt-8 grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] shadow-[var(--w-shadow)] sm:grid-cols-3">
              {terms.map((term) => (
                <div key={term.label} className="bg-[var(--w-surface)]/85 p-6 backdrop-blur-xl">
                  <p className="text-2xl text-[var(--w-accent)]">{term.value}</p>
                  <p className="mt-2 text-sm text-[var(--w-muted)]">{term.label}</p>
                </div>
              ))}
            </Rise>
          </Addon>
        </PaletteSection>

        {/* Манифест. */}
        <PaletteSection id="manifesto" tone="paper">
          <Manifesto />
        </PaletteSection>

        {/* Цифры, которые досчитываются. */}
        <PaletteSection id="stats">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
            <Rise className="max-w-2xl">
              <p className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-[var(--w-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
                {voice.stats.eyebrow}
              </p>
              <h2 className="mt-8 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">{voice.stats.title}</h2>
            </Rise>
            <Rise delay={120} className="mt-12">
              <Counters items={stats} />
            </Rise>
          </div>
        </PaletteSection>

        {/* Коллекция резиденций. */}
        <PaletteSection id="projects" tone="paper" anchor="projects">
          <div className="mx-auto w-full max-w-[1500px] px-5 pt-24 sm:px-8">
            <Rise className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="text-[clamp(1.9rem,3.6vw,3rem)]">{voice.portfolio.title}</h2>
              <p className="max-w-xs text-sm text-[var(--w-muted)]">{voice.portfolio.note}</p>
            </Rise>
          </div>
          <div className="mx-auto mb-24 mt-10 w-full max-w-[1500px] px-5 sm:px-8">
            <Collection claims={voice.claims} projects={projects} />
          </div>
        </PaletteSection>

        {/* Генплан — работает по-настоящему. */}
        <PaletteSection id="genplan" anchor="genplan">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
            <Rise className="max-w-2xl">
              <p className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-[var(--w-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
                Шаг 1
              </p>
              <h2 className="mt-8 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">Выберите корпус</h2>
              <p className="mt-5 text-lg leading-relaxed text-[var(--w-muted)]">
                Корпуса на генплане кликабельны: статус, этажность, срок сдачи и
                стартовая цена меняются справа. Отсюда — в подбор резиденции.
              </p>
            </Rise>
            <Rise delay={120} className="mt-12 text-[1.05rem]">
              <Genplan live currency="uzs" />
            </Rise>
          </div>
        </PaletteSection>

        {/* Шахматка. */}
        <PaletteSection id="picker" tone="paper" anchor="picker">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
            <Rise className="max-w-2xl">
              <p className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-[var(--w-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
                Шаг 2
              </p>
              <h2 className="mt-8 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">Выберите резиденцию</h2>
              <p className="mt-5 text-lg leading-relaxed text-[var(--w-muted)]">
                Шахматка этажей со статусами: свободна, резерв, продана. Клик по
                клетке открывает планировку и цену.
              </p>
            </Rise>
            <Rise delay={120} className="mt-12 text-[1.05rem]">
              <Picker live currency="uzs" />
            </Rise>
          </div>
        </PaletteSection>

        {/* Сервис резиденций — то, чего нет в светлом «Премиуме». */}
        <PaletteSection id="amenities" anchor="amenities">
          <Amenities />
        </PaletteSection>

        {/* Ход строительства — допник, в пакете. */}
        <PaletteSection id="progress" tone="paper" anchor="progress">
          <Addon id="progress">
            <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
              <Rise className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-[var(--w-accent)]">
                    <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
                    Шаг 3
                  </p>
                  <h2 className="mt-8 text-[clamp(1.9rem,3.6vw,3rem)]">Следите за стройкой</h2>
                </div>
                <p className="text-sm text-[var(--w-muted)]">Фотоотчёт — каждый месяц, в личном кабинете</p>
              </Rise>

              <Rise delay={100} className="mt-10">
                <div className="h-px w-full overflow-hidden bg-[var(--w-line)]">
                  <span className="block h-full w-[68%] bg-[var(--w-accent)]" />
                </div>
                <p className="mt-3 text-sm text-[var(--w-muted)]">
                  Резиденция «Чинор» · готовность 68% · монтаж фасадов, внутренние работы
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
                          className="object-cover opacity-80 transition-opacity duration-700 hover:opacity-100"
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

        {/* Капитал: как росла цена по стадиям. */}
        <PaletteSection id="invest">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
            <Rise className="max-w-2xl">
              <p className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-[var(--w-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
                Капитал
              </p>
              <h2 className="mt-8 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">{investment.title}</h2>
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
              <ProjectForecast variant="noir" />
            </Rise>
          </div>
        </PaletteSection>

        {/* Коммерческая недвижимость: объекты в Ташкенте, доходность, заявка в банк. */}
        <PaletteSection id="commerce" tone="paper" anchor="commerce">
          <Commerce variant="noir" title={voice.commercial.title} note={voice.commercial.note} />
        </PaletteSection>

        {/* Сделка и вопросы. */}
        <PaletteSection id="deal" tone="bg">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-24 sm:px-8">
            <Rise className="max-w-2xl">
              <p className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-[var(--w-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
                Сделка
              </p>
              <h2 className="mt-8 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.05]">{voice.steps.title}</h2>
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
                <Rise key={item.q} delay={index * 70} className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] p-6">
                  <h3 className="text-lg">{item.q}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--w-muted)]">{item.a}</p>
                </Rise>
              ))}
            </div>
          </div>
        </PaletteSection>

        {/* Допники «Отзывы» и «Новости». */}
        <PaletteSection id="voices" tone="paper">
          <Addon id="reviews">
            <Reviews variant="noir" />
          </Addon>
          <Addon id="news">
            <News variant="noir" />
          </Addon>
        </PaletteSection>

        {/* Финальный кадр: ночной город и частный показ. */}
        <PaletteSection id="contacts" tone="paper" anchor="contacts" className="overflow-hidden">
          <Image src={noirPhotos.skyline} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-40" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--w-paper)] via-[var(--w-paper)]/80 to-[var(--w-paper)]/40" />

          <div className="mx-auto w-full max-w-[1500px] px-5 py-28 text-center sm:px-8 lg:py-36">
            <Rise>
              <p className="flex items-center justify-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-[var(--w-accent)]">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
                {voice.closing.eyebrow}
                <span aria-hidden="true" className="h-px w-10 bg-[var(--w-accent)]" />
              </p>
              <h2 className="mx-auto mt-8 max-w-3xl text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05]">
                {voice.closing.title}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--w-muted)]">
                {voice.closing.text}
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <DemoSubmit
                  label={voice.closing.primary}
                  done="Записали. Персональный менеджер свяжется в течение часа и предложит время показа."
                  className="w-glow rounded-[var(--w-radius)] bg-[var(--w-accent)] px-9 py-4 text-sm font-medium text-[var(--w-accent-ink)]"
                />
                <a href="#picker" className="rounded-[var(--w-radius)] border border-[var(--w-ink)]/30 px-9 py-4 text-sm transition-colors hover:border-[var(--w-accent)]">
                  {voice.closing.secondary}
                </a>
              </div>
            </Rise>
          </div>
        </PaletteSection>

        <footer className="border-t border-[var(--w-line)] bg-[var(--w-bg)]">
          <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-6 px-5 py-10 text-sm text-[var(--w-muted)] sm:px-8">
            <span className="text-base font-light tracking-[0.42em] text-[var(--w-ink)]">MAVERA</span>
            <span>Ташкент, ул. ______, 00 · +998 (__) ___-__-__ · показы по записи</span>
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

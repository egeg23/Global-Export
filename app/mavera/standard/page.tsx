import type { Metadata } from "next";
import Image from "next/image";

import { Addon, ConfiguratorProvider } from "@/components/mavera/configurator/context";
import { Live, Magnetic, Words } from "@/components/mavera/configurator/live";
import { Rise } from "@/components/mavera/reveal";
import { News, Reviews } from "@/components/mavera/sections";
import { StandardCatalog } from "@/components/mavera/standard/catalog";
import { VariantBar } from "@/components/mavera/variant-bar";
import { money } from "@/components/present/mavera/theme";
import { commercial, projects, stats, terms } from "@/content/mavera/data";
import { expenses, finishes, voices } from "@/content/mavera/voice";

export const metadata: Metadata = { title: "Вариант 01 — «Стандарт»" };

/**
 * Вариант 01 — «Стандарт», швейцарская школа.
 *
 * Белый лист, строгая сетка, волосяные линии, нулевой радиус и ровно один
 * акцентный цвет. Движения почти нет — только проявление блоков и подсветка
 * при наведении: вариант обещает быстрый понятный каталог, и оформление не
 * должно обещать больше, чем входит в смету.
 */
const voice = voices.standard;

export default function MaveraStandard() {
  return (
    <ConfiguratorProvider tier="standard" page="main" objectHref={`/mavera/standard/${projects[0].slug}`}>
      <VariantBar current="standard" />

      {/* Шапка — тонкая, липкая, без теней. */}
      <header className="sticky top-0 z-40 border-b border-[var(--w-line)] bg-[var(--w-bg)]">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <span className="text-lg font-semibold tracking-[0.3em]">MAVERA</span>
          <nav className="hidden gap-8 text-sm text-[var(--w-muted)] md:flex">
            {["Каталог", "О компании", "Коммерция", "Как купить", "Контакты"].map((item, index) => (
              <span key={item} className={index === 0 ? "text-[var(--w-ink)]" : undefined}>
                {item}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-5 text-sm">
            <span className="hidden tabular-nums sm:inline">+998 (__) ___-__-__</span>
            <Addon id="langs" inline scroll={false}>
              <span className="border border-[var(--w-line)] px-2 py-1 text-[0.7rem] tracking-[0.12em] text-[var(--w-muted)]">
                RU <span className="opacity-40">EN UZ</span>
              </span>
            </Addon>
          </div>
        </div>
      </header>

      {/* Первый экран: половина — снимок, половина — форма подбора. */}
      <section className="border-b border-[var(--w-line)]">
        <div className="mx-auto grid w-full max-w-[1400px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:py-24">
            {/* Допник «Живой первый экран»: заголовок собирается по словам, кадр справа наезжает. */}
            <Addon id="hero" flag>
              <Rise>
                <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
                  {voice.hero.eyebrow}
                </p>
                <h1 className="mt-6 max-w-xl text-[clamp(2.4rem,5vw,4rem)] leading-[1.04]">
                  <Words text={`${voice.hero.titleTop} ${voice.hero.titleBottom}`} />
                </h1>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--w-muted)]">
                  {voice.hero.lead}
                </p>
              </Rise>
            </Addon>

            <Rise delay={120}>
              {/* Форма подбора прямо на первом экране — швейцарская прямота. */}
              <div className="mt-10 grid border border-[var(--w-line)] sm:grid-cols-3">
                {[
                  ["Комнат", "1 · 2 · 3 · 4"],
                  ["Бюджет", "до 900 млн сум"],
                  ["Срок сдачи", "до 2028"],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-[var(--w-line)] p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                    <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--w-muted)]">{label}</p>
                    <p className="mt-1.5 text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Допник «Магнитные кнопки»: тянутся к курсору и подсвечиваются. */}
              <Addon id="magnetic" flag className="mt-4">
                <div className="flex flex-wrap gap-3">
                  <Magnetic>
                    <span className="inline-block bg-[var(--w-accent)] px-7 py-3.5 text-sm font-medium text-[var(--w-accent-ink)]">
                      {voice.hero.primary}
                    </span>
                  </Magnetic>
                  <Magnetic>
                    <span className="inline-block border border-[var(--w-line)] px-7 py-3.5 text-sm">
                      {voice.hero.secondary}
                    </span>
                  </Magnetic>
                </div>
              </Addon>
            </Rise>
          </div>

          <div className="relative min-h-[320px] overflow-hidden border-t border-[var(--w-line)] lg:min-h-0 lg:border-l lg:border-t-0">
            <Live id="hero" base="absolute inset-0" className="w-kenburns">
              <Image
                src="/images/mavera/hero-catalog.jpg"
                alt="Жилой дом MAVERA"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </Live>
          </div>
        </div>
      </section>

      {/* Цифры — таблицей, без украшений. */}
      <section className="border-b border-[var(--w-line)]">
        <div className="mx-auto w-full max-w-[1400px] px-5 pt-14 sm:px-8">
          <Rise>
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
              {voice.stats.eyebrow}
            </p>
            <h2 className="mt-4 text-[clamp(1.6rem,2.6vw,2.2rem)]">{voice.stats.title}</h2>
          </Rise>
        </div>
        <dl className="mx-auto grid w-full max-w-[1400px] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Rise
              key={stat.label}
              delay={index * 60}
              className="border-b border-[var(--w-line)] px-5 py-10 last:border-b-0 sm:px-8 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <dd className="text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-none tabular-nums">
                {stat.value}
                {stat.suffix ? (
                  <span className="ml-2 text-base font-normal text-[var(--w-muted)]">{stat.suffix}</span>
                ) : null}
              </dd>
              <dt className="mt-3 text-sm text-[var(--w-muted)]">{stat.label}</dt>
            </Rise>
          ))}
        </dl>
      </section>

      {/* Каталог с работающим фильтром — сердце варианта. */}
      <section className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8">
        <Rise className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">Каталог</p>
            <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">{voice.portfolio.title}</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[var(--w-muted)]">
            {voice.portfolio.note}
          </p>
        </Rise>

        <Rise delay={100} className="mt-10">
          <StandardCatalog claims={voice.claims} projects={projects} />
        </Rise>
      </section>

      {/* Условия покупки — строкой, без баннеров. Допник «Строка условий». */}
      <Addon id="promo" as="section" className="border-y border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto grid w-full max-w-[1400px] sm:grid-cols-3">
          {terms.map((term, index) => (
            <Rise
              key={term.label}
              delay={index * 60}
              className="border-b border-[var(--w-line)] px-5 py-8 last:border-b-0 sm:px-8 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <p className="text-2xl font-semibold tabular-nums text-[var(--w-accent)]">{term.value}</p>
              <p className="mt-2 text-sm text-[var(--w-muted)]">{term.label}</p>
            </Rise>
          ))}
        </div>
      </Addon>

      {/* Как купить — четыре шага, пронумерованные. */}
      <section className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8">
        <Rise>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">Как купить</p>
          <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">{voice.steps.title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--w-muted)]">
            {voice.steps.note}
          </p>
        </Rise>

        <ol className="mt-12 grid gap-px bg-[var(--w-line)] md:grid-cols-4">
          {voice.steps.items.map((step, index) => (
            <Rise as="li" key={step.title} delay={index * 80} className="bg-[var(--w-bg)] p-6">
              <span className="text-sm tabular-nums text-[var(--w-accent)]">0{index + 1}</span>
              <h3 className="mt-4 text-lg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--w-muted)]">{step.text}</p>
            </Rise>
          ))}
        </ol>
      </section>

      {/* Только в «Стандарте»: что входит в цену и во что обходится дом потом. */}
      <section className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8">
          <Rise>
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
              Отделка
            </p>
            <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">Что входит в цену</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--w-muted)]">
              Три варианта на выбор. Разница в цене указана сразу — считать её у
              менеджера не придётся.
            </p>
          </Rise>

          <div className="mt-10 grid gap-px bg-[var(--w-line)] md:grid-cols-3">
            {finishes.map((finish, index) => (
              <Rise key={finish.name} delay={index * 70} className="bg-[var(--w-surface)] p-6">
                <div className="flex items-baseline justify-between gap-4 border-b border-[var(--w-line)] pb-4">
                  <h3 className="text-lg">{finish.name}</h3>
                  <span className="text-sm text-[var(--w-accent)]">{finish.price}</span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {finish.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-[var(--w-muted)]">
                      <span aria-hidden="true" className="text-[var(--w-accent)]">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Rise>
            ))}
          </div>

          <Rise delay={120} className="mt-12">
            <h3 className="text-lg">Расходы после покупки</h3>
            <dl className="mt-6 grid gap-px bg-[var(--w-line)] sm:grid-cols-2 lg:grid-cols-4">
              {expenses.map((item) => (
                <div key={item.label} className="bg-[var(--w-surface)] p-5">
                  <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--w-muted)]">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-xl tabular-nums">{item.value}</dd>
                  <p className="mt-1 text-xs text-[var(--w-muted)]">{item.note}</p>
                </div>
              ))}
            </dl>
          </Rise>
        </div>
      </section>

      {/* Коммерция — компактной таблицей. */}
      <section className="border-t border-[var(--w-line)]">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8">
          <Rise className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
                Коммерческая недвижимость
              </p>
              <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">{voice.commercial.title}</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--w-muted)]">
              {voice.commercial.note}
            </p>
          </Rise>

          <Rise delay={100} className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-[var(--w-line)] text-[0.65rem] uppercase tracking-[0.14em] text-[var(--w-muted)]">
                  <th className="py-3 pr-6 font-normal">Объект</th>
                  <th className="py-3 pr-6 font-normal">Назначение</th>
                  <th className="py-3 pr-6 font-normal">Площадь</th>
                  <th className="py-3 pr-6 font-normal">Сделка</th>
                  <th className="py-3 font-normal">Статус</th>
                </tr>
              </thead>
              <tbody>
                {commercial.map((item) => (
                  <tr key={item.name} className="border-b border-[var(--w-line)]">
                    <td className="py-4 pr-6">{item.name}</td>
                    <td className="py-4 pr-6 text-[var(--w-muted)]">{item.kind}</td>
                    <td className="py-4 pr-6 tabular-nums">{item.area}</td>
                    <td className="py-4 pr-6 text-[var(--w-muted)]">{item.deal}</td>
                    <td className="py-4">
                      <span className="bg-[var(--w-accent-soft)] px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-[var(--w-accent)]">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Rise>
        </div>
      </section>

      {/* Допники «Отзывы» и «Новости» — перед формой заявки. */}
      <Addon id="reviews" as="section" className="border-t border-[var(--w-line)]">
        <Reviews variant="standard" />
      </Addon>
      <Addon id="news" as="section" className="border-t border-[var(--w-line)]">
        <News variant="standard" />
      </Addon>

      {/* Контакты и форма — плоские, как всё остальное. */}
      <section className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <Rise>
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
              {voice.closing.eyebrow}
            </p>
            <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">{voice.closing.title}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--w-muted)]">
              {voice.closing.text}
            </p>
            <dl className="mt-10 border-t border-[var(--w-line)]">
              {[
                ["Телефон", "+998 (__) ___-__-__"],
                ["Почта", "sale@mavera.uz"],
                ["Адрес", "Ташкент, ул. ______, 00"],
                ["Часы", "Ежедневно, 09:00 — 19:00"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 border-b border-[var(--w-line)] py-4">
                  <dt className="text-sm text-[var(--w-muted)]">{label}</dt>
                  <dd className="text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          </Rise>

          <Rise delay={120}>
            <form className="border border-[var(--w-line)] bg-[var(--w-surface)] p-6 sm:p-8">
              <p className="text-lg">Оставить заявку</p>
              <div className="mt-6 flex flex-col gap-4">
                {["Имя", "Телефон"].map((field) => (
                  <label key={field} className="block">
                    <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--w-muted)]">{field}</span>
                    <input
                      type="text"
                      placeholder={field}
                      className="mt-2 w-full border border-[var(--w-line)] bg-[var(--w-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--w-accent)]"
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--w-muted)]">Комментарий</span>
                  <textarea
                    rows={3}
                    placeholder="Какая квартира нужна"
                    className="mt-2 w-full resize-none border border-[var(--w-line)] bg-[var(--w-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--w-accent)]"
                  />
                </label>
              </div>
              <button
                type="button"
                className="mt-6 w-full bg-[var(--w-accent)] px-6 py-3.5 text-sm font-medium text-[var(--w-accent-ink)] transition-opacity hover:opacity-90"
              >
                {voice.closing.primary}
              </button>
              <p className="mt-4 text-xs text-[var(--w-muted)]">
                Заявка уходит на почту и в Telegram отдела продаж. Демонстрация — ничего
                не отправляется.
              </p>
            </form>
          </Rise>
        </div>
      </section>

      <footer className="border-t border-[var(--w-line)]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-[var(--w-muted)] sm:px-8">
          <span className="tracking-[0.3em] text-[var(--w-ink)]">MAVERA</span>
          <span>Средняя цена по портфелю — {money(1023, "uzs")} за м²</span>
          <span className="flex gap-4">
            <span>Instagram</span>
            <span>Telegram</span>
            <span>WhatsApp</span>
          </span>
        </div>
      </footer>
    </ConfiguratorProvider>
  );
}

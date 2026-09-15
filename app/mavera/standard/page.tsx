import type { Metadata } from "next";
import Image from "next/image";

import { Rise } from "@/components/mavera/reveal";
import { StandardCatalog } from "@/components/mavera/standard/catalog";
import { VariantBar } from "@/components/mavera/variant-bar";
import { money } from "@/components/present/mavera/theme";
import { commercial, stats, steps, terms } from "@/content/mavera/data";

export const metadata: Metadata = { title: "Вариант 01 — «Стандарт»" };

/**
 * Вариант 01 — «Стандарт», швейцарская школа.
 *
 * Белый лист, строгая сетка, волосяные линии, нулевой радиус и ровно один
 * акцентный цвет. Движения почти нет — только проявление блоков и подсветка
 * при наведении: вариант обещает быстрый понятный каталог, и оформление не
 * должно обещать больше, чем входит в смету.
 */
export default function MaveraStandard() {
  return (
    <div data-world="standard">
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
            <span className="border border-[var(--w-line)] px-2 py-1 text-[0.7rem] tracking-[0.12em] text-[var(--w-muted)]">
              RU <span className="opacity-40">EN UZ</span>
            </span>
          </div>
        </div>
      </header>

      {/* Первый экран: половина — снимок, половина — форма подбора. */}
      <section className="border-b border-[var(--w-line)]">
        <div className="mx-auto grid w-full max-w-[1400px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:py-24">
            <Rise>
              <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
                Застройщик · Ташкент
              </p>
              <h1 className="mt-6 max-w-xl text-[clamp(2.4rem,5vw,4rem)] leading-[1.04]">
                Квартира за три клика
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--w-muted)]">
                Шесть жилых комплексов, 12 400 переданных квартир и честный фильтр:
                бюджет, комнатность, срок сдачи. Без «цена по запросу».
              </p>
            </Rise>

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

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="bg-[var(--w-accent)] px-7 py-3.5 text-sm font-medium text-[var(--w-accent-ink)]">
                  Показать 86 квартир
                </span>
                <span className="border border-[var(--w-line)] px-7 py-3.5 text-sm">
                  Скачать прайс
                </span>
              </div>
            </Rise>
          </div>

          <div className="relative min-h-[320px] border-t border-[var(--w-line)] lg:min-h-0 lg:border-l lg:border-t-0">
            <Image
              src="/images/mavera/hero-catalog.jpg"
              alt="Жилой дом MAVERA"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Цифры — таблицей, без украшений. */}
      <section className="border-b border-[var(--w-line)]">
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
            <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">Шесть жилых комплексов</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[var(--w-muted)]">
            Фильтр работает без перезагрузки, выбранное состояние попадает в адрес
            страницы — ссылку на «только бизнес-класс» можно отправить клиенту.
          </p>
        </Rise>

        <Rise delay={100} className="mt-10">
          <StandardCatalog />
        </Rise>
      </section>

      {/* Условия покупки — строкой, без баннеров. */}
      <section className="border-y border-[var(--w-line)] bg-[var(--w-paper)]">
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
      </section>

      {/* Как купить — четыре шага, пронумерованные. */}
      <section className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8">
        <Rise>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">Как купить</p>
          <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">Четыре шага до ключей</h2>
        </Rise>

        <ol className="mt-12 grid gap-px bg-[var(--w-line)] md:grid-cols-4">
          {steps.map((step, index) => (
            <Rise as="li" key={step.title} delay={index * 80} className="bg-[var(--w-bg)] p-6">
              <span className="text-sm tabular-nums text-[var(--w-accent)]">0{index + 1}</span>
              <h3 className="mt-4 text-lg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--w-muted)]">{step.text}</p>
            </Rise>
          ))}
        </ol>
      </section>

      {/* Коммерция — компактной таблицей. */}
      <section className="border-t border-[var(--w-line)]">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8">
          <Rise className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
                Коммерческая недвижимость
              </p>
              <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">Продажа и аренда</h2>
            </div>
            <p className="text-sm text-[var(--w-muted)]">
              Заявки из раздела идут отдельной линией — в свой отдел.
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

      {/* Контакты и форма — плоские, как всё остальное. */}
      <section className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <Rise>
            <h2 className="text-[clamp(1.8rem,3vw,2.6rem)]">Приезжайте в офис продаж</h2>
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
                Отправить
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
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Rise } from "@/components/mavera/reveal";
import { PaletteSwitch } from "@/components/showcase/palette";
import { useStage } from "@/components/showcase/depth";
import { analytics, capital, company, demandNote, nav, topProperties } from "@/content/tr/company";
import { trPalettes } from "@/content/tr/palettes";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Шапка                                                               */
/* ------------------------------------------------------------------ */

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--w-line)] bg-[var(--w-bg)]/92 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1500px] items-center gap-6 px-5 py-3.5 sm:px-8">
        <Link href="/tranio" className="flex shrink-0 items-center gap-2.5">
          <Image src="/images/tr/mark.svg" alt="" width={30} height={30} className="size-7" />
          <span className="text-[1.12rem] font-semibold tracking-[-0.02em] text-[var(--w-ink)]">
            Tranio
          </span>
        </Link>

        <nav className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-6">
            {nav.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-[0.86rem] text-[var(--w-muted)] transition-colors hover:text-[var(--w-ink)]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <a
            href={company.phoneHref}
            className="tr-figure hidden text-[0.88rem] text-[var(--w-ink)] sm:block"
          >
            {company.phone}
          </a>
          <Link
            href="/tranio/panel"
            className="rounded-[var(--w-radius)] border border-[var(--w-line)] px-3.5 py-2 text-[0.82rem] transition-colors hover:border-[var(--w-accent)]"
          >
            Войти
          </Link>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label="Открыть меню"
            className="cursor-pointer rounded-[var(--w-radius)] border border-[var(--w-line)] p-2 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
              <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-[var(--w-line)] px-5 pb-4 pt-2 lg:hidden">
          <ul className="grid gap-1">
            {nav.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-[0.94rem] text-[var(--w-muted)]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <PaletteSwitch world="tr" palettes={trPalettes} className="mt-4" />
        </nav>
      ) : null}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Раздел меморандума                                                  */
/* ------------------------------------------------------------------ */

/**
 * Глава — раздел меморандума: номер, линейка, заголовок, врезка.
 *
 * Номер стоит водяным знаком в глубине и едет медленнее текста: страница
 * перестаёт быть плоской в каждом разделе, а не только на первом экране.
 */
export function Chapter({
  id,
  number,
  title,
  lead,
  tone,
  children,
}: {
  id: string;
  number: string;
  title: React.ReactNode;
  lead?: string;
  tone?: "deep";
  children: React.ReactNode;
}) {
  const stage = useStage<HTMLElement>();

  return (
    <section
      ref={stage}
      id={id}
      data-tone={tone}
      className={cn(
        "relative isolate scroll-mt-24 overflow-x-clip py-20 sm:py-28",
        tone === "deep" && "bg-[var(--w-paper)] py-24 sm:py-32",
      )}
    >
      <span
        aria-hidden
        className="w-layer tr-figure pointer-events-none absolute -right-[2%] top-[5%] -z-10 hidden select-none text-[15vw] leading-none text-[var(--w-accent)] opacity-[0.06] md:block"
        style={{ "--w-depth": "185px", "--w-pull": "16px" } as React.CSSProperties}
      >
        {number}
      </span>

      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
        <div
          className="w-layer max-w-3xl"
          style={{ "--w-depth": "-54px", "--w-pull": "-10px" } as React.CSSProperties}
        >
          <Rise>
            <p className="tr-eyebrow">Раздел {number}</p>
            <h2 className="tr-rule mt-4 font-[family-name:var(--w-display)] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--w-ink)]">
              {title}
            </h2>
            {lead ? (
              <p className="mt-6 text-[1rem] leading-relaxed text-[var(--w-muted)]">{lead}</p>
            ) : null}
          </Rise>
        </div>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tranio Capital                                                      */
/* ------------------------------------------------------------------ */

export function Capital() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
      <div>
        <p className="text-[1.02rem] leading-relaxed text-[var(--w-muted)]">{capital.lead}</p>

        {/* Табличные строки с точками — как в печатном отчёте. */}
        <dl className="mt-8 grid gap-4">
          {capital.rows.map((row) => (
            <Rise as="div" key={row.label} className="flex items-baseline gap-3">
              <dt className="text-[0.92rem] text-[var(--w-muted)]">{row.label}</dt>
              <span className="tr-dots" aria-hidden />
              <dd className="tr-figure shrink-0 text-[1.15rem] text-[var(--w-ink)]">{row.value}</dd>
            </Rise>
          ))}
        </dl>

        <p className="mt-8 border-t border-[var(--w-line)] pt-5 text-[0.8rem] leading-relaxed text-[var(--w-muted)]">
          Соинвестируем вместе с клиентами: минимальный вход в проект — €70 тыс.
        </p>
      </div>

      <div>
        <p className="tr-eyebrow">Топ-3 коммерческих объектов</p>
        <ul className="mt-5 grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)]">
          {topProperties.map((item, index) => (
            <Rise as="li" key={item.id} delay={index * 80} className="bg-[var(--w-surface)]">
              <div className="flex items-stretch gap-4">
                <span className="relative w-28 shrink-0 overflow-hidden sm:w-36">
                  <Image
                    src={`/images/tr/top/${item.photo}.webp`}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col justify-center py-4 pr-4">
                  <span className="text-[0.96rem] font-medium text-[var(--w-ink)]">
                    {item.title}
                  </span>
                  <span className="mt-1 text-[0.8rem] text-[var(--w-muted)]">{item.country}</span>
                  <span className="mt-2.5 flex flex-wrap items-baseline gap-x-3">
                    <span className="tr-figure text-[0.92rem] text-[var(--w-ink)]">
                      {item.price}
                    </span>
                    <span className="tr-figure tr-yield text-[0.92rem]">
                      {item.yield.toLocaleString("ru-RU", { minimumFractionDigits: 1 })}% годовых
                    </span>
                  </span>
                </span>
              </div>
            </Rise>
          ))}
        </ul>
        <p className="mt-4 text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
          Три объекта из текущей подборки: цена и доходность годовая, до налогов.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Аналитика                                                           */
/* ------------------------------------------------------------------ */

export function Analytics() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
      <ul className="grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)]">
        {analytics.map((item, index) => (
          <Rise
            as="li"
            key={item.title}
            delay={index * 60}
            className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5 bg-[var(--w-surface)] p-5"
          >
            <span className="tr-figure w-28 shrink-0 text-[0.78rem] text-[var(--w-muted)]">
              {item.date}
            </span>
            <span className="tr-eyebrow shrink-0">{item.kind}</span>
            <span className="min-w-0 flex-1 basis-full text-[0.98rem] leading-snug text-[var(--w-ink)] sm:basis-0">
              {item.title}
            </span>
          </Rise>
        ))}
      </ul>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)]">
          <p className="tr-figure text-[clamp(2.4rem,6vw,3.6rem)] leading-none text-[var(--w-accent)]">
            {demandNote.figure}
          </p>
          <p className="mt-4 text-[0.92rem] leading-relaxed text-[var(--w-muted)]">
            {demandNote.text}
          </p>
        </div>
        <p className="mt-4 text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
          В нашей базе знаний 4 144 публикации и 108 аналитических материалов:
          по странам, налогам и стратегиям.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Контакты и подвал                                                   */
/* ------------------------------------------------------------------ */

export function Contacts() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Телефон", value: company.phone, href: company.phoneHref },
        { label: "Офисов", value: "10 в Евразии" },
        { label: "Сделок закрыто", value: "более 2 500" },
        { label: "Партнёров", value: "более 1 000" },
      ].map((item, index) => (
        <Rise
          as="div"
          key={item.label}
          delay={index * 70}
          className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6"
        >
          <p className="tr-eyebrow">{item.label}</p>
          {item.href ? (
            <a
              href={item.href}
              className="tr-figure mt-3 block text-[1.15rem] text-[var(--w-ink)] hover:text-[var(--w-accent)]"
            >
              {item.value}
            </a>
          ) : (
            <p className="tr-figure mt-3 text-[1.15rem] text-[var(--w-ink)]">{item.value}</p>
          )}
        </Rise>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
      <div className="mx-auto grid w-full max-w-[1500px] gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/images/tr/mark.svg" alt="" width={26} height={26} className="size-6" />
            <span className="text-[1rem] font-semibold text-[var(--w-ink)]">Tranio</span>
          </div>
          <p className="mt-3 max-w-2xl text-[0.8rem] leading-relaxed text-[var(--w-muted)]">
            Макет главной страницы, сделанный Maximov Tech для tranio.ru.
          </p>
        </div>
        <PaletteSwitch world="tr" palettes={trPalettes} className="lg:justify-end" />
      </div>
    </footer>
  );
}

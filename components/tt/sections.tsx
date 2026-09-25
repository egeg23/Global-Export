"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Rise } from "@/components/mavera/reveal";
import { PaletteSwitch } from "@/components/showcase/palette";
import { useStage } from "@/components/showcase/depth";
import { LangSwitch, useLang, useT } from "@/components/tt/lang";
import { branches, company, nav, projects } from "@/content/tt/company";
import { ttPalettesFor } from "@/content/tt/palettes";
import type { Pair } from "@/content/tt/i18n";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Шапка                                                               */
/* ------------------------------------------------------------------ */

export function Header() {
  const t = useT();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--w-line)] bg-[var(--w-bg)]/92 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1500px] items-center gap-5 px-5 py-3.5 sm:px-8">
        <Link href="/ttc" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/images/tt/logo.svg"
            alt=""
            width={80}
            height={32}
            className="h-7 w-auto"
          />
          <span className="sr-only">{t(company.legal)}</span>
        </Link>

        <nav className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-6">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[0.86rem] text-[var(--w-muted)] transition-colors hover:text-[var(--w-ink)]"
                >
                  {t(item.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <LangSwitch />
          <a
            href={`tel:${company.phone}`}
            className="tt-figure hidden text-[1rem] font-medium text-[var(--w-accent)] sm:block"
          >
            {company.phone}
          </a>
          <Link
            href="/ttc/panel"
            className="rounded-[var(--w-radius)] border border-[var(--w-line)] px-3.5 py-2 text-[0.82rem] transition-colors hover:border-[var(--w-accent)]"
          >
            {t({ ru: "Кабинет", kk: "Кабинет" })}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label={t({ ru: "Открыть меню", kk: "Мәзірді ашу" })}
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
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-[0.94rem] text-[var(--w-muted)]"
                >
                  {t(item.label)}
                </a>
              </li>
            ))}
          </ul>
          <PaletteSwitch world="tt" palettes={ttPalettesFor(lang)} className="mt-4" />
        </nav>
      ) : null}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Глава                                                               */
/* ------------------------------------------------------------------ */

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
  lead?: React.ReactNode;
  tone?: "deep";
  children: React.ReactNode;
}) {
  const stage = useStage<HTMLElement>();

  return (
    <section
      ref={stage}
      id={id}
      className={cn(
        "relative isolate scroll-mt-24 overflow-x-clip py-20 sm:py-28",
        tone === "deep" && "tt-grid bg-[var(--w-paper)] py-24 sm:py-32",
      )}
    >
      <span
        aria-hidden
        className="w-layer tt-figure pointer-events-none absolute -right-[2%] top-[6%] -z-10 hidden select-none text-[14vw] leading-none text-[var(--w-accent)] opacity-[0.07] md:block"
        style={{ "--w-depth": "180px", "--w-pull": "16px" } as React.CSSProperties}
      >
        {number}
      </span>

      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
        <div
          className="w-layer max-w-3xl"
          style={{ "--w-depth": "-52px", "--w-pull": "-10px" } as React.CSSProperties}
        >
          <Rise>
            <p className="tt-signal">{number}</p>
            <h2 className="mt-4 font-[family-name:var(--w-display)] text-[clamp(1.8rem,3.6vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[var(--w-ink)]">
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

/** Подпись главы с переводом — чтобы страница не тащила t() наружу. */
export function TT({ pair }: { pair: Pair }) {
  const t = useT();
  return <>{t(pair)}</>;
}

/* ------------------------------------------------------------------ */
/* Проекты                                                             */
/* ------------------------------------------------------------------ */

export function Projects() {
  const t = useT();

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <Rise
          as="li"
          key={project.id}
          delay={index * 70}
          className="overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)]"
        >
          <span className="relative block aspect-[16/9] w-full overflow-hidden bg-[var(--w-paper)]">
            <Image
              src={`/images/tt/projects/${project.id}.webp`}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </span>
          <span className="block p-5">
            <span className="block text-[1rem] font-medium text-[var(--w-ink)]">
              {t(project.title)}
            </span>
            <span className="mt-2 block text-[0.84rem] leading-snug text-[var(--w-muted)]">
              {t(project.note)}
            </span>
          </span>
        </Rise>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Контакты и подвал                                                   */
/* ------------------------------------------------------------------ */

export function Contacts() {
  const t = useT();

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <div className="grid gap-4">
        <a
          href={`tel:${company.phone}`}
          className="rounded-[var(--w-radius-lg)] border border-[var(--w-accent)] bg-[var(--w-accent-soft)] p-6 transition-opacity hover:opacity-90"
        >
          <p className="tt-signal">{t({ ru: "Контакт-центр", kk: "Байланыс орталығы" })}</p>
          <p className="tt-figure mt-3 text-[3rem] leading-none text-[var(--w-accent)]">
            {company.phone}
          </p>
          <p className="mt-3 text-[0.86rem] text-[var(--w-muted)]">{t(company.phoneNote)}</p>
        </a>

        <div className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6">
          <p className="tt-signal">{t({ ru: "Поддержка", kk: "Қолдау" })}</p>
          <p className="tt-figure mt-3 text-[1.15rem] text-[var(--w-ink)]">{company.email}</p>
          <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">
            {t(company.hours)} · {t({ ru: "режим работы", kk: "жұмыс режимі" })}
          </p>
        </div>
      </div>

      <div>
        <p className="tt-signal">{t({ ru: "Филиалы", kk: "Филиалдар" })}</p>
        <ul className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)] sm:grid-cols-3">
          {branches.map((branch, index) => (
            <li
              key={branch.id}
              style={{ "--nm-i": index } as React.CSSProperties}
              className="bg-[var(--w-surface)] px-4 py-3.5"
            >
              <span className="block text-[0.9rem] text-[var(--w-ink)]">{t(branch.name)}</span>
              {branch.hub ? (
                <span className="tt-signal mt-1 block text-[0.62rem]">
                  {t({ ru: "узел сети", kk: "желі түйіні" })}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Footer() {
  const t = useT();
  const { lang } = useLang();

  return (
    <footer className="border-t border-[var(--w-line)] bg-[var(--w-paper)]">
      <div className="mx-auto grid w-full max-w-[1500px] gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Image
            src="/images/tt/logo.svg"
            alt=""
            width={80}
            height={32}
            className="h-7 w-auto"
          />
          <p className="mt-3 max-w-2xl text-[0.8rem] leading-relaxed text-[var(--w-muted)]">
            {t({
              ru: "Макет главной страницы, сделанный Maximov Tech для ttc.kz. Цифры, услуги, проекты и филиалы взяты с их сайта; цены в конструкторе — ориентир по рынку, а не их тариф.",
              kk: "Maximov Tech ttc.kz үшін жасаған басты бет макеті. Сандар, қызметтер, жобалар және филиалдар олардың сайтынан алынған; конструктордағы бағалар — нарық бағдары, олардың тарифі емес.",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 lg:justify-end">
          <LangSwitch />
          <PaletteSwitch world="tt" palettes={ttPalettesFor(lang)} label={t({ ru: "Палитра", kk: "Палитра" })} />
        </div>
      </div>
    </footer>
  );
}

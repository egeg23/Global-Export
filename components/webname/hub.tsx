"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/webname/icons";
import { ArsenalLogo } from "@/components/webname/logo";
import { LogoAddress, LogoShield } from "@/components/webname/logos";
import { cn } from "@/lib/cn";

/**
 * Окно выбора вариантов макета Arsenal D — одна ссылка на всё.
 *
 * Два дизайна («Реестр» и «Премиум») и три логотипа (их нынешний,
 * перерисованный, и новые A «Адрес» и B «Щит»). Выбранное сочетание видно в
 * превью сразу, кнопка открывает сайт с ним: логотип включается тем же
 * допом конструктора (`?addons=logo-a`), что и тумблер внутри сайта, —
 * значит, там его можно переключить дальше. Ниже — все шесть сочетаний
 * сеткой, чтобы любое открывалось в одно касание.
 *
 * Превью — снимки первого экрана каждого сочетания
 * (public/images/webname/variants, 1440×900).
 */

type Design = "registry" | "premium";
type Mark = "old" | "a" | "b";

const DESIGNS: { id: Design; name: string; text: string; base: string; swatches: string[] }[] = [
  {
    id: "registry",
    name: "Реестр",
    text: "Защищённая бумага, гильош и красная печать: сайт как свидетельство на ваш адрес.",
    base: "/webname/registry",
    swatches: ["#edf2ef", "#111b3b", "#c4221a", "#17256a"],
  },
  {
    id: "premium",
    name: "Премиум",
    text: "Жидкое стекло, параллакс и голографическая карта домена на ночном фоне.",
    base: "/webname/premium",
    swatches: ["#0b0a10", "#c8304a", "#ecd09a", "#4640aa"],
  },
];

const MARKS: { id: Mark; name: string; text: string }[] = [
  { id: "old", name: "Текущий", text: "Их знак, перерисованный вектором" },
  { id: "a", name: "A · «Адрес»", text: "arsenal.d — имя как домен" },
  { id: "b", name: "B · «Щит»", text: "Щит с буквой D и звездой" },
];

function href(design: Design, mark: Mark, tail = "") {
  const base = DESIGNS.find((entry) => entry.id === design)!.base;
  return `${base}${tail}?addons=${mark === "old" ? "none" : `logo-${mark}`}`;
}

function MarkPreview({ mark, className }: { mark: Mark; className?: string }) {
  if (mark === "a") return <LogoAddress className={className} />;
  if (mark === "b") return <LogoShield className={className} />;
  return <ArsenalLogo className={cn("aspect-[480/92]", className)} />;
}

export function VariantsHub() {
  const [design, setDesign] = useState<Design>("premium");
  const [mark, setMark] = useState<Mark>("old");
  const current = DESIGNS.find((entry) => entry.id === design)!;

  return (
    <div data-wn className="min-h-dvh overflow-x-clip">
      <header className="border-b border-wn-line">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <ArsenalLogo className="aspect-[480/92] h-7 w-auto text-wn-ink sm:h-8" />
          <span className="ml-auto text-sm text-wn-muted">Макет сайта · DevUz</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:pt-14">
        <h1 className="wn-display max-w-4xl text-4xl sm:text-6xl">Arsenal D — выберите вариант сайта</h1>
        <p className="mt-4 max-w-2xl text-lg text-wn-ink-2">
          Два дизайна и три логотипа. Выберите сочетание и откройте сайт. Внутри работает конструктор: логотип, блоки и языки переключаются там же.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="min-w-0 space-y-8 lg:col-span-5">
            <fieldset className="min-w-0">
              <legend className="text-sm font-bold">1. Дизайн</legend>
              <div className="mt-3 grid gap-3">
                {DESIGNS.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    aria-pressed={design === entry.id}
                    onClick={() => setDesign(entry.id)}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-2xl p-4 text-left ring-1 transition-colors",
                      design === entry.id ? "bg-wn-card ring-2 ring-wn-ink" : "bg-wn-card/60 ring-wn-line hover:ring-wn-ink-2",
                    )}
                  >
                    <span className="mt-1 flex shrink-0 -space-x-1.5">
                      {entry.swatches.map((color) => (
                        <span key={color} className="h-5 w-5 rounded-full ring-2 ring-wn-card" style={{ background: color }} />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="wn-display block text-xl">{entry.name}</b>
                      <span className="mt-1 block text-sm text-wn-ink-2">{entry.text}</span>
                    </span>
                    <span className={cn("mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full", design === entry.id ? "bg-wn-ink text-wn-paper" : "ring-1 ring-wn-line")}>
                      {design === entry.id ? <Icon name="check" className="h-4 w-4" /> : null}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="min-w-0">
              <legend className="text-sm font-bold">2. Логотип</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {MARKS.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    aria-pressed={mark === entry.id}
                    onClick={() => setMark(entry.id)}
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl p-4 text-left ring-1 transition-colors",
                      mark === entry.id ? "bg-wn-card ring-2 ring-wn-ink" : "bg-wn-card/60 ring-wn-line hover:ring-wn-ink-2",
                    )}
                  >
                    <span className="flex h-10 items-center text-wn-ink">
                      <MarkPreview mark={entry.id} className="h-7 w-auto max-w-full" />
                    </span>
                    <span>
                      <b className="block text-sm">{entry.name}</b>
                      <span className="block text-xs text-wn-muted">{entry.text}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-2">
              <Link href={href(design, mark)} className="wn-btn min-h-14 text-lg">
                Открыть: {current.name}
                {mark === "old" ? "" : ` + логотип ${mark.toUpperCase()}`}
                <Icon name="arrow-right" className="h-5 w-5" />
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href={href(design, mark, "/domains")} className="wn-btn wn-btn-ghost min-h-12 text-sm">
                  Регистрация домена
                </Link>
                <Link href={href(design, mark, "/hosting")} className="wn-btn wn-btn-ghost min-h-12 text-sm">
                  Заказ хостинга
                </Link>
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Link href={href(design, mark)} className="group block overflow-hidden rounded-2xl bg-wn-card shadow-[0_30px_60px_-30px_rgb(17_27_59/0.5)] ring-1 ring-wn-line" aria-label={`Открыть: ${current.name}`}>
              <span className="flex items-center gap-2 border-b border-wn-line px-4 py-2.5">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className="wn-mono ml-2 min-w-0 truncate rounded-md bg-wn-paper-2 px-3 py-1 text-xs text-wn-ink-2">globalex.maximov-tech.ru{current.base}</span>
              </span>
              <span key={`${design}-${mark}`} className="wn-pop relative block aspect-[16/10] bg-wn-paper-2">
                <Image
                  src={`/images/webname/variants/${design}-${mark}.webp`}
                  alt={`Первый экран: ${current.name}, логотип ${MARKS.find((entry) => entry.id === mark)!.name}`}
                  fill
                  sizes="(min-width: 1024px) 56vw, 92vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transform-none"
                />
              </span>
            </Link>
          </div>
        </div>

        <section className="mt-20" aria-labelledby="all-variants">
          <h2 id="all-variants" className="wn-display text-3xl sm:text-4xl">
            Все сочетания
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DESIGNS.flatMap((entry) =>
              MARKS.map((logo) => (
                <li key={`${entry.id}-${logo.id}`}>
                  <Link href={href(entry.id, logo.id)} className="group block overflow-hidden rounded-2xl bg-wn-card ring-1 ring-wn-line transition-shadow hover:shadow-lg">
                    <span className="relative block aspect-[16/10] overflow-hidden">
                      <Image
                        src={`/images/webname/variants/${entry.id}-${logo.id}.webp`}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
                      />
                    </span>
                    <span className="flex items-center justify-between gap-3 px-4 py-3">
                      <span>
                        <b className="block">{entry.name}</b>
                        <span className="block text-xs text-wn-muted">Логотип: {logo.name}</span>
                      </span>
                      <Icon name="arrow-right" className="h-5 w-5 text-wn-stamp" />
                    </span>
                  </Link>
                </li>
              )),
            )}
          </ul>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-10 text-xs text-wn-muted sm:px-6">
        © Arsenal D. Макет — DevUz. Логотип, тарифы и контакты — с webname.uz; новые логотипы — предложение студии.
      </footer>
    </div>
  );
}

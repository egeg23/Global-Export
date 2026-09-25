"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import {
  IconBox,
  IconDrop,
  IconHeat,
  IconHerb,
  IconJar,
  IconLine,
  IconMeat,
  IconPallet,
  IconSort,
  IconTap,
  IconTime,
  IconVeg,
} from "@/components/foodmaxx/market/icons";
import { Shell } from "@/components/foodmaxx/ui/shell";
import { clients, stages } from "@/content/foodmaxx/company";
import { byShelf, products, shelves } from "@/content/foodmaxx/catalog";

/** Общий вход блока: лёгкий подъём, без теней и отскоков. */
function useRise(reduced: boolean) {
  return (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "0px 0px -10% 0px" },
          transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as const },
        };
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="mk-ribbon inline-block rounded-full px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
      {children}
    </span>
  );
}

/* ─────────────────────────── Что в банке ─────────────────────────── */

const INSIDE = [
  { Icon: IconVeg, title: "Овощи", note: "Огурцы, корнишоны, томаты, грибы, кабачки" },
  { Icon: IconMeat, title: "Мясо", note: "Говядина, баранина, конина, кролик" },
  { Icon: IconDrop, title: "Заливка", note: "Рассол и специи, без консервантов" },
  { Icon: IconJar, title: "Тара", note: "Стекло 1 л и жесть с ключом" },
];

export function WhatInside() {
  const reduced = useReducedMotion();
  const rise = useRise(!!reduced);

  return (
    <section id="sostav" className="bg-white py-16 lg:py-24">
      <Shell size="wide">
        <motion.div {...rise()} className="max-w-2xl">
          <Kicker>Что внутри</Kicker>
          <h2 className="mt-5 font-mk-display text-[1.9rem] font-700 leading-[1.1] text-mk-ink sm:text-4xl">
            В банке четыре вещи —<br />и ни одной лишней
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mk-ink-muted">
            Точные пропорции компания не публикует, поэтому здесь то, что она
            указывает сама: сырьё, заливка и тара.
          </p>
        </motion.div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INSIDE.map((item, i) => (
            <motion.li
              key={item.title}
              {...rise(i * 0.06)}
              className="rounded-mk border border-mk-line bg-mk-green-50 p-6 transition-colors duration-200 hover:border-mk-green-400"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-mk-green-600">
                <item.Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-mk-display text-lg font-600 text-mk-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mk-ink-muted">{item.note}</p>
            </motion.li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}

/* ──────────────────────────── Чек-лист ──────────────────────────── */

const CHECKS = [
  { title: "Без консервантов", note: "Банку держит пастеризация" },
  { title: "Своё производство", note: "Завод в Ташкентской области, не перекупка" },
  { title: "Сертификаты и халяль", note: "100% halal на этикетке, документы по запросу" },
  { title: "Стабильная рецептура", note: "Партия за партией один и тот же вкус" },
  { title: "Уже в сетях", note: "Korzinka, Uzum, Makro, bi1, Baraka, Ecobozor" },
  { title: "Три линейки сразу", note: "Овощи, мясо и готовые блюда от одного поставщика" },
];

export function Checklist() {
  const reduced = useReducedMotion();
  const rise = useRise(!!reduced);

  return (
    <section id="pochemu" className="bg-mk-green-50 py-16 lg:py-24">
      <Shell size="wide" className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <motion.div {...rise()} className="lg:col-span-5">
          <Kicker>Почему мы</Kicker>
          <h2 className="mt-5 font-mk-display text-[1.9rem] font-700 leading-[1.1] text-mk-ink sm:text-4xl">
            Шесть пунктов, по которым выбирают поставщика
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-mk-ink-muted">
            Сверьте с любым другим предложением на столе. Мы отвечаем «да» по
            каждому — и готовы показать документы.
          </p>
          <a
            href="#zayavka"
            className="mt-8 inline-block rounded-full bg-mk-orange-500 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mk-orange-600"
          >
            Запросить документы
          </a>
        </motion.div>

        <ul className="grid gap-3 lg:col-span-7">
          {CHECKS.map((check, i) => (
            <motion.li
              key={check.title}
              {...rise(i * 0.05)}
              className="flex items-start gap-4 rounded-mk bg-white px-5 py-4"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mk-green-500">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
                  <path
                    d="M5 10.5 8.5 14 15 6.5"
                    stroke="white"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h3 className="font-mk-display text-base font-600 text-mk-ink">{check.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-mk-ink-muted">{check.note}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}

/* ─────────────────────── Восемь шагов производства ─────────────────────── */

/** Иконки к восьми этапам — по порядку, в котором идёт сырьё. */
const STEP_ICONS = [
  IconPallet,
  IconTap,
  IconSort,
  IconTime,
  IconHerb,
  IconLine,
  IconHeat,
  IconBox,
];

export function HowWeMake() {
  const reduced = useReducedMotion();
  const rise = useRise(!!reduced);

  return (
    <section id="kak-delaem" className="bg-white py-16 lg:py-24">
      <Shell size="wide">
        <motion.div {...rise()} className="max-w-2xl">
          <Kicker>Производство</Kicker>
          <h2 className="mt-5 font-mk-display text-[1.9rem] font-700 leading-[1.1] text-mk-ink sm:text-4xl">
            Восемь шагов от поля до полки
          </h2>
        </motion.div>

        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, i) => {
            const Icon = STEP_ICONS[i] ?? IconBox;
            return (
            <motion.li
              key={stage.title}
              {...rise((i % 4) * 0.05)}
              className="relative rounded-mk border border-mk-line p-5 transition-colors duration-200 hover:border-mk-green-400"
            >
              <div className="flex items-center justify-between">
                <span className="font-mk-display text-3xl font-700 leading-none text-mk-green-200">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon className="h-6 w-6 text-mk-green-600" />
              </div>
              <h3 className="mt-4 font-mk-display text-base font-600 text-mk-ink">{stage.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mk-ink-muted">{stage.note}</p>
              </motion.li>
            );
          })}
        </ol>
      </Shell>
    </section>
  );
}

/* ──────────────────────────── Три полки ──────────────────────────── */

const COVER: Record<string, string> = {
  ovoshi: "jar-ogurcy",
  myaso: "myaso-byka",
  blyuda: "plov",
};

export function Shelves() {
  const reduced = useReducedMotion();
  const rise = useRise(!!reduced);
  const frame = useRef<HTMLDivElement>(null);
  const seen = useInView(frame, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <section id="polki" className="bg-mk-green-50 py-16 lg:py-24">
      <Shell size="wide">
        <motion.div {...rise()} className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Kicker>Каталог</Kicker>
            <h2 className="mt-5 font-mk-display text-[1.9rem] font-700 leading-[1.1] text-mk-ink sm:text-4xl">
              Три полки, {products.length} позиций
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mk-ink-muted">
            Спецификации с составом и весом пришлём вместе с прайсом — компания
            их не публикует, и выдумывать мы не стали.
          </p>
        </motion.div>

        <div ref={frame} className="mt-10 grid gap-4 lg:grid-cols-3">
          {shelves.map((shelf, i) => {
            const list = byShelf(shelf.id);
            return (
              <motion.article
                key={shelf.id}
                {...rise(i * 0.08)}
                className="overflow-hidden rounded-mk-lg bg-white"
              >
                <div className="relative flex h-56 items-center justify-center bg-mk-green-100 p-6">
                  <div aria-hidden="true" className="mk-halo absolute inset-6" />
                  <Image
                    src={`/foodmaxx/sets/${COVER[shelf.id]}.webp`}
                    alt=""
                    width={700}
                    height={900}
                    className="relative h-full w-auto object-contain"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold tabular-nums text-mk-green-700">
                    {seen ? list.length : 0} шт
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-mk-display text-lg font-700 text-mk-ink">{shelf.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mk-ink-muted">{shelf.note}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {list.slice(0, 4).map((item) => (
                      <li
                        key={item.slug}
                        className="rounded-full bg-mk-green-50 px-3 py-1 text-xs text-mk-green-700"
                      >
                        {item.name}
                      </li>
                    ))}
                    {list.length > 4 ? (
                      <li className="rounded-full px-2 py-1 text-xs text-mk-ink-subtle">
                        и ещё {list.length - 4}
                      </li>
                    ) : null}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Shell>
    </section>
  );
}

/* ──────────────────────────── Сети ──────────────────────────── */

export function Chains() {
  const reduced = useReducedMotion();
  const rise = useRise(!!reduced);

  return (
    <section className="bg-white py-14 lg:py-16">
      <Shell size="wide">
        <motion.p
          {...rise()}
          className="text-center font-mk-display text-lg font-600 text-mk-ink sm:text-xl"
        >
          Уже стоит на полке в шести сетях
        </motion.p>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {clients.map((client, i) => (
            <motion.li
              key={client.file}
              {...rise(i * 0.04)}
              className="flex h-20 items-center justify-center rounded-mk border border-mk-line px-4"
            >
              <Image
                src={`/foodmaxx/clients/${client.file}.webp`}
                alt={client.name}
                width={500}
                height={200}
                className="max-h-9 w-auto object-contain"
              />
            </motion.li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { PICK_EVENT } from "@/components/akbar/configurator";
import { Reveal } from "@/components/akbar/reveal";
import { useCalmMotion } from "@/lib/calm-motion";

/**
 * Допники сайта Akbar Rich — блоки, которые включает конструктор (док справа
 * внизу). Каждый нарисован на главной и работает: примерка берёт фото
 * с телефона, тур крутится, замер и рассрочка переносятся в заявку.
 *
 * Всё, чего у фабрики нет в открытом доступе (цены, заказы дилера, статьи),
 * — пример для макета, и так и подписано.
 */

function Head({ eyebrow, title, lead, dark }: { eyebrow: string; title: string; lead?: string; dark?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <Reveal>
        <p className={`ak-eyebrow ${dark ? "text-ak-gold-300" : "text-ak-gold-600"}`}>{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl font-ak-display text-5xl font-medium leading-[0.98] sm:text-6xl">{title}</h2>
      </Reveal>
      {lead ? (
        <p className={`max-w-sm text-base leading-relaxed ${dark ? "text-ak-ivory/65" : "text-ak-muted"}`}>{lead}</p>
      ) : null}
    </div>
  );
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toForm = (detail: string, calm: boolean) => {
  window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail }));
  document.getElementById("zayavka")?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
};

/* ------------------------------------------------------------------ */
/* Примерка двери на фото комнаты                                       */
/* ------------------------------------------------------------------ */

/** Полотно без фона — из их же рендера. Пропорции — 519 × 1357. */
const LEAF = "/akbar/hero/leaf.webp";

export function TryOn() {
  const stage = useRef<HTMLDivElement>(null);
  const grab = useRef<{ id: number; dx: number; dy: number } | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  // Точка — середина низа полотна, в процентах сцены: дверь стоит на полу.
  const [pos, setPos] = useState({ x: 50, y: 88 });
  const [size, setSize] = useState(70);

  useEffect(() => () => (photo ? URL.revokeObjectURL(photo) : undefined), [photo]);

  const at = (event: React.PointerEvent) => {
    const rect = stage.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 };
  };

  const onDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    const point = at(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    grab.current = { id: event.pointerId, dx: point.x - pos.x, dy: point.y - pos.y };
  };

  const onMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (grab.current?.id !== event.pointerId) return;
    const point = at(event);
    if (!point) return;
    const { dx, dy } = grab.current;
    setPos({ x: clamp(point.x - dx, 4, 96), y: clamp(point.y - dy, 25, 100) });
  };

  const onKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const step: Record<string, [number, number]> = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] };
    const move = step[event.key];
    if (!move) return;
    event.preventDefault();
    setPos((value) => ({ x: clamp(value.x + move[0], 4, 96), y: clamp(value.y + move[1], 25, 100) }));
  };

  return (
    <section id="primerka" className="scroll-mt-16 bg-ak-cream px-4 py-20 sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="mx-auto max-w-[100rem]">
        <Head
          eyebrow="Примерка"
          title="Посмотрите дверь у себя дома"
          lead="Сфотографируйте проём — дверь встанет поверх. Тяните её пальцем и подгоняйте по высоте. Фото никуда не уходит: примерка идёт прямо в телефоне."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-14">
          <div
            ref={stage}
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ak-wall sm:aspect-[4/3]"
          >
            {photo ? (
              <Image src={photo} alt="Ваше фото проёма" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            ) : (
              <>
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,#ede8e5_0%,#e3dcd5_88%,#c9b8a2_88%,#b39d83_100%)]" />
                <div aria-hidden="true" className="absolute inset-x-0 top-[86.5%] h-[1.5%] bg-[#f7f2ea]" />
              </>
            )}
            <button
              type="button"
              aria-label="Дверь: тяните, чтобы поставить в проём; стрелками — сдвинуть"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={() => (grab.current = null)}
              onPointerCancel={() => (grab.current = null)}
              onKeyDown={onKey}
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, height: `${size}%`, aspectRatio: "519 / 1357" }}
              className="absolute -translate-x-1/2 -translate-y-full cursor-grab touch-none drop-shadow-[0_18px_22px_rgb(22_18_14/0.35)] active:cursor-grabbing"
            >
              <Image src={LEAF} alt="" fill sizes="30vw" className="pointer-events-none select-none object-contain" draggable={false} />
            </button>
            {!photo ? (
              <span className="ak-glass absolute left-4 top-4 rounded-full px-4 py-2 text-xs font-semibold sm:left-6 sm:top-6">
                Пример — загрузите своё фото
              </span>
            ) : null}
          </div>

          <div className="grid content-start gap-8">
            <label className="ak-btn ak-btn-ink w-full cursor-pointer">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              {photo ? "Другое фото" : "Загрузить фото проёма"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setPhoto(URL.createObjectURL(file));
                  event.target.value = "";
                }}
              />
            </label>

            <label className="grid gap-3">
              <span className="flex items-baseline justify-between gap-4">
                <span className="ak-eyebrow text-ak-muted">Высота двери на фото</span>
                <span className="text-xs text-ak-muted tabular-nums">{size}%</span>
              </span>
              <input
                type="range"
                min={30}
                max={96}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="h-11 w-full accent-[var(--color-ak-gold-600)]"
              />
            </label>

            <ol className="grid gap-3 text-sm leading-relaxed text-ak-muted">
              <li>1. Встаньте напротив проёма, телефон — на уровне груди.</li>
              <li>2. Поставьте дверь в проём и подгоните высоту ползунком.</li>
              <li>3. Понравилось — соберите её в конструкторе и отправьте менеджеру.</li>
            </ol>

            {photo ? (
              <button type="button" onClick={() => setPhoto(null)} className="ak-btn ak-btn-line w-full">
                Вернуть пример
              </button>
            ) : null}
            <p className="text-xs text-ak-muted">На сайте — все модели фабрики: полотна вырезаем из ваших же рендеров.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Тур 360° по шоуруму                                                  */
/* ------------------------------------------------------------------ */

type Spot = { x: number; y: number; label: string; href: string };

const SCENES: { src: string; alt: string; spots: Spot[] }[] = [
  {
    src: "/akbar/hero/modern.webp",
    alt: "Классический зал: дверь с патиной, стеновые панели и порталы с полками",
    spots: [
      { x: 0.08, y: 0.62, label: "Стеновые панели", href: "/akbar/katalog/paneli-eksklyuziv" },
      { x: 0.665, y: 0.55, label: "Классика с патиной", href: "/akbar/katalog/eksklyuziv" },
      { x: 0.86, y: 0.3, label: "Проёмы и порталы", href: "/akbar/katalog/proemy-eksklyuziv" },
    ],
  },
  {
    src: "/akbar/hero/room.webp",
    alt: "Современный зал: двери в ясене до потолка и мебель с фасадами фабрики",
    spots: [
      { x: 0.21, y: 0.42, label: "Двери до 3 метров", href: "/akbar/katalog/tri-metra" },
      { x: 0.47, y: 0.8, label: "Мебельные створки", href: "/akbar/katalog#cat-6" },
    ],
  },
];

export function Tour() {
  const calm = useCalmMotion();
  const stage = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; offset: number; moved: boolean } | null>(null);
  const [range, setRange] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (stage.current && strip.current) setRange(Math.max(0, strip.current.scrollWidth - stage.current.clientWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  const nudge = (step: number) => setOffset((value) => clamp(value + step, 0, 1));

  const onDown = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { id: event.pointerId, x: event.clientX, offset, moved: false };
  };

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.id !== event.pointerId || !range) return;
    const dx = event.clientX - state.x;
    // Захват — только когда палец уже повёл: простое нажатие на метку
    // остаётся нажатием на ссылку.
    if (!state.moved && Math.abs(dx) > 6) {
      state.moved = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (state.moved) setOffset(clamp(state.offset - dx / range, 0, 1));
  };

  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <section id="tur" className="scroll-mt-16 overflow-hidden bg-ak-ink py-20 text-ak-ivory lg:py-28">
      <div className="mx-auto max-w-[100rem] px-4 sm:px-8 lg:px-[4vw]">
        <Head
          dark
          eyebrow="Тур 360°"
          title="Шоурум — не выходя из дома"
          lead="Тяните панораму в сторону и нажимайте на метки: каждая ведёт в свой раздел каталога."
        />
      </div>

      <div className="mx-auto mt-12 max-w-[100rem] px-4 sm:px-8 lg:px-[4vw]">
        <div
          ref={stage}
          role="region"
          aria-label="Панорама шоурума. Стрелки влево и вправо поворачивают"
          tabIndex={0}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") nudge(-0.1);
            if (event.key === "ArrowRight") nudge(0.1);
          }}
          className={`relative h-[62svh] max-h-[44rem] min-h-[22rem] touch-pan-y select-none overflow-hidden rounded-[2rem] bg-ak-ink-2 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          <div
            ref={strip}
            className={`flex h-full w-max ${dragging || calm ? "" : "transition-transform duration-700 ease-[var(--ease-ak)]"}`}
            style={{ transform: `translate3d(${-offset * range}px, 0, 0)` }}
          >
            {SCENES.map((scene) => (
              <div key={scene.src} className="relative aspect-[16/9] h-full shrink-0">
                <Image src={scene.src} alt={scene.alt} fill sizes="(min-width: 1024px) 120vw, 220vw" className="pointer-events-none object-cover" draggable={false} />
                {scene.spots.map((spot) => (
                  <Link
                    key={spot.label}
                    href={spot.href}
                    draggable={false}
                    style={{ left: `${spot.x * 100}%`, top: `${spot.y * 100}%` }}
                    className="group absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
                  >
                    <span className="relative grid h-9 w-9 place-items-center">
                      <span className="absolute inset-0 rounded-full bg-ak-gold-300/40 motion-safe:animate-ping" />
                      <span className="relative h-3.5 w-3.5 rounded-full bg-ak-gold-300 ring-4 ring-ak-ink/30" />
                    </span>
                    <span className="ak-glass-dark whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-ak-ivory group-hover:text-ak-gold-300">
                      {spot.label}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
            <span className="ak-glass-dark rounded-full px-4 py-2 text-xs font-semibold text-ak-ivory/85">← тяните, чтобы осмотреться →</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-xl text-sm text-ak-ivory/60">
            На макете — рендеры фабрики. Для сайта снимем панораму в шоуруме: Малая кольцевая дорога, 24.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => nudge(-0.25)} aria-label="Повернуть влево" className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-ak-ivory/25 hover:ring-ak-gold-300">
              ←
            </button>
            <button type="button" onClick={() => nudge(0.25)} aria-label="Повернуть вправо" className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-ak-ivory/25 hover:ring-ak-gold-300">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Кабинет дилера                                                       */
/* ------------------------------------------------------------------ */

const TONE: Record<string, string> = {
  "В производстве": "bg-ak-gold-300/25 text-ak-gold-600",
  "Готов к отгрузке": "bg-[#2f7d4f]/15 text-[#22603c]",
  Отгружен: "bg-ak-ink/10 text-ak-muted",
};

export function DealerCabinet({ models }: { models: string[] }) {
  const [tab, setTab] = useState<"orders" | "stock">("orders");
  const name = (index: number) => models[index % Math.max(1, models.length)] ?? "Модель";
  const orders = [
    { n: "2417", item: `${name(0)} · 2 м`, qty: 6, status: "В производстве", when: "к 10.10" },
    { n: "2416", item: `${name(1)} · 2,4 м`, qty: 12, status: "Готов к отгрузке", when: "сегодня" },
    { n: "2409", item: `${name(2)} · 2,7 м`, qty: 3, status: "Отгружен", when: "30.09" },
  ];
  const stock = [48, 12, 0, 26].map((qty, index) => ({ item: name(index), qty }));

  return (
    <section id="kabinet" className="scroll-mt-16 bg-ak-ivory px-4 py-20 sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="mx-auto max-w-[100rem]">
        <Head
          eyebrow="Дилерам"
          title="Кабинет дилера"
          lead="Заказы, статусы и остатки — у дилера в телефоне. Фабрике меньше звонков «где мой заказ», дилеру — быстрее ответ покупателю."
        />

        <Reveal className="mt-12 overflow-hidden rounded-[2rem] bg-ak-wall shadow-[0_30px_60px_-30px_rgb(22_18_14/0.45)] ring-1 ring-ak-ink/10">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-ak-ink px-5 py-4 text-ak-ivory sm:px-7">
            <div>
              <p className="ak-eyebrow text-ak-gold-300">Кабинет дилера</p>
              <p className="mt-1 font-ak-display text-2xl font-medium">Дилер № 14 · Самарканд</p>
            </div>
            <div role="tablist" aria-label="Разделы кабинета" className="flex gap-1.5">
              {(
                [
                  ["orders", "Заказы"],
                  ["stock", "Остатки"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors ${
                    tab === id ? "bg-ak-gold text-ak-ink" : "text-ak-ivory/70 ring-1 ring-ak-ivory/20 hover:text-ak-ivory"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-7">
            {tab === "orders" ? (
              <ul className="grid gap-3">
                {orders.map((order) => (
                  <li key={order.n} className="grid gap-2 rounded-2xl bg-ak-ivory p-4 sm:grid-cols-[6rem_minmax(0,1fr)_5rem_11rem_6rem] sm:items-center sm:gap-4">
                    <span className="text-xs text-ak-muted">№ {order.n}</span>
                    <span className="font-semibold">{order.item}</span>
                    <span className="text-sm text-ak-muted tabular-nums">× {order.qty}</span>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${TONE[order.status]}`}>{order.status}</span>
                    <span className="text-sm text-ak-muted">{order.when}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {stock.map((row) => (
                  <li key={row.item} className="flex items-center justify-between gap-4 rounded-2xl bg-ak-ivory p-4">
                    <span className="font-semibold">{row.item}</span>
                    <span className={`text-sm tabular-nums ${row.qty ? "text-ak-ink" : "text-ak-gold-600"}`}>
                      {row.qty ? `${row.qty} шт. на складе` : "под заказ"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-ak-muted">Данные условные. На сайте — заказы и склад фабрики, цены дилера — его собственные.</p>
              <button type="button" className="ak-btn ak-btn-ink min-h-12">
                Новый заказ
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Журнал                                                               */
/* ------------------------------------------------------------------ */

const POSTS = [
  { cover: "/akbar/c/sub-9.webp", tag: "Выбор", title: "Эмаль, ясень или орех: что выбрать в квартиру с детьми", minutes: 6 },
  { cover: "/akbar/c/sub-7.webp", tag: "Ремонт", title: "Дверь до потолка: какой проём нужен под трёхметровое полотно", minutes: 5 },
  { cover: "/akbar/c/sub-6.webp", tag: "Ремонт", title: "Скрытая дверь: что решить до ремонта, а не после", minutes: 4 },
];

export function Journal() {
  return (
    <section id="zhurnal" className="scroll-mt-16 bg-ak-cream px-4 py-20 sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="mx-auto max-w-[100rem]">
        <Head
          eyebrow="Журнал"
          title="Отвечаем на вопросы до того, как их зададут"
          lead="Статьи на русском и узбекском под то, что люди ищут перед ремонтом. Приводят покупателей из поиска и экономят время менеджеров."
        />
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {POSTS.map((post, index) => (
            <Reveal as="li" key={post.title} delay={index * 80}>
              <article>
                <span className="relative block aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-ak-wall-2">
                  <Image src={post.cover} alt="" fill sizes="(min-width: 768px) 32vw, 100vw" className="object-cover" />
                </span>
                <p className="mt-4 flex gap-3 text-xs text-ak-muted">
                  <span className="font-semibold text-ak-gold-600">{post.tag}</span>
                  <span>RU · UZ</span>
                  <span>{post.minutes} мин</span>
                </p>
                <h3 className="mt-2 font-ak-display text-3xl font-medium leading-tight">{post.title}</h3>
              </article>
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 text-xs text-ak-muted">Три темы на старт — пример. Статьи пишет SEO-подписка студии.</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Запись на замер                                                      */
/* ------------------------------------------------------------------ */

const SLOTS = ["10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00"];

const noop = () => () => {};
const dayFormat = new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

/** Шесть дней со следующего, без воскресений. Считается в браузере — у сервера нет «сегодня» покупателя. */
function nextDays(today: string) {
  const days: { key: string; label: string }[] = [];
  const start = Date.parse(`${today}T00:00:00Z`);
  for (let shift = 1; days.length < 6 && shift < 10; shift += 1) {
    const day = new Date(start + shift * 86_400_000);
    if (day.getUTCDay() === 0) continue;
    days.push({ key: day.toISOString().slice(0, 10), label: dayFormat.format(day) });
  }
  return days;
}

export function Measure() {
  const calm = useCalmMotion();
  const today = useSyncExternalStore(noop, () => new Date().toISOString().slice(0, 10), () => "");
  const days = useMemo(() => (today ? nextDays(today) : []), [today]);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const chosen = days.find((entry) => entry.key === day);

  const chip = (active: boolean) =>
    `min-h-12 rounded-full border px-4 text-sm font-semibold transition-colors ${
      active ? "border-ak-ink bg-ak-ink text-ak-ivory" : "border-ak-ink/25 hover:border-ak-ink"
    }`;

  return (
    <section id="zamer" className="scroll-mt-16 bg-ak-ivory px-4 py-20 sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="mx-auto grid max-w-[100rem] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal>
          <p className="ak-eyebrow text-ak-gold-600">Замер</p>
          <h2 className="mt-4 font-ak-display text-5xl font-medium leading-[0.98] sm:text-6xl">Замерщик приедет, когда удобно вам</h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ak-muted">
            Измерит проёмы, подскажет высоту полотна и коробку и привезёт образцы покрытий. Выберите день и время — менеджер
            подтвердит звонком.
          </p>
        </Reveal>

        <div className="grid content-start gap-8">
          <fieldset className="min-w-0">
            <legend className="ak-eyebrow text-ak-muted">День</legend>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {days.length
                ? days.map((entry) => (
                    <button key={entry.key} type="button" aria-pressed={day === entry.key} onClick={() => setDay(entry.key)} className={chip(day === entry.key)}>
                      {entry.label}
                    </button>
                  ))
                : Array.from({ length: 6 }, (_, index) => <span key={index} className="h-12 w-28 rounded-full bg-ak-wall" />)}
            </div>
          </fieldset>
          <fieldset className="min-w-0">
            <legend className="ak-eyebrow text-ak-muted">Время</legend>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {SLOTS.map((entry) => (
                <button key={entry} type="button" aria-pressed={slot === entry} onClick={() => setSlot(entry)} className={chip(slot === entry)}>
                  {entry}
                </button>
              ))}
            </div>
          </fieldset>
          <button
            type="button"
            disabled={!chosen || !slot}
            onClick={() => chosen && slot && toForm(`Замер: ${chosen.label}, ${slot}`, calm)}
            className="ak-btn ak-btn-gold w-full disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:justify-self-start"
          >
            {chosen && slot ? `Записаться: ${chosen.label}, ${slot}` : "Выберите день и время"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Предоплата онлайн                                                    */
/* ------------------------------------------------------------------ */

const METHODS = [
  { id: "payme", label: "Payme", tone: "bg-[#33cccc] text-[#0d2b2b]" },
  { id: "click", label: "Click", tone: "bg-[#0066ff] text-white" },
  { id: "uzum", label: "Uzum", tone: "bg-[#7000ff] text-white" },
];

export function Prepay() {
  const [method, setMethod] = useState<string | null>(null);
  const picked = METHODS.find((entry) => entry.id === method);
  return (
    <section id="oplata" className="scroll-mt-16 bg-ak-ivory px-4 pb-20 sm:px-8 lg:px-[4vw] lg:pb-28">
      <div className="mx-auto grid max-w-[100rem] gap-6 rounded-[2rem] bg-ak-cream p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12 lg:p-10">
        <div>
          <p className="ak-eyebrow text-ak-gold-600">Предоплата онлайн</p>
          <p className="mt-3 font-ak-display text-3xl font-medium leading-tight sm:text-4xl">
            Заказ № 2417 · предоплата 30% — <span className="whitespace-nowrap tabular-nums">1 236 000 сум</span>
          </p>
          <p className="mt-2 text-sm text-ak-muted" aria-live="polite">
            {picked
              ? `Демо: на сайте здесь откроется ${picked.label} с суммой и номером заказа, а оплата сразу появится у менеджера.`
              : "Менеджер присылает ссылку — покупатель платит с телефона, без поездки в шоурум и банк. Сумма и заказ — для примера."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {METHODS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={method === entry.id}
              onClick={() => setMethod(entry.id)}
              className={`min-h-12 min-w-24 rounded-full px-5 text-sm font-bold transition-transform hover:-translate-y-0.5 ${entry.tone} ${
                method === entry.id ? "ring-2 ring-ak-ink ring-offset-2 ring-offset-ak-cream" : ""
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

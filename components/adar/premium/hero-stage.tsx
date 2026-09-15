"use client";

import { useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { ChocoField } from "@/components/adar/premium/choco-field";
import { Shell } from "@/components/adar/ui/shell";
import { bannerSlides } from "@/content/adar/banner";
import { sets } from "@/content/adar/catalog";
import { contentsOf, priceRange } from "@/lib/adar/catalog";
import { formatNumber } from "@/lib/adar/format";
import { cn } from "@/lib/cn";

/** Сколько подписей встаёт в кольцо вокруг набора на большом экране. */
const RING = 7;
/** И сколько помещается столбцом на телефоне. */
const COLUMN = 6;

/**
 * «Плитка «MERCI»» → «MERCI». В кольце важна марка, а не то, плитка это или
 * батончик: подпись должна читаться на лету.
 */
function brandOf(name: string) {
  return name.match(/«([^»]+)»/)?.[1] ?? name;
}

function grams(value: number) {
  return `${String(value).replace(".", ",")} г`;
}

/** Три главы первого экрана. Считаются при сборке, а не в браузере. */
const chapters = bannerSlides.map((slide) => {
  const set = sets.find((item) => item.slug === slide.set) ?? sets[sets.length - 1];
  const seen = new Set<string>();
  const parts = contentsOf(set)
    .map((part) => ({ label: brandOf(part.name), grams: part.grams }))
    .filter((part) => part.label.length <= 24 && !seen.has(part.label) && seen.add(part.label))
    .sort((a, b) => b.grams - a.grams)
    .slice(0, RING);
  return { slide, set, parts };
});

/** Снимки, из которых нарезается и фон, и сами наборы. */
const sources = chapters.map((chapter) => chapter.set.image);

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Первый экран — сцена, а не обложка.
 *
 * Фона-фотографии здесь нет: на тёмном лежит поле настоящих шоколадок,
 * нарезанных из снимков наборов. Прокрутка ведёт по трём главам, и в начале
 * каждой часть этих шоколадок слетается в середину и складывается в
 * коробку. Дальше коробка разбирается: кадр гаснет, вокруг неё встают
 * подписи состава — что внутри и по сколько граммов, — и к концу главы всё
 * разлетается обратно в поле.
 *
 * Прокрутку никто не перехватывает: страница едет как обычно, просто кадр
 * держится на месте, пока идёт сценарий.
 */
export function HeroStage() {
  const outer = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  /**
   * Сценарий едет не за колесом, а за пружиной: колесо даёт рывками, и на
   * тачпаде с инерцией это видно на каждой подписи. Затухание выше
   * критического (ζ ≈ 2,4), поэтому пружина не перелетает цель — только
   * догоняет её, примерно за полсекунды.
   */
  const eased = useSpring(scrollYProgress, {
    stiffness: 58,
    damping: 24,
    mass: 0.35,
    restDelta: 0.0002,
  });
  const flow = reduced ? scrollYProgress : eased;
  /** 0…3 — сквозная позиция по главам. */
  const timeline = useTransform(flow, (value) => value * chapters.length);
  /** 0…1 — положение внутри текущей главы. */
  const q = useTransform(timeline, (value) => clamp(value - activeRef.current));

  useMotionValueEvent(timeline, "change", (value) => {
    const next = Math.min(chapters.length - 1, Math.max(0, Math.floor(value)));
    if (next === activeRef.current) return;
    activeRef.current = next;
    setActive(next);
  });

  const hint = useTransform(timeline, [0, 0.22], [1, 0]);
  const rail = useTransform(flow, [0, 1], ["0%", "100%"]);

  const goTo = useCallback((index: number) => {
    const element = outer.current;
    if (!element) return;
    const step = element.offsetHeight / chapters.length;
    window.scrollTo({ top: element.offsetTop + step * (index + 0.22), behavior: "smooth" });
  }, []);

  return (
    <section
      ref={outer}
      aria-label="Главный экран"
      className={cn(
        "relative -mt-52 bg-adar-green-950 lg:-mt-[8.75rem]",
        reduced ? "" : "h-[300svh] lg:h-[340svh]",
      )}
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <ChocoField
          sources={sources}
          active={active}
          progress={q}
          timeline={timeline}
          boxRef={box}
          reduced={!!reduced}
        />

        {/* Низ кадра держим тёмным — под текстом поле не должно рябить, —
            и подтемняем верх, чтобы шапка читалась поверх шоколада */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-adar-green-950 from-18% via-adar-green-950/55 via-52% to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[26vh] bg-gradient-to-b from-adar-green-950 via-adar-green-950/70 to-transparent"
        />
        <div aria-hidden="true" className="adar-glow pointer-events-none absolute inset-x-0 top-0 h-[70vh]" />

        <Act
          key={active}
          index={active}
          chapter={chapters[active]}
          q={q}
          boxRef={box}
          reduced={!!reduced}
        />

        {/* Счётчик глав */}
        <Shell size="wide" className="pointer-events-none absolute inset-x-0 top-0 pt-52 lg:pt-36">
          <p className="font-adar-display text-base tracking-[0.35em] text-adar-cream-50/60">
            <span className="text-adar-gold-300">0{active + 1}</span>
            <span className="mx-1 text-adar-cream-50/55">/</span>0{chapters.length}
          </p>
        </Shell>

        {/* Переход по главам */}
        <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-4 lg:right-8 lg:flex">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.set.slug}
              type="button"
              onClick={() => goTo(index)}
              aria-current={index === active}
              className={cn(
                "group flex cursor-pointer items-center gap-3 text-[0.7rem] tracking-[0.2em] transition-colors",
                index === active
                  ? "text-adar-gold-300"
                  : "text-adar-cream-50/60 hover:text-adar-cream-50",
              )}
            >
              <span className="hidden max-w-[11rem] text-right uppercase leading-tight xl:block">
                {chapter.slide.eyebrow}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "h-px transition-all duration-500",
                  index === active
                    ? "w-10 bg-adar-gold-400"
                    : "w-5 bg-adar-cream-50/35 group-hover:w-8",
                )}
              />
              <span className="tabular-nums">0{index + 1}</span>
            </button>
          ))}
        </div>

        {/* Подсказка «листайте» — только в самом начале */}
        <motion.div
          aria-hidden="true"
          style={reduced ? undefined : { opacity: hint }}
          className="pointer-events-none absolute bottom-6 right-24 hidden lg:block"
        >
          <span className="flex flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-adar-cream-50/55">
            Листайте
            <span className="adar-scroll-line block h-7 w-px bg-adar-cream-50/25" />
          </span>
        </motion.div>

        {/* Общий ход сценария */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/10">
          <motion.span
            style={reduced ? undefined : { width: rail }}
            className="block h-px bg-adar-gold-500/80"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Одна глава. Сам набор рисует канва — здесь остаются подписи состава,
 * которые встают вокруг него, и текст главы.
 */
function Act({
  index,
  chapter,
  q,
  boxRef,
  reduced,
}: {
  index: number;
  chapter: (typeof chapters)[number];
  q: MotionValue<number>;
  boxRef: React.RefObject<HTMLDivElement | null>;
  reduced: boolean;
}) {
  const { slide, set, parts } = chapter;
  /** Последняя глава ничего не отпускает: ею экран и заканчивается. */
  const last = index === chapters.length - 1;

  // Радиус кольца берётся из настоящего размера коробки: подписи разлетаются
  // в пикселях, а не в процентах от собственной ширины.
  const [half, setHalf] = useState(0);
  const measure = useCallback(
    (node: HTMLDivElement | null) => {
      boxRef.current = node;
      if (node) setHalf(node.getBoundingClientRect().width / 2);
    },
    [boxRef],
  );

  // Заголовок уступает место разбору и не возвращается: следом идёт
  // следующая глава со своим заголовком.
  const textY = useTransform(q, [0, 0.5], [0, -18]);
  const textOpacity = useTransform(q, [0, 0.4, 0.5], [1, 1, 0]);
  const breakdown = useTransform(
    q,
    last ? [0.46, 0.56, 1, 1] : [0.46, 0.56, 0.84, 0.92],
    [0, 1, 1, last ? 1 : 0],
  );

  const ringOpacity = useTransform(
    q,
    last ? [0.44, 0.56, 1, 1] : [0.44, 0.56, 0.84, 0.92],
    [0, 1, 1, last ? 1 : 0],
  );
  const ringSpin = useTransform(q, [0.44, 1], [-22, 12]);

  return (
    <>
      {/* Пустая коробка: по ней канва знает, куда сажать набор, и вокруг неё
          встают подписи состава. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-[34vh] pt-52 lg:pb-[16vh] lg:pt-24">
        <div
          ref={measure}
          className="relative aspect-square w-[min(58vw,14rem)] lg:w-[min(38vh,34rem)]"
        >
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            style={reduced ? undefined : { opacity: ringOpacity, rotate: ringSpin }}
            className="absolute left-1/2 top-1/2 hidden h-[152%] w-[152%] -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="var(--color-adar-gold-500)"
              strokeWidth="0.22"
              strokeDasharray="0.6 2.6"
              opacity="0.75"
            />
          </motion.svg>

          {half > 0
            ? parts.map((part, order) => (
                <RingLabel
                  key={part.label}
                  order={order}
                  part={part}
                  q={q}
                  half={half}
                  last={last}
                  reduced={reduced}
                />
              ))
            : null}
        </div>
      </div>

      {/* Текст главы и подпись разбора — в одном месте, по очереди */}
      <Shell size="wide" className="relative mt-auto pb-14 lg:pb-12">
        <div className="relative min-h-[12rem] lg:min-h-[13rem] 2xl:min-h-[15rem]">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 bottom-0 max-w-xl lg:max-w-[42%]"
          >
            <motion.div style={reduced ? undefined : { y: textY, opacity: textOpacity }}>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-adar-gold-300">
                {slide.eyebrow}
              </p>
              <h1 className="mt-4 text-balance font-adar-display text-[2.2rem] leading-[1] text-adar-cream-50 sm:text-5xl xl:text-[3.4rem] 2xl:text-[4.2rem]">
                {slide.title} <span className="adar-gold-text">{slide.accent}</span>
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-adar-cream-50/75 2xl:max-w-lg 2xl:text-lg">
                {slide.note}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            style={reduced ? undefined : { opacity: breakdown }}
            className="absolute inset-x-0 bottom-0 lg:max-w-[46%]"
          >
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-adar-gold-300">
              Что внутри
            </p>
            <p className="mt-4 font-adar-display text-3xl leading-tight text-adar-cream-50 sm:text-4xl 2xl:text-5xl">
              {set.name}
            </p>
            <p className="mt-2 text-sm text-adar-cream-50/70">
              {set.count} наименований · {formatNumber(set.weight)} г ·{" "}
              {formatNumber(set.price)} сум
            </p>

            {/* На телефоне состав идёт столбцами: кольцо туда не поместится */}
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-1 lg:hidden">
              {parts.slice(0, COLUMN).map((part, order) => (
                <ColumnLabel key={part.label} order={order} part={part} q={q} reduced={reduced} />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#katalog"
            className="rounded-full bg-adar-gold-500 px-7 py-3.5 text-sm font-medium text-adar-green-950 transition-colors duration-300 hover:bg-adar-gold-400"
          >
            Смотреть каталог
          </a>
          <a
            href="#korporativnym"
            className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-adar-cream-50 transition-colors duration-300 hover:border-adar-gold-500/70 hover:text-adar-gold-300"
          >
            Расчёт партии
          </a>
        </div>

        <p className="mt-5 hidden text-xs text-adar-cream-50/55 lg:block">
          {sets.length} готовых наборов от {formatNumber(priceRange.min)} сум · 100+ видов упаковки ·
          сборка по вашему списку
        </p>
      </Shell>

      <p aria-live="polite" className="sr-only">
        Глава {index + 1} из {chapters.length}: {slide.title} {slide.accent}. Набор {set.name},{" "}
        {set.count} наименований, {formatNumber(set.weight)} г.
      </p>
    </>
  );
}

/** Подпись на кольце: вылетает из-под набора на своё место. */
function RingLabel({
  order,
  part,
  q,
  half,
  last,
  reduced,
}: {
  order: number;
  part: { label: string; grams: number };
  q: MotionValue<number>;
  half: number;
  /** В последней главе подписи не убираются. */
  last: boolean;
  reduced: boolean;
}) {
  // Подписи раскрываются веером вверх и вправо: нижний левый угол оставлен
  // названию набора, и кольцо туда не лезет.
  const angle = (-150 + (210 / (RING - 1)) * order) * (Math.PI / 180);
  // Через одну подписи стоят дальше — иначе соседние плашки наезжают.
  const reach = half * (order % 2 ? 1.74 : 1.42);
  const x = Math.cos(angle) * reach;
  const y = Math.sin(angle) * reach;

  const start = 0.46 + order * 0.016;
  const opacity = useTransform(
    q,
    last ? [start, start + 0.09, 1, 1] : [start, start + 0.09, 0.84, 0.91],
    [0, 1, 1, last ? 1 : 0],
  );
  const travel = useTransform(q, [start, start + 0.13], [0.22, 1]);
  const tx = useTransform(travel, (value) => x * value);
  const ty = useTransform(travel, (value) => y * value);

  return (
    <motion.span
      style={reduced ? undefined : { opacity, x: tx, y: ty }}
      className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-adar-gold-500/30 bg-adar-green-950/80 px-3 py-1.5 backdrop-blur-sm lg:flex"
    >
      <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-adar-gold-400" />
      <span className="text-[0.66rem] uppercase tracking-[0.12em] text-adar-cream-50">
        {part.label}
      </span>
      <span className="text-[0.66rem] tabular-nums text-adar-gold-300">{grams(part.grams)}</span>
    </motion.span>
  );
}

/** Та же подпись на телефоне — строкой в два столбца. */
function ColumnLabel({
  order,
  part,
  q,
  reduced,
}: {
  order: number;
  part: { label: string; grams: number };
  q: MotionValue<number>;
  reduced: boolean;
}) {
  const start = 0.5 + order * 0.022;
  const opacity = useTransform(q, [start, start + 0.08], [0, 1]);
  const x = useTransform(q, [start, start + 0.1], [-12, 0]);

  return (
    <motion.span
      style={reduced ? undefined : { opacity, x }}
      className="flex items-baseline gap-2 text-[0.7rem] leading-relaxed"
    >
      <span className="truncate uppercase tracking-[0.08em] text-adar-cream-50/90">
        {part.label}
      </span>
      <span className="ml-auto shrink-0 tabular-nums text-adar-gold-300">{grams(part.grams)}</span>
    </motion.span>
  );
}

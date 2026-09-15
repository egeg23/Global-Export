"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { AssemblingSet } from "@/components/adar/premium/assembling-set";
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

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Первый экран — сцена, а не обложка.
 *
 * Кадр закрепляется на весь экран, и прокрутка ведёт по трём главам. В
 * каждой набор собирается из плиток, держит паузу, а потом разбирается:
 * заголовок уходит, кадр темнеет, и вокруг набора встаёт кольцо с составом —
 * что лежит внутри и по сколько граммов. Потом всё собирается обратно и
 * начинается следующая глава.
 *
 * Прокрутку никто не перехватывает: страница едет как обычно, просто кадр
 * держится на месте, пока идёт сценарий. Кнопки каталога и расчёта партии
 * стоят на экране всё это время — сценарий не должен мешать заказать.
 */
export function HeroStage() {
  const outer = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  /** 0…3 — сквозная позиция по главам. */
  const timeline = useTransform(scrollYProgress, (value) => value * chapters.length);

  useMotionValueEvent(timeline, "change", (value) => {
    const next = Math.min(chapters.length - 1, Math.max(0, Math.floor(value)));
    setActive((current) => (current === next ? current : next));
  });

  const hint = useTransform(timeline, [0, 0.22], [1, 0]);
  const rail = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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
        {chapters.map((chapter, index) => (
          <Backdrop
            key={chapter.slide.photo}
            index={index}
            photo={chapter.slide.photo}
            timeline={timeline}
          />
        ))}

        {/* Затемнение: низ держим, верх отпускаем — ради красочности кадра */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-adar-green-950 from-20% via-adar-green-950/70 via-58% to-adar-green-950/35"
        />
        <div aria-hidden="true" className="adar-glow absolute inset-x-0 top-0 -z-10 h-[70vh]" />

        <Act
          key={active}
          index={active}
          chapter={chapters[active]}
          timeline={timeline}
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
          <span className="flex flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-adar-cream-50/50">
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

/** Фотография главы: проявляется к своей главе и уезжает из неё. */
function Backdrop({
  index,
  photo,
  timeline,
}: {
  index: number;
  photo: string;
  timeline: MotionValue<number>;
}) {
  const opacity = useTransform(
    timeline,
    [index - 0.4, index + 0.08, index + 0.92, index + 1.4],
    [0, 1, 1, 0],
  );
  const scale = useTransform(timeline, [index - 0.4, index + 1.4], [1.14, 1]);

  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0 -z-20">
      <Image src={photo} alt="" fill priority={index === 0} sizes="100vw" className="object-cover" />
    </motion.div>
  );
}

/**
 * Одна глава: набор собирается, держит паузу, разбирается на состав и
 * собирается обратно. Всё считается от местной позиции внутри главы.
 */
function Act({
  index,
  chapter,
  timeline,
  reduced,
}: {
  index: number;
  chapter: (typeof chapters)[number];
  timeline: MotionValue<number>;
  reduced: boolean;
}) {
  const { slide, set, parts } = chapter;
  const q = useTransform(timeline, (value) => clamp(value - index));

  // Радиус кольца берётся из настоящего размера коробки: подписи разлетаются
  // в пикселях, а не в процентах от собственной ширины.
  const stage = useRef<HTMLDivElement>(null);
  const [half, setHalf] = useState(0);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setHalf(entry.contentRect.width / 2));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Заголовок уступает место разбору и не возвращается: следом идёт
  // следующая глава со своим заголовком.
  const textY = useTransform(q, [0, 0.5], [0, -18]);
  const textOpacity = useTransform(q, [0, 0.4, 0.5], [1, 1, 0]);
  const breakdown = useTransform(q, [0.46, 0.56, 0.84, 0.92], [0, 1, 1, 0]);
  const dim = useTransform(q, [0.4, 0.55, 0.84, 0.94], [0, 0.66, 0.66, 0]);

  const setScale = useTransform(q, [0, 0.42, 0.62, 0.94, 1], [1, 1, 0.78, 0.78, 0.9]);
  const setOpacity = useTransform(q, [0, 0.95, 1], [1, 1, 0]);

  const ringOpacity = useTransform(q, [0.44, 0.56, 0.84, 0.92], [0, 1, 1, 0]);
  const ringSpin = useTransform(q, [0.44, 1], [-22, 12]);

  return (
    <>
      {/* На время разбора кадр гаснет: читать состав поверх ёлки нельзя */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { opacity: dim }}
        className="pointer-events-none absolute inset-0 -z-10 bg-adar-green-950"
      />

      {/* Набор, кольцо и подписи */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-[34vh] pt-52 lg:pb-[16vh] lg:pt-24">
        <div
          ref={stage}
          className="relative aspect-square w-[min(58vw,14rem)] lg:w-[min(36vh,20rem)]"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <motion.div
              style={reduced ? undefined : { scale: setScale, opacity: setOpacity }}
              className="h-full w-full"
            >
              <AssemblingSet src={set.image} alt={set.name} className="h-full w-full" />
            </motion.div>
          </motion.div>

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
                <RingLabel key={part.label} order={order} part={part} q={q} half={half} reduced={reduced} />
              ))
            : null}
        </div>
      </div>

      {/* Текст главы и подпись разбора — в одном месте, по очереди */}
      <Shell size="wide" className="relative mt-auto pb-14 lg:pb-12">
        <div className="relative min-h-[12rem] lg:min-h-[13rem]">
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
            <h1 className="mt-4 text-balance font-adar-display text-[2.2rem] leading-[1] text-adar-cream-50 sm:text-5xl xl:text-[3.4rem]">
              {slide.title} <span className="adar-gold-text">{slide.accent}</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-adar-cream-50/75">
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
            <p className="mt-4 font-adar-display text-3xl leading-tight text-adar-cream-50 sm:text-4xl">
              {set.name}
            </p>
            <p className="mt-2 text-sm text-adar-cream-50/70">
              {set.count} наименований · {formatNumber(set.weight)} г ·{" "}
              {formatNumber(set.price)} сум
            </p>

            {/* На телефоне состав идёт столбцом: кольцо туда не поместится */}
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
  reduced,
}: {
  order: number;
  part: { label: string; grams: number };
  q: MotionValue<number>;
  half: number;
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
  const opacity = useTransform(q, [start, start + 0.09, 0.84, 0.91], [0, 1, 1, 0]);
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

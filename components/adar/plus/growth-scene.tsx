"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { Shell } from "@/components/adar/ui/shell";
import { formatNumber, formatWeight } from "@/lib/adar/format";
import type { GiftSet } from "@/lib/adar/types";

type Props = { stages: GiftSet[] };

/**
 * Сцена «набор растёт».
 *
 * Кадр закрепляется, и по мере прокрутки один набор сменяется следующим:
 * от эконома за 50 000 до платины на шесть килограммов. Одновременно
 * пересчитываются цена, вес и количество наименований — рост видно цифрами
 * и глазами сразу.
 *
 * Каждая ступень — их собственная фотография; ничего не дорисовано.
 * При включённом «уменьшении движения» сцена превращается в обычный ряд
 * карточек: смысл сохраняется, движения нет.
 */
export function GrowthScene({ stages }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Пружина снимает рывки трекпада: цифры не дёргаются на каждый кадр.
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 34,
    restDelta: 0.0005,
  });

  const stops = stages.map((_, index) => index / (stages.length - 1));
  const price = useTransform(progress, stops, stages.map((stage) => stage.price));
  const weight = useTransform(progress, stops, stages.map((stage) => stage.weight));
  const count = useTransform(progress, stops, stages.map((stage) => stage.count));

  const priceText = useTransform(price, (value) => formatNumber(Math.round(value / 1000) * 1000));
  const weightText = useTransform(weight, (value) => formatWeight(Math.round(value / 10) * 10));
  const countText = useTransform(count, (value) => `${Math.round(value)}`);
  const barScale = useTransform(progress, [0, 1], [0, 1]);

  if (reduced) {
    return <StaticStages stages={stages} />;
  }

  return (
    <section
      ref={container}
      aria-label="Как растёт набор"
      className="relative bg-adar-cream-100/60"
      style={{ height: `${stages.length * 58}vh` }}
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="adar-glow pointer-events-none absolute inset-0 opacity-70"
        />

        <Shell size="wide" className="relative grid w-full items-center gap-8 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-adar-green-500">
              От эконома до платины
            </p>

            <h2 className="mt-4 font-adar-display text-3xl leading-[1.05] text-adar-green-950 sm:text-5xl xl:text-6xl">
              Один набор,
              <br />
              восемь ступеней
            </h2>

            <div className="relative mt-6 h-8">
              {stages.map((stage, index) => (
                <StageLabel key={stage.slug} index={index} total={stages.length} progress={progress}>
                  {stage.lineLabel}
                </StageLabel>
              ))}
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-adar-green-900/12 pt-6 sm:gap-6 sm:pt-8">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-adar-ink-subtle">Цена</dt>
                <dd className="mt-2 font-adar-display text-2xl leading-none text-adar-green-800 tabular-nums sm:text-4xl">
                  <motion.span>{priceText}</motion.span>
                  <span className="ml-1 text-sm sm:text-base">сум</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-adar-ink-subtle">Вес</dt>
                <dd className="mt-2 font-adar-display text-2xl leading-none text-adar-green-800 tabular-nums sm:text-4xl">
                  <motion.span>{weightText}</motion.span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-adar-ink-subtle">
                  Позиций
                </dt>
                <dd className="mt-2 font-adar-display text-2xl leading-none text-adar-green-800 tabular-nums sm:text-4xl">
                  <motion.span>{countText}</motion.span>
                </dd>
              </div>
            </dl>

            <div className="mt-8 h-px w-full bg-adar-green-900/12">
              <motion.div
                style={{ scaleX: barScale }}
                className="h-px origin-left bg-adar-gold-500"
              />
            </div>
          </div>

          <div className="relative order-1 h-[32svh] w-full lg:order-2 lg:col-span-6 lg:col-start-7 lg:aspect-square lg:h-auto">
            {stages.map((stage, index) => (
              <StageImage
                key={stage.slug}
                stage={stage}
                index={index}
                total={stages.length}
                progress={progress}
              />
            ))}
          </div>
        </Shell>
      </div>
    </section>
  );
}

/**
 * Окно видимости ступени.
 *
 * Пять точек, а не три: у каждой ступени есть участок, где она видна
 * полностью, и короткие перекрытия по краям. С простым треугольником оба
 * соседних набора половину времени висят полупрозрачными и выглядят
 * привидениями.
 */
function windowOf(index: number, total: number) {
  const step = 1 / (total - 1);
  const centre = index * step;
  return [
    centre - step * 0.7,
    centre - step * 0.3,
    centre,
    centre + step * 0.3,
    centre + step * 0.7,
  ];
}

function StageImage({
  stage,
  index,
  total,
  progress,
}: {
  stage: GiftSet;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const range = windowOf(index, total);
  const opacity = useTransform(progress, range, [0, 1, 1, 1, 0]);
  // Набор въезжает чуть уменьшенным и уходит увеличенным — движение
  // читается как рост, а не как перелистывание.
  const scale = useTransform(progress, range, [0.84, 0.95, 1, 1.06, 1.16]);
  const y = useTransform(progress, range, [50, 18, 0, -18, -50]);

  return (
    <motion.div style={{ opacity, scale, y }} className="absolute inset-0">
      <Image
        src={stage.image}
        alt={stage.name}
        fill
        sizes="(min-width: 1024px) 45vw, 90vw"
        className="object-contain drop-shadow-[0_40px_60px_rgba(16,38,28,0.22)]"
      />
    </motion.div>
  );
}

function StageLabel({
  index,
  total,
  progress,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  // Название линейки сменяется почти мгновенно: фотографии на перекрытии
  // красиво растворяются друг в друге, а два наложенных слова — просто каша.
  const step = 1 / (total - 1);
  const centre = index * step;
  const range = [
    centre - step * 0.52,
    centre - step * 0.42,
    centre,
    centre + step * 0.42,
    centre + step * 0.52,
  ];
  const opacity = useTransform(progress, range, [0, 1, 1, 1, 0]);
  const y = useTransform(progress, range, [10, 0, 0, 0, -10]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="absolute inset-x-0 top-0 block font-adar-display text-2xl text-adar-gold-600"
    >
      {children}
    </motion.span>
  );
}

/** Версия сцены для тех, кто отключил анимации в системе. */
function StaticStages({ stages }: Props) {
  return (
    <section aria-label="Как растёт набор" className="bg-adar-cream-100/60 py-20 lg:py-28">
      <Shell size="wide">
        <h2 className="font-adar-display text-4xl leading-tight text-adar-green-950 sm:text-5xl">
          Один набор, восемь ступеней
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage) => (
            <li key={stage.slug} className="rounded-adar bg-adar-cream-50 p-6">
              <Image
                src={stage.image}
                alt={stage.name}
                width={400}
                height={400}
                className="mx-auto h-40 w-auto object-contain"
              />
              <p className="mt-5 font-adar-display text-xl text-adar-gold-600">
                {stage.lineLabel}
              </p>
              <p className="mt-2 text-sm text-adar-ink-muted">
                {formatNumber(stage.price)} сум · {formatWeight(stage.weight)} · {stage.count}{" "}
                позиций
              </p>
            </li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}

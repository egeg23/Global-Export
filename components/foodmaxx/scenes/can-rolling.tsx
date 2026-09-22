"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { roadD, roadLength, roadPoints } from "@/lib/foodmaxx/path";

/**
 * Остановки вдоль дороги.
 *
 * Это этапы производства с их же сайта, а не придуманный состав: состава
 * банок компания нигде не публикует, и дописывать его за неё нельзя — на
 * банке с мясом это цена вопроса, а не украшение.
 */
const STOPS = [
  { at: 0.1, title: "Приём сырья", note: "Мясо приезжает с отобранных хозяйств", icon: "pallet" },
  { at: 0.36, title: "Закладка", note: "Мясо и специи попадают в банку", icon: "konveyer" },
  { at: 0.62, title: "Пастеризация", note: "Тепло вместо консервантов", icon: "kran" },
  { at: 0.86, title: "Упаковка", note: "Партия маркируется и уходит на склад", icon: "korobka" },
];

/** Что напечатано на самой банке — это факт, его и показываем. */
const MARKS = ["100% halal", "Без ГМО", "Кусковое мясо"];

/** Радиус банки в единицах дороги: из него считается угол качения. */
const RADIUS = 46;

/**
 * Банка катится.
 *
 * Вторая большая сцена: жестяная банка едет по нарисованной линии, линия
 * прорисовывается за ней, а на остановках раскрываются этапы производства.
 * Угол поворота берётся не «на глаз», а из пройденного пути — банка
 * прокручивается ровно настолько, насколько проехала, и не скользит.
 */
export function CanRolling() {
  const frame = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const road = useMemo(() => roadPoints(160), []);

  const { scrollYProgress } = useScroll({ target: frame, offset: ["start start", "end end"] });
  const flow = useSpring(scrollYProgress, { stiffness: 54, damping: 24, mass: 0.45, restDelta: 0.0002 });
  const q = reduced ? scrollYProgress : flow;

  // Ход вдоль дороги: первые и последние проценты прокрутки уходят на въезд
  // и выезд, чтобы банка не стартовала и не замирала рывком.
  const run = useTransform(q, [0.06, 0.94], [0, 1], { clamp: true });

  const stops = road.map((p) => p.at);
  const x = useTransform(run, stops, road.map((p) => `${(p.x / 1000) * 100}%`));
  const y = useTransform(run, stops, road.map((p) => `${(p.y / 520) * 100}%`));
  const tilt = useTransform(run, stops, road.map((p) => p.angle));
  // Качение: пройденный путь, делённый на радиус, — это угол в радианах.
  const roll = useTransform(run, [0, 1], [0, (roadLength / RADIUS) * (180 / Math.PI)]);

  const drawn = useTransform(run, [0, 1], [roadLength, 0]);
  const headline = useTransform(q, [0, 0.12], [0, 1]);

  return (
    <section
      ref={frame}
      id="proizvodstvo"
      aria-label="Как делается банка тушёнки"
      className={reduced ? "relative bg-fm-ink-900 py-24" : "relative h-[560svh] bg-fm-ink-900"}
    >
      <div
        className={
          reduced
            ? ""
            : "sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-20 sm:pt-24"
        }
      >
        <div aria-hidden="true" className="fm-spot pointer-events-none absolute inset-0 opacity-70" />

        <Shell size="wide" className="relative">
          <motion.div
            style={reduced ? undefined : { opacity: headline }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-fm-amber-400">
              Производство
            </p>
            <h2 className="mt-4 font-fm-display text-[2rem] font-600 leading-[1.05] sm:text-5xl">
              Путь банки — <span className="fm-amber-text">восемь этапов</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fm-cream-50/65 sm:text-base">
              От приёмки сырья до упаковки. Ни одного консерванта: банку держит
              тепло, а не химия.
            </p>
          </motion.div>

          {/* Дорога и банка живут в одной системе координат — 1000 × 520 */}
          {/*
            Поле держит соотношение дороги. На узком экране его задаёт ширина,
            на широком — высота: иначе дорога выпирает за экран и заголовок
            уезжает под шапку.
          */}
          <div className="relative mx-auto mt-6 mb-28 w-full max-w-[1500px] [aspect-ratio:25/13] sm:mb-0 lg:h-[50svh] lg:w-auto">
            <svg
              viewBox="0 0 1000 520"
              fill="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d={roadD}
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray="7 11"
                strokeLinecap="round"
                className="text-fm-cream-50/18"
              />
              <motion.path
                d={roadD}
                stroke="currentColor"
                strokeWidth={3.5}
                strokeLinecap="round"
                className="text-fm-amber-500"
                style={
                  reduced
                    ? undefined
                    : { strokeDasharray: roadLength, strokeDashoffset: drawn }
                }
              />
              {STOPS.map((stop) => {
                const p = road[Math.round(stop.at * (road.length - 1))];
                return (
                  <circle
                    key={stop.title}
                    cx={p.x}
                    cy={p.y}
                    r={5}
                    className="fill-fm-amber-400"
                  />
                );
              })}
            </svg>

            {STOPS.map((stop) => (
              <Stop key={stop.title} stop={stop} road={road} run={run} reduced={!!reduced} />
            ))}

            {/* Телефон: этап показывается лентой под дорогой, а не у точки */}
            <div className="absolute inset-x-0 -bottom-24 h-20 sm:hidden">
              {STOPS.map((stop) => (
                <MobileStop key={stop.title} stop={stop} run={run} reduced={!!reduced} />
              ))}
            </div>

            <motion.div
              style={
                reduced
                  ? { left: "6%", top: "60%" }
                  : { left: x, top: y, translateX: "-50%", translateY: "-50%" }
              }
              className="absolute h-[26%] min-h-[4.5rem] w-auto sm:h-[30%]"
            >
              <motion.div style={reduced ? undefined : { rotate: tilt }} className="h-full">
                <motion.div style={reduced ? undefined : { rotate: roll }} className="h-full">
                  <Image
                    src="/foodmaxx/sets/kavurdak.webp"
                    alt="Банка мясной консервации FOODMAXX"
                    width={1100}
                    height={1023}
                    className="h-full w-auto"
                    style={{ filter: "drop-shadow(0 22px 26px rgba(0,0,0,0.5))" }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {MARKS.map((mark) => (
              <span
                key={mark}
                className="fm-glass fm-glass-sheen relative rounded-full px-5 py-2 text-xs text-fm-cream-50/85"
              >
                {mark}
              </span>
            ))}
          </div>
        </Shell>
      </div>
    </section>
  );
}

function Stop({
  stop,
  road,
  run,
  reduced,
}: {
  stop: (typeof STOPS)[number];
  road: ReturnType<typeof roadPoints>;
  run: MotionValue<number>;
  reduced: boolean;
}) {
  const point = road[Math.round(stop.at * (road.length - 1))];
  const opacity = useTransform(run, [stop.at - 0.1, stop.at - 0.02, stop.at + 0.16, stop.at + 0.24], [0, 1, 1, 0.25]);
  const lift = useTransform(run, [stop.at - 0.1, stop.at - 0.02], [14, 0]);
  // Карточка встаёт над точкой, а у нижних участков дороги — под ней.
  const above = point.y > 300;

  return (
    <motion.div
      style={
        reduced
          ? { left: `${(point.x / 1000) * 100}%`, top: `${(point.y / 520) * 100}%` }
          : { left: `${(point.x / 1000) * 100}%`, top: `${(point.y / 520) * 100}%`, opacity, y: lift }
      }
      className={`fm-glass fm-glass-sheen absolute hidden w-[11rem] -translate-x-1/2 rounded-2xl px-4 py-3 sm:block ${
        above ? "-translate-y-[165%]" : "translate-y-[65%]"
      }`}
    >
      <div className="flex items-center gap-2">
        <Image
          src={`/foodmaxx/icons/${stop.icon}.webp`}
          alt=""
          width={400}
          height={400}
          className="h-4 w-4 object-contain [filter:brightness(0)_invert(1)] opacity-80"
        />
        <p className="font-fm-display text-xs font-500 text-fm-amber-300">{stop.title}</p>
      </div>
      <p className="mt-1.5 text-[0.7rem] leading-relaxed text-fm-cream-50/72">{stop.note}</p>
    </motion.div>
  );
}


function MobileStop({
  stop,
  run,
  reduced,
}: {
  stop: (typeof STOPS)[number];
  run: MotionValue<number>;
  reduced: boolean;
}) {
  // Окна показа на телефоне не должны пересекаться: карточка здесь одна на
  // всю ширину, и две сразу налезали бы друг на друга.
  const opacity = useTransform(run, [stop.at - 0.09, stop.at - 0.02, stop.at + 0.09, stop.at + 0.13], [0, 1, 1, 0]);
  const y = useTransform(run, [stop.at - 0.09, stop.at - 0.02], [14, 0]);

  return (
    <motion.div
      style={reduced ? undefined : { opacity, y }}
      className="fm-glass fm-glass-sheen absolute inset-x-4 rounded-2xl px-5 py-3.5 text-center"
    >
      <p className="font-fm-display text-sm font-500 text-fm-amber-300">{stop.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-fm-cream-50/75">{stop.note}</p>
    </motion.div>
  );
}

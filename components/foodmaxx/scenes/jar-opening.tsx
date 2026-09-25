"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { scene } from "@/content/foodmaxx/catalog";

/**
 * Сноски, всплывающие внутри открытой банки.
 *
 * Первые две — то, что компания пишет о себе сама («только натуральные
 * продукты», приём сырья с проверенных хозяйств). Третья — обещание вкуса,
 * а не факт производства, и держится отдельной строкой, чтобы не выдавать
 * себя за характеристику.
 */
const NOTES = [
  { at: 0.21, from: 0.18, to: 0.25, title: "Натурально", note: "Без консервантов — только пастеризация", side: "left" as const, top: "22%" },
  { at: 0.25, from: 0.25, to: 0.31, title: "Проверенные поставщики", note: "Сырьё приезжает с отобранных хозяйств", side: "right" as const, top: "40%" },
  { at: 0.29, from: 0.31, to: 0.39, title: "Вкус из детства", note: "Рецепт не меняется от партии к партии", side: "left" as const, top: "62%" },
];

/** Цифры, которые видны, пока огурцы в воздухе. */
const FACTS = [
  { value: "8", label: "этапов от сырья до упаковки", side: "left" as const, top: "20%" },
  { value: "1 л", label: "фирменная банка огурцов", side: "right" as const, top: "32%" },
  { value: "0", label: "консервантов в составе", side: "left" as const, top: "58%" },
  { value: "6", label: "торговых сетей на полке", side: "right" as const, top: "70%" },
];

/**
 * Огурцы: у каждого своя дуга.
 *
 * Разлёт считается один раз здесь, а не в компоненте, чтобы на каждый кадр
 * не пересчитывать четырнадцать случайных чисел — и чтобы полёт был один и
 * тот же при любой перерисовке.
 */
const COUNT = 13;
const PICKLES = Array.from({ length: COUNT }, (_, i) => {
  // Веер: огурцы выходят из горлышка и расходятся в стороны, а не лезут
  // облаком из середины кадра. Угол считается от вертикали, поэтому края
  // веера улетают дальше и выше середины.
  const spread = (i / (COUNT - 1) - 0.5) * 2; // -1 … 1
  return {
    id: i,
    fly: spread * (230 + Math.abs(spread) * 190),
    rise: -(90 + (1 - Math.abs(spread)) * 70 + ((i * 37) % 60)),
    spin: (spread < 0 ? -1 : 1) * (200 + ((i * 53) % 260)),
    size: 0.78 + ((i * 17) % 34) / 100,
    delay: Math.abs(spread) * 0.03 + ((i % 3) * 0.012),
    // куда огурец уходит в горлышко ассорти
    land: spread * 26,
  };
});

/**
 * Банка открывается.
 *
 * Первая из двух больших сцен: банка выезжает, крышка уходит в сторону,
 * камера ныряет внутрь, огурцы вылетают на белый фон и падают в ассорти.
 * Вся сцена — одна прокрутка, закреплённая на экране; за угол, прозрачность
 * и разлёт отвечает один пружинный прогресс, поэтому ничего не «догоняет»
 * друг друга рывками.
 */
export function JarOpening() {
  const frame = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: frame, offset: ["start start", "end end"] });
  // Пружина снимает ступеньки трекпада: без неё разлёт дёргается на каждый кадр.
  const flow = useSpring(scrollYProgress, { stiffness: 52, damping: 24, mass: 0.45, restDelta: 0.0002 });
  const q = reduced ? scrollYProgress : flow;

  // Фон: тёмная студия → белый лист, на котором летят огурцы.
  const bg = useTransform(q, [0, 0.4, 0.52, 1], ["#0c0a08", "#0c0a08", "#fdfbf7", "#fdfbf7"]);
  const ink = useTransform(q, [0.42, 0.54], ["#fdfbf7", "#14110d"]);

  // Камера: подъезд, нырок внутрь, отъезд на общий план.
  const camera = useTransform(q, [0, 0.08, 0.2, 0.34, 0.46], [0.82, 1, 1.42, 1.42, 0.92]);
  const cameraY = useTransform(q, [0, 0.08, 0.2, 0.34, 0.46], ["18%", "0%", "14%", "14%", "-4%"]);
  const jarTilt = useTransform(q, [0.36, 0.5], [0, 172]);
  const jarFade = useTransform(q, [0.52, 0.62], [1, 0]);

  // Крышка: срывается, уходит вбок и крутится.
  const lidX = useTransform(q, [0.1, 0.2], [0, 320]);
  const lidY = useTransform(q, [0.1, 0.14, 0.2], [0, -120, 90]);
  const lidSpin = useTransform(q, [0.1, 0.2], [0, 68]);
  const lidFade = useTransform(q, [0.14, 0.22], [1, 0]);

  // Банка ассорти принимает огурцы.
  const assortiY = useTransform(q, [0.66, 0.8], ["46%", "0%"]);
  const assortiFade = useTransform(q, [0.66, 0.76], [0, 1]);

  return (
    <motion.section
      ref={frame}
      id="produkciya"
      aria-label="Как устроена банка FOODMAXX"
      style={{ backgroundColor: reduced ? undefined : bg }}
      className={
        reduced
          ? "relative bg-fm-ink-950 py-24"
          : "relative h-[620svh] bg-fm-ink-950"
      }
    >
      <div className={reduced ? "" : "sticky top-0 flex h-svh items-center overflow-hidden"}>
        <div aria-hidden="true" className="fm-spot pointer-events-none absolute inset-0" />

        <Shell size="wide" className="relative w-full">
          <div className="relative mx-auto flex h-svh max-w-5xl items-center justify-center">
            {/* Банка: корпус и крышка живут отдельно, потому и открывается */}
            <motion.div
              style={reduced ? undefined : { scale: camera, y: cameraY }}
              className="relative flex h-[62vh] w-full items-center justify-center"
            >
              <motion.div
                style={reduced ? undefined : { rotate: jarTilt, opacity: jarFade }}
                className="relative h-full"
              >
                <Image
                  src={scene.jarBody}
                  alt="Банка огурцов FOODMAXX"
                  width={886}
                  height={1484}
                  priority
                  className="h-full w-auto"
                  style={{ filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.55))" }}
                />
                <motion.div
                  style={reduced ? undefined : { x: lidX, y: lidY, rotate: lidSpin, opacity: lidFade }}
                  className="absolute inset-x-0 -top-[4%] flex justify-center"
                >
                  <Image src={scene.jarLid} alt="" width={886} height={104} className="h-auto w-full" />
                </motion.div>
              </motion.div>

              {PICKLES.map((p) => (
                <Pickle key={p.id} p={p} q={q} reduced={!!reduced} />
              ))}

              <motion.div
                style={reduced ? undefined : { y: assortiY, opacity: assortiFade }}
                className="pointer-events-none absolute bottom-[-10%] left-1/2 h-[56vh] -translate-x-1/2"
              >
                <Image
                  src={scene.jarAssorti}
                  alt="Ассорти маринованное FOODMAXX"
                  width={880}
                  height={1578}
                  className="h-full w-auto"
                  style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.3))" }}
                />
              </motion.div>
            </motion.div>

            {NOTES.map((n) => (
              <Note key={n.title} n={n} q={q} reduced={!!reduced} />
            ))}
            {FACTS.map((f) => (
              <Fact key={f.label} f={f} q={q} ink={ink} reduced={!!reduced} />
            ))}

            {/*
              Телефон. Раскладывать сноски по краям кадра здесь негде, поэтому
              они идут по очереди лентой внизу, а цифры — сеткой: то же
              содержание, другая витрина.
            */}
            <div className="absolute inset-x-0 bottom-[8%] h-24 sm:hidden">
              {NOTES.map((n) => (
                <MobileNote key={n.title} n={n} q={q} reduced={!!reduced} />
              ))}
            </div>
            <MobileFacts q={q} ink={ink} reduced={!!reduced} />
          </div>
        </Shell>
      </div>
    </motion.section>
  );
}

function Pickle({ p, q, reduced }: { p: (typeof PICKLES)[number]; q: MotionValue<number>; reduced: boolean }) {
  const from = 0.5 + p.delay;
  const peak = from + 0.13;
  const land = 0.87;

  const opacity = useTransform(q, [from - 0.02, from + 0.03, land - 0.04, land], [0, 1, 1, 0]);
  const x = useTransform(q, [from, peak, land], [0, p.fly, p.land]);
  // вверх из горлышка, затем вниз в приёмную банку — дуга, а не прямая
  const y = useTransform(q, [from, peak, land], [-40, p.rise, 330]);
  const rotate = useTransform(q, [from, land], [0, p.spin]);
  const scale = useTransform(q, [from, peak, land], [p.size * 0.55, p.size, p.size * 0.5]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, x, y, rotate, scale }}
      className="pointer-events-none absolute left-1/2 top-[34%] w-[26vw] max-w-[17rem] -translate-x-1/2"
    >
      <Image
        src={scene.ogurec}
        alt=""
        width={900}
        height={636}
        className="h-auto w-full"
        style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.28))" }}
      />
    </motion.div>
  );
}

function Note({ n, q, reduced }: { n: (typeof NOTES)[number]; q: MotionValue<number>; reduced: boolean }) {
  const opacity = useTransform(q, [n.at, n.at + 0.03, 0.36, 0.4], [0, 1, 1, 0]);
  const x = useTransform(q, [n.at, n.at + 0.05], [n.side === "left" ? -30 : 30, 0]);

  return (
    <motion.div
      // Высота берётся из данных, а не из класса: шаг между сносками подбирался
      // по кадру, а не по шкале отступов.
      style={reduced ? { top: n.top } : { top: n.top, opacity, x }}
      className={`fm-glass fm-glass-sheen pointer-events-none absolute hidden max-w-[15rem] rounded-2xl px-5 py-4 sm:block ${
        n.side === "left" ? "left-0 lg:left-[6%]" : "right-0 lg:right-[6%]"
      }`}
    >
      <p className="font-fm-display text-sm font-500 text-fm-amber-300">{n.title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-fm-cream-50/75">{n.note}</p>
    </motion.div>
  );
}

function Fact({
  f,
  q,
  ink,
  reduced,
}: {
  f: (typeof FACTS)[number];
  q: MotionValue<number>;
  ink: MotionValue<string>;
  reduced: boolean;
}) {
  const opacity = useTransform(q, [0.56, 0.62, 0.86, 0.92], [0, 1, 1, 0]);
  const x = useTransform(q, [0.56, 0.64], [f.side === "left" ? -40 : 40, 0]);

  return (
    <motion.div
      style={reduced ? { top: f.top } : { top: f.top, opacity, x, color: ink }}
      className={`pointer-events-none absolute hidden w-[13rem] sm:block ${
        f.side === "left" ? "left-0 text-left lg:left-[2%]" : "right-0 text-right lg:right-[2%]"
      }`}
    >
      <p className="font-fm-display text-4xl font-600 leading-none tabular-nums lg:text-5xl">{f.value}</p>
      <p className="mt-2 text-xs leading-relaxed opacity-70">{f.label}</p>
    </motion.div>
  );
}


function MobileNote({ n, q, reduced }: { n: (typeof NOTES)[number]; q: MotionValue<number>; reduced: boolean }) {
  const opacity = useTransform(q, [n.from - 0.02, n.from + 0.01, n.to - 0.01, n.to], [0, 1, 1, 0]);
  const y = useTransform(q, [n.from - 0.02, n.from + 0.02], [16, 0]);

  return (
    <motion.div
      style={reduced ? undefined : { opacity, y }}
      className="fm-glass fm-glass-sheen absolute inset-x-4 rounded-2xl px-5 py-4 text-center"
    >
      <p className="font-fm-display text-sm font-500 text-fm-amber-300">{n.title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-fm-cream-50/75">{n.note}</p>
    </motion.div>
  );
}

function MobileFacts({ q, ink, reduced }: { q: MotionValue<number>; ink: MotionValue<string>; reduced: boolean }) {
  const opacity = useTransform(q, [0.56, 0.62, 0.88, 0.94], [0, 1, 1, 0]);
  const y = useTransform(q, [0.56, 0.64], [18, 0]);

  return (
    <motion.dl
      style={reduced ? undefined : { opacity, y, color: ink }}
      className="absolute inset-x-4 bottom-[7%] grid grid-cols-2 gap-x-4 gap-y-5 sm:hidden"
    >
      {FACTS.map((f) => (
        <div key={f.label}>
          <dt className="sr-only">{f.label}</dt>
          <dd className="font-fm-display text-3xl font-600 leading-none tabular-nums">{f.value}</dd>
          <p className="mt-1.5 text-[0.68rem] leading-snug opacity-70">{f.label}</p>
        </div>
      ))}
    </motion.dl>
  );
}

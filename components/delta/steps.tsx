"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

import { steps } from "@/content/delta/school";
import { useCalmMotion } from "@/lib/calm-motion";
import { cn } from "@/lib/cn";

/**
 * Ступени — их собственный знак, разобранный на уровни.
 *
 * Школа сама объясняет логотип: «рост, развитие, знания и движение вперёд —
 * от первого шага до больших достижений» (пост #7). Треугольник-дельта здесь
 * делится на три ступени снизу вверх, и прокрутка наполняет их по очереди:
 * основание — младшие, вершина — старшие. На вершине загорается глобус из
 * четырёх квадратов — тот самый, что внутри знака.
 *
 * На телефоне сцена не закрепляется: три карточки подряд читаются быстрее,
 * чем прокрутка вслепую.
 */

const COLORS = ["#FFD84A", "#04BD62", "#5BA8FF"];

/** Полосы треугольника: низ, середина, верх (в координатах 0–100). */
const BANDS = [
  "M5 92 L95 92 L79 63 L21 63 Z",
  "M21 63 L79 63 L63 34 L37 34 Z",
  "M37 34 L63 34 L50 10 Z",
];

export function DeltaSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const calm = useCalmMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(2, Math.max(0, Math.floor(value * 3.2)));
    setActive((prev) => (prev === next ? prev : next));
  });

  const fill0 = useTransform(scrollYProgress, [0.02, 0.22], [0, 1]);
  const fill1 = useTransform(scrollYProgress, [0.32, 0.52], [0, 1]);
  const fill2 = useTransform(scrollYProgress, [0.62, 0.8], [0, 1]);
  const fills = [fill0, fill1, fill2];
  const globe = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const globeScale = useTransform(scrollYProgress, [0.8, 0.92], [0.4, 1]);

  return (
    <section id="stupeni" className="bg-dl-paper">
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-20 sm:px-6 lg:pt-28">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-blue">Ступени</p>
        <h2 className="mt-3 max-w-3xl font-dl-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          От первой мышки до настоящего кода
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-dl-ink-muted">
          Знак школы — треугольник-дельта: рост от первого шага до больших достижений. Ступени устроены
          так же — снизу вверх.
        </p>
      </div>

      {/* Телефон и «поменьше движения» — карточки подряд */}
      <div className={cn("mx-auto grid w-full max-w-[1240px] gap-5 px-4 pb-20 pt-10 sm:px-6", calm ? "" : "lg:hidden")}>
        {steps.map((step, index) => (
          <StepCard key={step.id} index={index} />
        ))}
      </div>

      {/* Компьютер — закреплённая сцена */}
      {calm ? null : (
        <div ref={ref} className="relative hidden h-[300vh] lg:block">
          <div className="sticky top-16 mx-auto grid h-[calc(100svh-4rem)] w-full max-w-[1240px] grid-cols-[1fr_1.05fr] items-center gap-14 px-6">
            <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
              <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden="true">
                <defs>
                  {BANDS.map((d, i) => (
                    <clipPath key={i} id={`dl-band-${i}`}>
                      <path d={d} />
                    </clipPath>
                  ))}
                </defs>

                {BANDS.map((d, i) => (
                  <g key={i}>
                    <path d={d} fill="#fff" />
                    {/* Заливка поднимается снизу вверх внутри своей полосы */}
                    <g clipPath={`url(#dl-band-${i})`}>
                      <motion.rect
                        x="0"
                        width="100"
                        y={[63, 34, 10][i]}
                        height={[29, 29, 24][i]}
                        fill={COLORS[i]}
                        style={{ scaleY: fills[i], transformOrigin: `50% ${[92, 63, 34][i]}%`, transformBox: "view-box" }}
                      />
                    </g>
                    <path d={d} fill="none" stroke="#10214A" strokeWidth="1.4" strokeLinejoin="round" />
                  </g>
                ))}

                {/* Подписи возрастов прямо на полосах */}
                {steps.map((step, i) => (
                  <text
                    key={step.id}
                    x="50"
                    y={[80, 51, 30.5][i]}
                    textAnchor="middle"
                    className="font-dl-display"
                    style={{ fontSize: i === 2 ? 3.3 : 5.2, fontWeight: 900 }}
                    fill={active === i ? "#10214A" : "#45557A"}
                  >
                    {step.ages}
                  </text>
                ))}

                {/* Глобус на вершине */}
                <motion.g style={{ opacity: globe, scale: globeScale, transformOrigin: "50% 4%", transformBox: "view-box" }}>
                  <rect x="44" y="-3" width="6" height="6" rx="1" fill="#FCE93A" stroke="#10214A" strokeWidth="0.8" />
                  <rect x="50" y="-3" width="6" height="6" rx="1" fill="#04BD62" stroke="#10214A" strokeWidth="0.8" />
                  <rect x="44" y="3" width="6" height="6" rx="1" fill="#E5322D" stroke="#10214A" strokeWidth="0.8" />
                  <rect x="50" y="3" width="6" height="6" rx="1" fill="#5BA8FF" stroke="#10214A" strokeWidth="0.8" />
                </motion.g>
              </svg>
            </div>

            <div className="relative min-h-[26rem]">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "absolute inset-0 transition-all duration-500 ease-out",
                    active === index ? "translate-y-0 opacity-100" : index < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0",
                  )}
                  aria-hidden={active !== index}
                >
                  <StepCard index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StepCard({ index }: { index: number }) {
  const step = steps[index];
  return (
    <article className="dl-clay p-7">
      <div className="flex items-center justify-between gap-4">
        <span
          className="rounded-full border-[3px] border-dl-ink px-3 py-1 text-sm font-extrabold"
          style={{ background: COLORS[index] }}
        >
          {step.ages}
        </span>
        <span className="font-dl-display text-sm font-black text-dl-ink-muted">ступень {index + 1} из 3</span>
      </div>
      <h3 className="mt-5 font-dl-display text-4xl font-black tracking-tight">«{step.name}»</h3>
      <p className="mt-2 text-lg font-semibold text-dl-ink-muted">{step.lead}</p>
      <ul className="mt-6 grid gap-3">
        {step.points.map((point) => (
          <li key={point} className="flex gap-3 text-base">
            <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-dl-ink bg-dl-green text-[0.7rem] font-black text-white" aria-hidden="true">
              ✓
            </span>
            {point}
          </li>
        ))}
      </ul>
      <p className="mt-6 rounded-2xl bg-dl-yellow-100 px-4 py-3 text-sm font-bold">
        <span className="text-dl-ink-muted">В итоге: </span>
        {step.result}
      </p>
    </article>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { company } from "@/content/foodmaxx/company";
import { scene } from "@/content/foodmaxx/catalog";

/** Овощи вокруг заголовка: у каждого своя глубина, от неё и ход. */
const FLOAT = [
  { src: scene.ogurec, alt: "", w: 900, depth: 1, className: "left-[-10%] top-[16%] w-[46vw] max-w-[30rem] -rotate-12 sm:left-[-2%] lg:w-[26vw]" },
  { src: scene.tomatoBasil, alt: "", w: 700, depth: 0.66, className: "right-[-10%] top-[10%] w-[40vw] max-w-[24rem] rotate-6 sm:right-[-2%] lg:w-[21vw]" },
  { src: scene.perec, alt: "", w: 500, depth: 0.44, className: "bottom-[9%] right-[7%] hidden w-[15vw] max-w-[12rem] -rotate-[28deg] lg:block" },
  { src: scene.heart, alt: "", w: 520, depth: 0.3, className: "bottom-[7%] left-[7%] hidden w-[12vw] max-w-[10rem] opacity-70 lg:block" },
];

const WORDS = ["Мир", "мясных", "и", "овощных", "консерваций"];

/**
 * Первый экран.
 *
 * Держится на типографике и глубине: заголовок собирается по словам, а овощи
 * вокруг него лежат на четырёх планах и расходятся и от прокрутки, и от
 * курсора. Самой банки здесь нет намеренно — она выезжает следующей сценой,
 * и первый экран не должен её опережать.
 */
export function FoodmaxxHero() {
  const frame = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: frame, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Курсор ведёт те же планы, что и прокрутка, — но мягче и с запозданием.
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 20, mass: 0.6 });
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 20, mass: 0.6 });

  return (
    <section
      ref={frame}
      aria-label="FOODMAXX"
      onPointerMove={(event) => {
        if (reduced || event.pointerType === "touch") return;
        const box = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - box.left - box.width / 2) / box.width);
        py.set((event.clientY - box.top - box.height / 2) / box.height);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="fm-grain relative flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden bg-fm-ink-950 pb-24 pt-12"
    >
      <div aria-hidden="true" className="fm-spot pointer-events-none absolute inset-0" />

      {FLOAT.map((item) => (
        <Plate key={item.className} item={item} progress={scrollYProgress} px={px} py={py} reduced={!!reduced} />
      ))}

      <Shell size="wide" className="relative">
        <motion.div style={reduced ? undefined : { y: lift, opacity: fade }} className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[0.7rem] font-medium uppercase tracking-[0.34em] text-fm-amber-400"
          >
            {company.legal} · с {company.since} года
          </motion.p>

          <h1 className="mt-7 font-fm-display text-[2.6rem] font-600 leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-[5.4rem]">
            {WORDS.map((word, order) => (
              <motion.span
                key={word + order}
                initial={reduced ? false : { opacity: 0, y: "0.5em", rotateX: -38 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.85, delay: 0.12 + order * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={
                  word === "консерваций"
                    ? "fm-amber-text mr-[0.28em] inline-block"
                    : "mr-[0.28em] inline-block"
                }
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-fm-cream-50/70 sm:text-lg"
          >
            Огурцы и ассорти в стекле, тушёное мясо и готовые блюда. Одна банка —
            один рецепт, и он не меняется от партии к партии.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#produkciya"
              className="rounded-full bg-fm-amber-500 px-7 py-3.5 text-sm font-medium text-fm-ink-950 transition-transform duration-300 hover:scale-[1.03] hover:bg-fm-amber-400"
            >
              Смотреть продукцию
            </a>
            <a
              href="#proizvodstvo"
              className="fm-glass fm-glass-sheen rounded-full px-7 py-3.5 text-sm text-fm-cream-50 transition-colors duration-300 hover:text-fm-amber-300"
            >
              Как это делается
            </a>
          </motion.div>
        </motion.div>
      </Shell>

      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { opacity: fade }}
        className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-fm-cream-50/45"
      >
        Листайте
        <motion.span
          animate={reduced ? undefined : { scaleY: [0.2, 1, 0.2], originY: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="block h-8 w-px bg-fm-cream-50/35"
        />
      </motion.div>
    </section>
  );
}

function Plate({
  item,
  progress,
  px,
  py,
  reduced,
}: {
  item: (typeof FLOAT)[number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  px: ReturnType<typeof useSpring>;
  py: ReturnType<typeof useSpring>;
  reduced: boolean;
}) {
  const drift = useTransform(progress, [0, 1], [0, 220 * item.depth]);
  const spin = useTransform(progress, [0, 1], [0, 14 * item.depth]);
  const mx = useTransform(px, (v) => v * 46 * item.depth);
  const my = useTransform(py, (v) => v * 34 * item.depth);

  return (
    <motion.div
      aria-hidden="true"
      style={reduced ? undefined : { y: drift, rotate: spin, x: mx, translateY: my }}
      className={`pointer-events-none absolute select-none ${item.className}`}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.86 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.25 + item.depth * 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }}
      >
        <Image src={item.src} alt={item.alt} width={item.w} height={item.w} priority className="h-auto w-full" />
      </motion.div>
    </motion.div>
  );
}

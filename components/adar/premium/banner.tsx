"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { AssemblingSet } from "@/components/adar/premium/assembling-set";
import { Shell } from "@/components/adar/ui/shell";
import { sets } from "@/content/adar/catalog";
import { bannerSlides } from "@/content/adar/banner";
import { company } from "@/content/adar/company";
import { priceRange } from "@/lib/adar/catalog";
import { formatNumber } from "@/lib/adar/format";
import { cn } from "@/lib/cn";

const HOLD = 6500;

/**
 * Главный баннер.
 *
 * Три слайда, и в каждом четыре плана, которые едут с разной скоростью: знак
 * компании в глубине, фотография, набор на переднем плане и текст. Отсюда
 * ощущение объёма — оно и делает кадр «динамичным», а не мелькание само по
 * себе.
 *
 * Смена слайдов останавливается, как только посетитель навёл курсор, поставил
 * фокус или коснулся экрана: карусель, которая уезжает из-под читающего, —
 * худшее, что может быть на первом экране. При отключённых анимациях остаётся
 * первый слайд, листать его можно руками.
 */
export function Banner() {
  const frame = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);

  const { scrollYProgress } = useScroll({ target: frame, offset: ["start start", "end start"] });
  // Четыре плана — четыре скорости. Знак почти стоит, набор уезжает быстрее всех.
  const markY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const markSpin = useTransform(scrollYProgress, [0, 1], [0, 26]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const setY = useTransform(scrollYProgress, [0, 1], ["0%", "-34%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const go = useCallback((next: number) => {
    setIndex((next + bannerSlides.length) % bannerSlides.length);
  }, []);

  useEffect(() => {
    if (held || reduced) return;
    const id = window.setTimeout(() => go(index + 1), HOLD);
    return () => window.clearTimeout(id);
  }, [go, held, index, reduced]);

  const slide = bannerSlides[index];
  const product = sets.find((item) => item.slug === slide.set) ?? sets[sets.length - 1];

  return (
    <section
      ref={frame}
      aria-roledescription="карусель"
      aria-label="Главный баннер"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
      onTouchStart={() => setHeld(true)}
      className="relative isolate flex min-h-[calc(100svh-13rem)] flex-col justify-end overflow-hidden bg-adar-green-950 pb-10 pt-16 lg:min-h-[calc(100svh-8.75rem)] lg:pb-12"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={slide.photo}
          initial={reduced ? false : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: reduced ? 1 : [1.08, 1.0] }}
          exit={reduced ? undefined : { opacity: 0 }}
          // Кадр всё время едва заметно наезжает: фотография живёт, пока
          // слайд держится, и это не мешает читать заголовок.
          transition={{
            opacity: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 9, ease: "linear" },
          }}
          className="absolute inset-0 -z-20"
        >
          <motion.div style={reduced ? undefined : { y: photoY }} className="absolute inset-0">
            <Image
              src={slide.photo}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Затемнение работает там, где лежит текст, а не по всему кадру:
          ровная пелена съедала как раз ту красочность, ради которой
          фотографию и ставят. Вертикальный слой держит низ и верх, косой —
          левую колонку с заголовком. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-adar-green-950 from-25% via-adar-green-950/75 via-60% to-adar-green-950/40 lg:via-adar-green-950/60 lg:to-adar-green-950/15"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-adar-green-950 via-adar-green-950/55 to-transparent lg:block"
      />
      <div aria-hidden="true" className="adar-glow absolute inset-x-0 top-0 -z-10 h-[70vh]" />

      {/* Знак компании тиснением поверх кадра */}
      <motion.span
        aria-hidden="true"
        style={reduced ? undefined : { y: markY, rotate: markSpin }}
        className="adar-logo-mark pointer-events-none absolute -right-[18%] top-[6%] -z-10 w-[80vw] opacity-[0.12] sm:-right-[12%] lg:opacity-[0.08] sm:w-[58vw] lg:right-[3%] lg:top-[16%] lg:w-[34vw]"
      />

      <Shell size="wide" className="relative grid items-end gap-8 lg:grid-cols-12">
        <motion.div
          style={reduced ? undefined : { y: textY, opacity: fade }}
          className="adar-text-plate relative lg:col-span-7"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.title}
              initial={reduced ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-adar-gold-300">
                {slide.eyebrow}
              </p>
              <h1 className="mt-5 max-w-3xl font-adar-display text-[2.6rem] leading-[0.98] text-adar-cream-50 sm:text-6xl xl:text-7xl">
                {slide.title}
                <br />
                <span className="adar-gold-text">{slide.accent}</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg text-adar-cream-50/75">
                {slide.note}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-7 flex flex-wrap gap-3">
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

          {/* Управление каруселью */}
          <div className="mt-8 flex items-center gap-5">
            <div className="flex gap-2">
              {bannerSlides.map((item, dot) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => go(dot)}
                  aria-current={dot === index}
                  className={cn(
                    "h-2.5 cursor-pointer rounded-full transition-all duration-500",
                    dot === index
                      ? "w-10 bg-adar-gold-500"
                      : "w-2.5 bg-adar-cream-50/35 hover:bg-adar-cream-50/60",
                  )}
                >
                  <span className="sr-only">Слайд {dot + 1}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {([-1, 1] as const).map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => go(index + step)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-adar-cream-50 transition-colors hover:border-adar-gold-500 hover:text-adar-gold-300"
                >
                  <span className="sr-only">{step === -1 ? "Предыдущий слайд" : "Следующий слайд"}</span>
                  <span aria-hidden="true">{step === -1 ? "←" : "→"}</span>
                </button>
              ))}
            </div>

            <p aria-live="polite" className="sr-only">
              Слайд {index + 1} из {bannerSlides.length}: {slide.title} {slide.accent}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-white/10 pt-6">
            <dl className="flex gap-6 sm:gap-10">
              {[
                { value: `${sets.length}`, label: "готовых наборов" },
                { value: "100+", label: "видов упаковки" },
                { value: `от ${formatNumber(priceRange.min)}`, label: "сум за набор" },
              ].map((figure) => (
                <div key={figure.label} className="flex flex-col-reverse">
                  <dt className="mt-1.5 text-xs text-adar-cream-50/55">{figure.label}</dt>
                  <dd className="font-adar-display text-2xl text-adar-gold-400 sm:text-3xl">
                    {figure.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-adar-cream-50/55">{company.contacts.hours}</p>
          </div>
        </motion.div>

        {/* Набор на переднем плане */}
        <motion.div
          style={reduced ? undefined : { y: setY }}
          className="relative hidden lg:col-span-5 lg:block"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={product.slug}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <AssemblingSet src={product.image} alt={product.name} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

      </Shell>
    </section>
  );
}

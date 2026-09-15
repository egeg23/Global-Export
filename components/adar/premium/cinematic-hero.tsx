"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Shell } from "@/components/adar/ui/shell";
import { sets } from "@/content/adar/catalog";
import { company } from "@/content/adar/company";
import { priceRange } from "@/lib/adar/catalog";
import { formatNumber } from "@/lib/adar/format";

const TITLE = ["Подарок,", "который", "помнят", "год"];

/**
 * Первый кадр премиальной версии.
 *
 * Фотография уходит вглубь медленнее текста, заголовок собирается по слову,
 * подсветка живёт своей жизнью. Ровно тот эффект, ради которого открывают
 * сайт целиком, — и ровно та причина, по которой он стоит дороже.
 */
export function CinematicHero() {
  const frame = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start start", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.16]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-24%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={frame}
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-adar-green-950 pb-16 pt-24 lg:min-h-screen lg:pb-24"
    >
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: photoY, scale: photoScale }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src="/adar/photos/gifts-under-tree.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-adar-green-950 via-adar-green-950/80 to-adar-green-950/45"
      />
      <motion.div
        aria-hidden="true"
        animate={reduced ? undefined : { opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="adar-glow absolute inset-x-0 top-0 -z-10 h-[70vh]"
      />

      <motion.div style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}>
        <Shell size="wide">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-adar-gold-400">
            ADAR · Ташкент · с {company.since} года
          </p>

          <h1 className="mt-8 max-w-4xl font-adar-display text-[3.25rem] leading-[0.95] text-adar-cream-50 sm:text-7xl xl:text-[7.5rem]">
            {TITLE.map((word, index) => (
              <span key={word} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                <motion.span
                  initial={reduced ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.15 + index * 0.11,
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={index === TITLE.length - 1 ? "adar-gold-text inline-block" : "inline-block"}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-end justify-between gap-10"
          >
            <div className="max-w-md">
              <p className="text-lg leading-relaxed text-adar-cream-50/70">
                Подарочные наборы для комбинатов, министерств и заводов.
                От коробки за {formatNumber(priceRange.min)} до платины
                на шесть килограммов.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#katalog"
                  className="rounded-full bg-adar-gold-500 px-7 py-3.5 text-sm font-medium text-adar-green-950 transition-colors duration-300 hover:bg-adar-gold-400"
                >
                  Смотреть каталог
                </a>
                <a
                  href="#korporativnym"
                  className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-adar-cream-50 transition-colors duration-300 hover:border-adar-gold-500/70 hover:text-adar-gold-300"
                >
                  Расчёт партии
                </a>
              </div>
            </div>

            <dl className="flex gap-10 text-adar-cream-50">
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-adar-cream-50/40">
                  Наборов
                </dt>
                <dd className="mt-2 font-adar-display text-4xl text-adar-gold-400">
                  {sets.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-adar-cream-50/40">
                  Линеек
                </dt>
                <dd className="mt-2 font-adar-display text-4xl text-adar-gold-400">8</dd>
              </div>
              <div className="hidden sm:block">
                <dt className="text-xs uppercase tracking-[0.16em] text-adar-cream-50/40">
                  Сезонов
                </dt>
                <dd className="mt-2 font-adar-display text-4xl text-adar-gold-400">15</dd>
              </div>
            </dl>
          </motion.div>
        </Shell>
      </motion.div>
    </section>
  );
}

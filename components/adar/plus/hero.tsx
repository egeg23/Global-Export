"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { Shell } from "@/components/adar/ui/shell";
import { sets } from "@/content/adar/catalog";
import { company } from "@/content/adar/company";
import { priceRange } from "@/lib/adar/catalog";
import { formatNumber } from "@/lib/adar/format";
import type { GiftSet } from "@/lib/adar/types";

/**
 * Первый экран второго варианта.
 *
 * Слово за словом собирается заголовок, справа тремя слоями всплывают
 * наборы — и продолжают едва заметно покачиваться. Ровно столько движения,
 * чтобы страница выглядела живой, и не столько, чтобы мешать читать.
 */
export function PlusHero({ showcase }: { showcase: GiftSet[] }) {
  const reduced = useReducedMotion();
  const words = "Подарок, который выбирают за минуту".split(" ");

  return (
    <section className="relative overflow-hidden pb-20 pt-14 lg:pb-28 lg:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-24 h-[40rem] w-[40rem] rounded-full bg-adar-gold-200/40 blur-3xl"
      />

      <Shell size="wide" className="relative grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-adar-green-500">
            Подарочные наборы · Ташкент · с {company.since} года
          </p>

          <h1 className="mt-6 flex flex-wrap gap-x-[0.28em] font-adar-display text-[2.75rem] leading-[1.03] text-adar-green-950 sm:text-6xl xl:text-7xl">
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={reduced ? false : { opacity: 0, y: "0.4em" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-adar-ink-muted">
            {sets.length} готовых наборов от {formatNumber(priceRange.min)} до{" "}
            {formatNumber(priceRange.max)} сум. Поиск понимает не только
            название, но и то, что лежит внутри коробки.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#katalog"
              className="rounded-full bg-adar-green-900 px-7 py-3.5 text-sm font-medium text-adar-cream-50 transition-colors duration-300 hover:bg-adar-green-800"
            >
              Открыть каталог
            </a>
            <a
              href="#kontakty"
              className="rounded-full border border-adar-green-900/15 px-7 py-3.5 text-sm font-medium text-adar-green-900 transition-colors duration-300 hover:border-adar-green-900/35 hover:bg-white"
            >
              Рассчитать партию
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <ul className="flex items-end justify-center gap-2 sm:gap-4">
            {showcase.map((set, index) => (
              <motion.li
                key={set.slug}
                initial={reduced ? false : { opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                // Средний набор крупнее соседних: ряд читается как витрина,
                // а не как три одинаковых картинки.
                className={index === 1 ? "flex-[1.35]" : "flex-1"}
              >
                <motion.div
                  animate={reduced ? undefined : { y: [0, -12, 0] }}
                  transition={{
                    duration: 5 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                >
                  <Image
                    src={set.image}
                    alt={set.name}
                    width={520}
                    height={520}
                    priority={index === 1}
                    className="mx-auto w-full object-contain drop-shadow-[0_30px_45px_rgba(16,38,28,0.22)]"
                  />
                </motion.div>
                <p className="mt-4 text-center text-xs text-adar-ink-subtle">{set.lineLabel}</p>
                <p className="text-center text-sm font-medium tabular-nums text-adar-green-800">
                  {formatNumber(set.price)}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </Shell>
    </section>
  );
}

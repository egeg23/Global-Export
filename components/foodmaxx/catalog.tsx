"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { byShelf, shelves } from "@/content/foodmaxx/catalog";
import { cn } from "@/lib/cn";
import type { Shelf } from "@/lib/foodmaxx/types";

/**
 * Каталог.
 *
 * Три полки, между которыми переключаются на месте: у компании сорок восемь
 * позиций, и показывать их одним списком — значит спрятать мясное за
 * пятнадцатью банками огурцов. Цен и веса здесь нет: компания их не
 * публикует, а придумывать цену на чужой товар нельзя.
 */
export function FoodmaxxCatalog() {
  const [shelf, setShelf] = useState<Shelf>("ovoshi");
  const reduced = useReducedMotion();
  const list = byShelf(shelf);
  const current = shelves.find((s) => s.id === shelf);

  return (
    <section id="katalog" className="relative bg-fm-cream-50 py-20 text-fm-ink-900 lg:py-28">
      <Shell size="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-fm-amber-600">
              Каталог
            </p>
            <h2 className="mt-4 max-w-xl font-fm-display text-[2rem] font-600 leading-[1.05] sm:text-5xl">
              Сорок восемь позиций
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-fm-ink-400">
            {current?.note}. Спецификации с составом и весом добавим, когда
            заказчик их пришлёт — выдумывать их за него нельзя.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {shelves.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setShelf(option.id)}
              className={cn(
                "cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-colors duration-300",
                shelf === option.id
                  ? "border-fm-ink-900 bg-fm-ink-900 text-fm-cream-50"
                  : "border-fm-ink-900/12 text-fm-ink-600 hover:border-fm-ink-900/35",
              )}
            >
              {option.label}
              <span className="ml-2 text-xs tabular-nums opacity-55">
                {byShelf(option.id).length}
              </span>
            </button>
          ))}
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((item, order) => (
            <motion.li
              key={item.slug}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.5, delay: Math.min(order, 7) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-fm border border-fm-ink-900/8 bg-white transition-shadow duration-500 hover:shadow-[0_28px_60px_-34px_rgba(20,17,13,0.5)]"
            >
              <div className="relative flex aspect-square items-center justify-center bg-fm-cream-100 p-6">
                <Image
                  src={`/foodmaxx/sets/${item.image}.webp`}
                  alt={item.name}
                  width={700}
                  height={700}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  className="h-full w-auto object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                />
              </div>
              <div className="p-5">
                <h3 className="text-sm leading-snug">{item.name}</h3>
                {item.note ? (
                  <p className="mt-1.5 text-xs text-fm-ink-400">{item.note}</p>
                ) : null}
              </div>
            </motion.li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Shell } from "@/components/adar/ui/shell";
import { sets } from "@/content/adar/catalog";
import { contentsOf, priceRange } from "@/lib/adar/catalog";
import { formatPrice, formatWeight, pluralize } from "@/lib/adar/format";

/**
 * Подбор набора по бюджету.
 *
 * Заказчик почти всегда начинает не с набора, а с суммы на человека. Ползунок
 * отвечает на этот вопрос напрямую: под каждую сумму показывается самый
 * дорогой набор, который в неё укладывается, с весом, составом и остатком.
 *
 * Каталог отсортирован по цене, поэтому подходящий набор ищется одним
 * проходом с конца, без индексов и предвычислений.
 */
export function BudgetPicker() {
  const id = useId();
  const reduced = useReducedMotion();
  const [budget, setBudget] = useState(180000);

  const match = useMemo(() => {
    for (let index = sets.length - 1; index >= 0; index -= 1) {
      if (sets[index].price <= budget) return sets[index];
    }
    return sets[0];
  }, [budget]);

  const contents = contentsOf(match);
  const change = budget - match.price;
  const nearby = sets.filter((set) => set.slug !== match.slug && Math.abs(set.price - budget) <= 60000).slice(0, 3);

  return (
    <section id="podbor" className="relative overflow-hidden bg-adar-green-900 py-20 lg:py-28">
      <div aria-hidden="true" className="adar-glow pointer-events-none absolute inset-0 opacity-60" />

      <Shell size="wide" className="relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-adar-gold-400">
            Подбор
          </p>
          <h2 className="mt-6 font-adar-display text-4xl leading-tight text-adar-cream-50 sm:text-5xl">
            Назовите бюджет — покажем набор
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-adar-cream-50/60">
            Столько обычно закладывают на одного сотрудника. Двигайте — состав,
            вес и упаковка меняются на глазах.
          </p>

          <div className="mt-10">
            <label
              htmlFor={`${id}-budget`}
              className="flex items-baseline justify-between text-xs uppercase tracking-[0.16em] text-adar-cream-50/45"
            >
              Бюджет на человека
              <span className="font-adar-display text-3xl normal-case tracking-normal text-adar-gold-400 tabular-nums">
                {formatPrice(budget)}
              </span>
            </label>
            <input
              id={`${id}-budget`}
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={10000}
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
              className="mt-4 h-10 w-full cursor-pointer accent-adar-gold-500"
            />
            <div className="flex justify-between text-xs text-adar-cream-50/35">
              <span>{formatPrice(priceRange.min)}</span>
              <span>{formatPrice(priceRange.max)}</span>
            </div>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-adar-cream-50/55">
            {change > 0 ? (
              <>
                Подходит{" "}
                <span className="text-adar-cream-50">«{match.name}»</span> — остаётся{" "}
                <span className="text-adar-gold-300">{formatPrice(change)}</span> на упаковку
                и доставку.
              </>
            ) : (
              <>
                Ровно в бюджет: <span className="text-adar-cream-50">«{match.name}»</span>.
              </>
            )}
          </p>

          {nearby.length > 0 ? (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.16em] text-adar-cream-50/35">
                Рядом по цене
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {nearby.map((set) => (
                  <li key={set.slug}>
                    <button
                      type="button"
                      onClick={() => setBudget(set.price)}
                      className="cursor-pointer rounded-full border border-white/12 px-4 py-2 text-xs text-adar-cream-50/70 transition-colors hover:border-adar-gold-500/60 hover:text-adar-gold-300"
                    >
                      {set.name} · {formatPrice(set.price)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="grid gap-8 rounded-adar-lg border border-white/10 bg-white/[0.04] p-6 sm:grid-cols-2 sm:p-8">
            <div className="relative aspect-square">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={match.slug}
                  initial={reduced ? false : { opacity: 0, scale: 0.92, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 1.04, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={match.image}
                    alt={match.name}
                    fill
                    sizes="(min-width: 640px) 24vw, 80vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="min-w-0">
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-adar-gold-400">
                {match.lineLabel}
              </p>
              <h3 className="mt-3 font-adar-display text-2xl leading-tight text-adar-cream-50">
                {match.name}
              </h3>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-white/10 py-5 text-sm">
                <div>
                  <dt className="text-xs text-adar-cream-50/40">Вес</dt>
                  <dd className="mt-1 text-adar-cream-50 tabular-nums">
                    {formatWeight(match.weight)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-adar-cream-50/40">Состав</dt>
                  <dd className="mt-1 text-adar-cream-50 tabular-nums">
                    {pluralize(match.count, ["позиция", "позиции", "позиций"])}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-adar-cream-50/40">Упаковка</dt>
                  <dd className="mt-1 text-adar-cream-50">
                    {match.pack === "bag" ? "мешок" : "коробка"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-adar-cream-50/40">Цена</dt>
                  <dd className="mt-1 text-adar-gold-300 tabular-nums">
                    {formatPrice(match.price)}
                  </dd>
                </div>
              </dl>

              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-adar-cream-50/35">
                Внутри
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {contents.slice(0, 7).map((item, index) => (
                  <li
                    key={`${item.name}-${index}`}
                    className="rounded-full border border-white/10 px-3 py-1 text-[0.7rem] text-adar-cream-50/65"
                  >
                    {item.name}
                  </li>
                ))}
                {contents.length > 7 ? (
                  <li className="rounded-full px-3 py-1 text-[0.7rem] text-adar-cream-50/40">
                    и ещё {contents.length - 7}
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}

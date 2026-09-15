"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { Shell } from "@/components/adar/ui/shell";
import { sets } from "@/content/adar/catalog";
import { formatNumber, formatPrice, pluralize } from "@/lib/adar/format";

const LOGO_THRESHOLD = 5000;

/**
 * Корпоративный раздел.
 *
 * Крупный заказчик считает не цену набора, а сумму контракта, и делает это
 * в калькуляторе на телефоне ещё до звонка. Здесь он делает это на странице —
 * и сразу видит, добирает ли до порога, за которым коробка печатается
 * с его логотипом.
 */
export function CorporateBlock() {
  const id = useId();
  const [count, setCount] = useState(2000);
  const [slug, setSlug] = useState(sets.find((set) => set.line === "prestige")?.slug ?? sets[0].slug);

  const chosen = sets.find((set) => set.slug === slug) ?? sets[0];
  const total = chosen.price * count;
  const missing = Math.max(0, LOGO_THRESHOLD - count);

  return (
    <section id="korporativnym" className="bg-adar-green-950 py-20 lg:py-28">
      <Shell size="wide" className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-adar-gold-400">
            Корпоративным заказчикам
          </p>
          <h2 className="mt-6 font-adar-display text-4xl leading-tight text-adar-cream-50 sm:text-5xl">
            Партия на весь коллектив
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-adar-cream-50/60">
            От {formatNumber(LOGO_THRESHOLD)} штук дизайн коробки меняется
            под заказчика, а на каждый комплект наносится логотип организации.
            Первый контракт компании — 24 000 подарков для Алмалыкского ГМК.
          </p>

          <div className="mt-10 grid gap-6">
            <div>
              <label
                htmlFor={`${id}-set`}
                className="mb-2 block text-xs uppercase tracking-[0.16em] text-adar-cream-50/45"
              >
                Набор
              </label>
              <select
                id={`${id}-set`}
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className="w-full cursor-pointer rounded-xl border border-white/12 bg-adar-green-900 px-4 py-3 text-sm text-adar-cream-50 outline-none focus-visible:border-adar-gold-500"
              >
                {sets.map((set) => (
                  <option key={set.slug} value={set.slug}>
                    {set.name} — {formatNumber(set.price)} сум
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor={`${id}-count`}
                className="mb-2 flex items-baseline justify-between text-xs uppercase tracking-[0.16em] text-adar-cream-50/45"
              >
                Количество
                <span className="text-sm normal-case tracking-normal text-adar-cream-50 tabular-nums">
                  {pluralize(count, ["штука", "штуки", "штук"])}
                </span>
              </label>
              <input
                id={`${id}-count`}
                type="range"
                min={100}
                max={25000}
                step={100}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="h-10 w-full cursor-pointer accent-adar-gold-500"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-adar-lg border border-adar-gold-500/25 bg-white/[0.04] p-8">
            <div className="flex items-center gap-5 border-b border-white/10 pb-6">
              <Image
                src={chosen.image}
                alt={chosen.name}
                width={200}
                height={200}
                className="h-24 w-24 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-adar-gold-400">
                  {chosen.lineLabel}
                </p>
                <p className="mt-1 truncate text-lg text-adar-cream-50">{chosen.name}</p>
                <p className="mt-1 text-sm text-adar-cream-50/50 tabular-nums">
                  {formatPrice(chosen.price)} за штуку
                </p>
              </div>
            </div>

            <p className="mt-8 text-xs uppercase tracking-[0.18em] text-adar-cream-50/40">
              Сумма партии
            </p>
            <p className="mt-3 font-adar-display text-5xl leading-none text-adar-gold-400 tabular-nums sm:text-6xl">
              {formatNumber(total)}
              <span className="ml-2 text-2xl">сум</span>
            </p>

            <p className="mt-8 rounded-xl border border-white/10 px-5 py-4 text-sm leading-relaxed text-adar-cream-50/70">
              {missing > 0 ? (
                <>
                  До собственного дизайна коробки не хватает{" "}
                  <span className="text-adar-gold-300">
                    {pluralize(missing, ["штуки", "штук", "штук"])}
                  </span>
                  . С {formatNumber(LOGO_THRESHOLD)} штук макет делается под вас.
                </>
              ) : (
                <>
                  Тираж проходит порог: коробка печатается по вашему макету,
                  логотип наносится на каждый комплект.
                </>
              )}
            </p>

            <a
              href="#kontakty"
              className="mt-8 inline-flex rounded-full bg-adar-gold-500 px-7 py-3.5 text-sm font-medium text-adar-green-950 transition-colors duration-300 hover:bg-adar-gold-400"
            >
              Запросить коммерческое предложение
            </a>
          </div>
        </div>
      </Shell>
    </section>
  );
}

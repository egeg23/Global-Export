"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { company } from "@/content/foodmaxx/company";
import { scene } from "@/content/foodmaxx/catalog";

const FIGURES = [
  { value: "2015", label: "год основания" },
  { value: "48", label: "позиций в каталоге" },
  { value: "3", label: "линейки: овощи, мясо, блюда" },
];

/**
 * О компании.
 *
 * Два плана расходятся на прокрутке: снимок производства идёт медленнее
 * текста, и раздел читается объёмным, а не плоской колонкой с картинкой.
 */
export function FoodmaxxAbout() {
  const frame = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });

  const photo = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const text = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const mark = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  return (
    <section
      id="o-kompanii"
      ref={frame}
      className="fm-grain relative overflow-hidden border-y border-white/8 bg-fm-ink-900 py-20 lg:py-28"
    >
      <div aria-hidden="true" className="fm-spot pointer-events-none absolute inset-0 opacity-60" />

      <Shell size="wide" className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <motion.div style={reduced ? undefined : { y: text }} className="lg:col-span-6">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-fm-amber-400">
            О компании
          </p>
          <h2 className="mt-5 font-fm-display text-[2rem] font-600 leading-[1.05] sm:text-[2.6rem]">
            {company.legal} — <span className="fm-amber-text">с {company.since} года</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-fm-cream-50/72">
            {company.long}
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-fm-cream-50/72">
            {company.about}
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {FIGURES.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="font-fm-display text-3xl font-600 tabular-nums text-fm-amber-400 sm:text-4xl">
                  {f.value}
                </dd>
                <p className="mt-2 text-xs leading-relaxed text-fm-cream-50/60">{f.label}</p>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div style={reduced ? undefined : { y: photo }} className="relative lg:col-span-6">
          <div className="overflow-hidden rounded-fm-lg border border-white/10 bg-fm-ink-800">
            <Image
              src={scene.heart}
              alt="Огурцы и томаты FOODMAXX"
              width={1000}
              height={1000}
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="h-full w-full object-cover"
            />
          </div>
          <motion.div
            aria-hidden="true"
            style={reduced ? undefined : { rotate: mark }}
            className="fm-glass fm-glass-sheen absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl px-5 py-4 lg:-left-10"
          >
            <Image
              src={scene.zavod}
              alt=""
              width={900}
              height={900}
              className="h-10 w-10 object-contain [filter:brightness(0)_invert(1)] opacity-80"
            />
            <p className="max-w-[9rem] text-xs leading-relaxed text-fm-cream-50/80">
              Свой завод в Ташкентской области
            </p>
          </motion.div>
        </motion.div>
      </Shell>
    </section>
  );
}

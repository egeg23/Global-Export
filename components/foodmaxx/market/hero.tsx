"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { company } from "@/content/foodmaxx/company";
import { scene } from "@/content/foodmaxx/catalog";

/**
 * Выноски вокруг банки.
 *
 * Всё, что здесь написано, напечатано на самой банке или сказано компанией
 * на её сайте: объём, «только из отборных овощей», отсутствие консервантов,
 * пастеризация. Инфографика тем и работает, что каждую подпись можно
 * проверить, взяв банку в руки.
 */
const CALLOUTS = [
  { title: "1 литр", note: "фирменная банка", side: "left" as const, top: "12%" },
  { title: "Только отборные овощи", note: "с этикетки", side: "right" as const, top: "26%" },
  { title: "Без консервантов", note: "держит тепло, а не химия", side: "left" as const, top: "56%" },
  { title: "Пастеризация", note: "седьмой этап из восьми", side: "right" as const, top: "70%" },
];

const BADGES = ["100% halal", "Без ГМО", "Свой завод", "С 2015 года"];

/**
 * Первый экран варианта 02.
 *
 * Устроен как первая картинка карточки маркетплейса: товар в центре, вокруг
 * подписи на выносках, снизу штампы. Задача — чтобы за три секунды было
 * понятно, что в банке и чем она лучше соседней на полке.
 */
export function MarketHero() {
  const reduced = useReducedMotion();
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section id="content" className="relative overflow-hidden bg-mk-green-50 pb-16 pt-10 lg:pb-24 lg:pt-14">
      <Shell size="wide">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-mk-green-600"
          >
            {company.legal}
          </motion.p>
          <motion.h1
            {...rise(0.06)}
            className="mt-6 font-mk-display text-[2.2rem] font-700 leading-[1.06] tracking-[-0.02em] text-mk-ink sm:text-5xl lg:text-[3.6rem]"
          >
            Консервация, которую
            <br className="hidden sm:block" />{" "}
            <span className="rounded-xl bg-mk-orange-500 px-3 py-0.5 text-white">берут повторно</span>
          </motion.h1>
          <motion.p
            {...rise(0.12)}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mk-ink-muted sm:text-lg"
          >
            47 позиций: огурцы и ассорти в стекле, тушёное мясо, готовые блюда.
            Одна рецептура от партии к партии — покупатель возвращается за тем
            же вкусом.
          </motion.p>
        </div>

        {/* Товар с выносками — центральная картинка карточки */}
        <div className="relative mx-auto mt-10 grid max-w-6xl grid-cols-1 items-center gap-8 lg:mt-14 lg:grid-cols-[1fr_auto_1fr]">
          <div className="hidden flex-col gap-10 lg:flex">
            {CALLOUTS.filter((c) => c.side === "left").map((c, i) => (
              <Callout key={c.title} c={c} align="right" delay={0.3 + i * 0.1} reduced={!!reduced} />
            ))}
          </div>

          <motion.div
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.92 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] as const },
                })}
            className="relative mx-auto flex h-[46vh] min-h-[19rem] items-center justify-center py-2 lg:h-[54vh]"
          >
            <div aria-hidden="true" className="mk-halo absolute inset-[-18%]" />
            <Image
              src={scene.jarOgurcy}
              alt="Огурцы маринованные FOODMAXX, 1 литр"
              width={886}
              height={1579}
              priority
              className="relative h-full w-auto"
            />
          </motion.div>

          <div className="hidden flex-col gap-10 lg:flex">
            {CALLOUTS.filter((c) => c.side === "right").map((c, i) => (
              <Callout key={c.title} c={c} align="left" delay={0.36 + i * 0.1} reduced={!!reduced} />
            ))}
          </div>

          {/* Телефон: выноски становятся сеткой под товаром */}
          <ul className="grid grid-cols-2 gap-3 lg:hidden">
            {CALLOUTS.map((c) => (
              <li key={c.title} className="rounded-mk bg-white px-4 py-3.5">
                <p className="font-mk-display text-sm font-600 leading-snug text-mk-ink">{c.title}</p>
                <p className="mt-1 text-xs leading-snug text-mk-ink-subtle">{c.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <motion.ul
          {...rise(0.5)}
          className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2.5"
        >
          {BADGES.map((badge) => (
            <li
              key={badge}
              className="rounded-full border border-mk-green-200 bg-white px-4 py-2 text-xs font-semibold text-mk-green-700"
            >
              {badge}
            </li>
          ))}
        </motion.ul>

        <motion.div {...rise(0.56)} className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#zayavka"
            className="rounded-full bg-mk-orange-500 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mk-orange-600"
          >
            Получить прайс и образцы
          </a>
          <a
            href="#polki"
            className="rounded-full border border-mk-green-200 bg-white px-7 py-3.5 text-sm font-semibold text-mk-green-700 transition-colors duration-200 hover:border-mk-green-400"
          >
            Смотреть 47 позиций
          </a>
        </motion.div>
      </Shell>
    </section>
  );
}

function Callout({
  c,
  align,
  delay,
  reduced,
}: {
  c: (typeof CALLOUTS)[number];
  align: "left" | "right";
  delay: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      {...(reduced
        ? {}
        : {
            initial: { opacity: 0, x: align === "right" ? -16 : 16 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
          })}
      className={`flex items-center gap-3 ${align === "right" ? "flex-row" : "flex-row-reverse"}`}
    >
      <div className={`flex-1 ${align === "right" ? "text-right" : "text-left"}`}>
        <p className="font-mk-display text-base font-600 leading-snug text-mk-ink">{c.title}</p>
        <p className="mt-0.5 text-xs text-mk-ink-subtle">{c.note}</p>
      </div>
      <span aria-hidden="true" className="mk-leader h-0.5 w-16 shrink-0 xl:w-28" />
      <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-mk-green-400" />
    </motion.div>
  );
}

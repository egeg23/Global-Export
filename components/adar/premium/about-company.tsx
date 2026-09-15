"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { CountUp } from "@/components/adar/premium/count-up";
import { Shell } from "@/components/adar/ui/shell";
import { company, founderNote, milestones } from "@/content/adar/company";

/**
 * Блок «О компании».
 *
 * На нынешнем сайте это сплошной текст на случайной подложке. Здесь у него
 * появляется структура: слева — как всё начиналось, справа — две фотографии,
 * которые на прокрутке расходятся в разные стороны, ниже — три вехи с
 * цифрами, и в конце их собственная фраза про жемчужину.
 *
 * Фон — на тон светлее соседних экранов: раздел должен читаться отдельной
 * страницей истории, а не продолжением каталога.
 */
export function AboutCompany() {
  const frame = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ["start end", "end start"],
  });

  // Фотографии едут навстречу друг другу — именно расхождение планов, а не
  // общий сдвиг, читается как глубина.
  const photoBig = useTransform(scrollYProgress, [0, 1], ["9%", "-9%"]);
  const photoSmall = useTransform(scrollYProgress, [0, 1], ["-16%", "16%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const markY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const markSpin = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  return (
    <section
      id="o-kompanii"
      ref={frame}
      className="relative isolate overflow-hidden border-y border-white/8 bg-adar-green-900 py-20 lg:py-28"
    >
      <motion.span
        aria-hidden="true"
        style={reduced ? undefined : { y: markY, rotate: markSpin }}
        className="adar-logo-mark pointer-events-none absolute -left-[22%] top-[18%] -z-10 w-[70vw] opacity-[0.07] lg:-left-[10%] lg:w-[34vw]"
      />

      <Shell size="wide" className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <motion.div
          style={reduced ? undefined : { y: textY }}
          className="lg:col-span-6"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-adar-gold-300">
            О компании
          </p>
          <h2 className="mt-6 text-balance font-adar-display text-[2.4rem] leading-[1.05] text-adar-cream-50 sm:text-[2.9rem] xl:text-5xl">
            Маленький шаг для комбината.
            <br />
            <span className="adar-gold-text">Гигантский скачок для ADAR.</span>
          </h2>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-adar-cream-50/75">
            {company.about}
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-adar-cream-50/75">
            Работаем с производителями напрямую, держим на складе больше ста
            видов упаковки и собираем набор под список заказчика, если готового
            в каталоге не нашлось.
          </p>

          <figure className="mt-9 border-l-2 border-adar-gold-500/70 pl-6">
            <blockquote className="font-adar-display text-xl leading-snug text-adar-cream-50/90 sm:text-2xl">
              «{founderNote}»
            </blockquote>
            <figcaption className="mt-3 text-xs uppercase tracking-[0.2em] text-adar-cream-50/55">
              Основатель компании
            </figcaption>
          </figure>
        </motion.div>

        {/* Две фотографии на разных скоростях */}
        <div className="relative lg:col-span-6">
          <motion.div
            style={reduced ? undefined : { y: photoBig }}
            className="overflow-hidden rounded-adar-lg border border-white/10"
          >
            <Image
              src="/adar/photos/chocolate-line-1.webp"
              alt="Упакованные подарки ADAR под ёлкой"
              width={1800}
              height={1125}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            style={reduced ? undefined : { y: photoSmall }}
            // Размеры заданы долями большой фотографии, а не пикселями: иначе
            // на одних экранах карточка наезжала на строку слогана, а на
            // других висела в воздухе.
            className="absolute -bottom-[16%] left-2 top-[56%] aspect-[3/4] overflow-hidden rounded-adar border border-white/15 shadow-[0_30px_60px_rgba(0,0,0,0.55)] lg:-left-10"
          >
            <Image
              src="/adar/photos/kids-box.webp"
              alt="Детский новогодний набор в коробке"
              fill
              sizes="(max-width: 1024px) 30vw, 15vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </Shell>

      {/* Три вехи */}
      <Shell size="wide" className="mt-28 lg:mt-24">
        <ol className="grid border-t border-white/10 sm:grid-cols-3">
          {milestones.map((step) => (
            <li
              key={step.kicker}
              className="border-white/10 pt-8 sm:border-l sm:pl-8 sm:first:border-l-0 sm:first:pl-0 [&:not(:first-child)]:mt-8 sm:[&:not(:first-child)]:mt-0"
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-adar-gold-300">
                {step.kicker}
              </p>
              <p className="mt-5 font-adar-display text-4xl leading-none text-adar-gold-400 tabular-nums xl:text-5xl">
                {step.prefix}
                <CountUp to={step.value} plain={step.plain} />
              </p>
              <p className="mt-3 max-w-[15rem] text-sm text-adar-cream-50">{step.caption}</p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-adar-cream-50/70">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </Shell>

      {/* Их собственная фраза — финал раздела */}
      <Shell className="mt-20 text-center lg:mt-24">
        <p className="font-adar-display text-2xl leading-snug text-adar-cream-50/90 sm:text-3xl">
          <span aria-hidden="true" className="adar-gold-text">
            «
          </span>
          {company.quote}
          <span aria-hidden="true" className="adar-gold-text">
            »
          </span>
        </p>
      </Shell>
    </section>
  );
}

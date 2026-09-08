"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";

import { formatNumber } from "@/lib/adar/format";
import { cn } from "@/lib/cn";
import type { GiftSet } from "@/lib/adar/types";

type Props = {
  rows: GiftSet[][];
  className?: string;
};

/**
 * Лента наборов, которая слушает прокрутку.
 *
 * В покое едет сама, медленно. Стоит крутить страницу — ускоряется и
 * наклоняется в ту же сторону; прокрутка вверх разворачивает её назад.
 * Тот же приём, что делает витрину «живой» у дорогих сайтов, только
 * собран из их собственных фотографий.
 */
export function VelocityRail({ rows, className }: Props) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-label="Лента наборов"
      className={cn("overflow-hidden bg-adar-green-950 py-14", className)}
    >
      <div className="flex flex-col gap-6">
        {rows.map((row, index) => (
          <Row
            key={index}
            sets={row}
            speed={index % 2 === 0 ? 2.4 : -1.8}
            frozen={Boolean(reduced)}
          />
        ))}
      </div>
    </section>
  );
}

function Row({ sets, speed, frozen }: { sets: GiftSet[]; speed: number; frozen: boolean }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  // Множитель скорости: спокойная прокрутка почти не влияет, резкая —
  // разгоняет ленту в несколько раз.
  const factor = useTransform(smooth, [-2200, 0, 2200], [-4, 0, 4], { clamp: false });
  const skew = useTransform(smooth, [-2200, 0, 2200], [-6, 0, 6], { clamp: true });

  // Лента дублируется дважды, поэтому оборачивать нужно на половине ширины.
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (frozen) return;

    const current = factor.get();
    if (current < 0) direction.current = -1;
    else if (current > 0) direction.current = 1;

    let moveBy = direction.current * speed * (delta / 1000);
    moveBy += direction.current * moveBy * Math.abs(current);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <motion.div style={frozen ? undefined : { x, skewX: skew }} className="flex w-max">
      {[0, 1].map((copy) => (
        <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-end gap-6 pr-6">
          {sets.map((set) => (
            <li
              key={`${copy}-${set.slug}`}
              className="group flex w-44 shrink-0 flex-col items-center sm:w-52"
            >
              <Image
                src={set.image}
                alt={set.name}
                width={320}
                height={320}
                className="h-36 w-auto object-contain sm:h-44"
              />
              <p className="mt-4 text-center text-xs leading-snug text-adar-cream-50/60">
                {set.name}
              </p>
              <p className="mt-1 text-sm tabular-nums text-adar-gold-400">
                {formatNumber(set.price)}
              </p>
            </li>
          ))}
        </ul>
      ))}
    </motion.div>
  );
}

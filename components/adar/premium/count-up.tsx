"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

import { formatNumber } from "@/lib/adar/format";

/**
 * Число, которое досчитывается до своего значения, когда доезжает до экрана.
 *
 * Значение пишется прямо в textContent, минуя состояние React: иначе на
 * каждый кадр анимации перерисовывается поддерево, а тут их шестьдесят
 * в секунду на каждую цифру.
 */
export function CountUp({
  to,
  duration = 1.6,
  /** Год пишется без разделителя разрядов: «2011», а не «2 011». */
  plain = false,
}: {
  to: number;
  duration?: number;
  plain?: boolean;
}) {
  const show = useCallback(
    (value: number) => (plain ? String(value) : formatNumber(value)),
    [plain],
  );
  const node = useRef<HTMLSpanElement>(null);
  const inView = useInView(node, { once: true, margin: "0px 0px -20% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = node.current;
    if (!element) return;

    if (!inView || reduced) {
      // Пока блок не на экране, стоит конечное значение: страница без
      // сценариев и с отключёнными анимациями показывает цифру, а не ноль.
      element.textContent = show(to);
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        element.textContent = show(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [duration, inView, reduced, show, to]);

  return <span ref={node}>{show(to)}</span>;
}

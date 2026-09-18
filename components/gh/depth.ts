"use client";

import { useEffect, useRef } from "react";

/**
 * Глубина: слой отстаёт от прокрутки и уводится от курсора.
 *
 * На gh.uz движения нет вовсе — страница просто пролистывается. Здесь глубина
 * двойная и работает на обоих устройствах: прокрутка двигает слои с разной
 * скоростью (это единственное, что есть на телефоне), а на компьютере
 * добавляется указатель — кадр и текст расходятся от курсора в разные
 * стороны.
 *
 * Оба сдвига пишутся в переменные узла, а не в состояние React: шестьдесят
 * перерисовок в секунду ради двух чисел — верный способ уронить телефон.
 *
 * `depth` — на сколько пикселей слой уезжает за экран прокрутки.
 */
export function useDepth<T extends HTMLElement = HTMLDivElement>(depth: number) {
  const ref = useRef<T>(null);
  const frame = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      frame.current = 0;
      const box = node.getBoundingClientRect();
      const height = Math.max(box.height, 1);
      // 0 — верх слоя только вошёл в кадр, 1 — слой полностью ушёл вверх.
      const progress = Math.min(Math.max(-box.top / height, -1), 1);
      node.style.setProperty("--p", progress.toFixed(4));
      node.style.setProperty("--shift", `${(progress * depth).toFixed(1)}px`);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(update);
    };

    // Только мышь: палец на экране двигает страницу, а не кадр.
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = node.getBoundingClientRect();
      node.style.setProperty("--mx", ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
      node.style.setProperty("--my", ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
    };
    const onLeave = () => {
      node.style.setProperty("--mx", "0");
      node.style.setProperty("--my", "0");
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    node.addEventListener("pointermove", onPointer);
    node.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      node.removeEventListener("pointermove", onPointer);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [depth]);

  return ref;
}

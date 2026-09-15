"use client";

import { useCallback, useEffect, useRef } from "react";

import { Container } from "@/components/ui/container";

import { Skyline } from "./skyline";
import { directions } from "./theme";

/**
 * Обложка вкладки с параллаксом.
 *
 * Прокрутка страницы пишется в одну переменную `--mv-p`, указатель — в
 * `--mv-mx`; слои силуэтов внутри `<Skyline />` читают их сами и разъезжаются
 * с разной скоростью. Никакой библиотеки анимации: один слушатель прокрутки,
 * прижатый к кадру через requestAnimationFrame, и он же отключается при
 * `prefers-reduced-motion`.
 */
export function MaveraHero() {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      frame.current = 0;
      const box = node.getBoundingClientRect();
      // 0 — обложка целиком в кадре, 1 — ушла вверх на свою высоту.
      const progress = Math.min(Math.max(-box.top / Math.max(box.height, 1), 0), 1);
      node.style.setProperty("--mv-p", progress.toFixed(3));
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = event.currentTarget;
    node.style.setProperty(
      "--mv-mx",
      ((event.clientX - node.getBoundingClientRect().left) / node.offsetWidth - 0.5).toFixed(3),
    );
  }, []);

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={(event) => event.currentTarget.style.setProperty("--mv-mx", "0")}
      style={directions[0].vars as React.CSSProperties}
      className="relative isolate flex min-h-[78svh] items-end overflow-hidden border-b border-sand-50/10 bg-[var(--mv-bg)]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Skyline depth={1.6} />
      </div>
      {/* Затемнение снизу, чтобы текст лёг на силуэты без подложки. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--mv-bg)] via-[var(--mv-bg)]/55 to-transparent"
      />

      <Container className="relative py-16 lg:py-20">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[var(--mv-accent)]">
          Новый клиент · MAVERA
        </p>
        <h1
          className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6.5vw,5rem)] leading-[1.02] text-[var(--mv-text)]"
          style={{
            transform: "translate3d(0, calc(var(--mv-p, 0) * -40px), 0)",
            opacity: "calc(1 - var(--mv-p, 0) * 0.85)",
          }}
        >
          Два направления
          <br />
          для сайта застройщика
        </h1>
        <p
          className="mt-7 max-w-2xl text-base leading-relaxed text-[var(--mv-muted)] sm:text-lg"
          style={{ transform: "translate3d(0, calc(var(--mv-p, 0) * -22px), 0)" }}
        >
          Шесть страниц из брифа, собранные как рабочая вёрстка, а не картинки.
          Тумблер переключает оформление целиком, любой макет разворачивается и
          листается — на десктопе и на телефоне.
        </p>
      </Container>
    </section>
  );
}

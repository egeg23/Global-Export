"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type Variant = "rise" | "slide" | "zoom" | "tilt" | "fade";

/**
 * Появление блока при прокрутке. Один наблюдатель на элемент, срабатывает
 * один раз. Движение у каждого блока своё (`variant`) — страница не должна
 * «выезжать снизу» целиком одним и тем же жестом.
 */
export function In({
  children,
  variant = "rise",
  index = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  variant?: Variant;
  /** Номер в ряду — задержка каскада. */
  index?: number;
  className?: string;
  as?: "div" | "li" | "section" | "figure" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  // Состояние в React, а не класс руками: блок перерисовывается, когда
  // конструктор читает набор из адреса, и класс, поставленный мимо React,
  // слетел бы вместе со старым className.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} data-in={variant} style={{ "--i": index } as React.CSSProperties} className={cn("cf-in", shown && "is-in", className)}>
      {children}
    </Tag>
  );
}

/**
 * Прокрутка страницы как одна подписка на весь мир: слои параллакса и сцены
 * читают её в requestAnimationFrame, а не каждый в своём обработчике.
 */
type Listener = () => void;
const listeners = new Set<Listener>();
let frame = 0;

function tick() {
  frame = 0;
  for (const listener of listeners) listener();
}

function schedule() {
  if (!frame) frame = window.requestAnimationFrame(tick);
}

export function onScrollFrame(listener: Listener): () => void {
  if (listeners.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  listeners.add(listener);
  listener();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  };
}

export function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Слой параллакса: сдвигается медленнее или быстрее прокрутки. Мышь сквозь
 * него проходит (`pointer-events: none`), на сенсоре не мешает жестам, при
 * «уменьшить движение» стоит на месте.
 */
export function Parallax({
  children,
  speed = 0.2,
  className,
}: {
  children: React.ReactNode;
  /** Доля прокрутки: 0.2 — отстаёт, −0.2 — обгоняет. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion()) return;
    return onScrollFrame(() => {
      const rect = node.parentElement?.getBoundingClientRect();
      if (!rect || rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  }, [speed]);

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none will-change-transform", className)}>
      {children}
    </div>
  );
}

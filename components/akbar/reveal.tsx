"use client";

import { useEffect, useRef, type ElementType } from "react";

/**
 * Появление блока при прокрутке — медленное, снизу вверх, как открывается
 * тяжёлое полотно.
 *
 * С сервера блок приходит видимым: без скриптов страница читается целиком.
 * Прятать его начинает только браузер и только если блок ниже экрана — то,
 * что человек уже видит, не мигает.
 */
export function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
  id,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    node.dataset.akReveal = "wait";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.style.transitionDelay = `${delay}ms`;
        node.dataset.akReveal = "in";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

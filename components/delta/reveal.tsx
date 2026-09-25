"use client";

import { useEffect, useRef, type ElementType } from "react";

/**
 * Появление блока при прокрутке — с отскоком, как у пластилина.
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
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    node.dataset.reveal = "wait";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.style.transitionDelay = `${delay}ms`;
        node.dataset.reveal = "in";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

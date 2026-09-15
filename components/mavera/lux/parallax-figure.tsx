"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

/**
 * Снимок, который едет медленнее страницы.
 *
 * Журнальный приём: кадр в рамке живёт своей жизнью, текст рядом идёт с
 * обычной скоростью, и разворот перестаёт быть плоским. Сдвиг пишется в
 * CSS-переменную рамки — на каждый кадр прокрутки нет ни перерисовки React,
 * ни чтения layout у других узлов.
 */
export function ParallaxFigure({
  src,
  alt,
  caption,
  className,
  imageClassName,
  depth = 40,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
  depth?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const update = useCallback(() => {
    frame.current = 0;
    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    // -1 — кадр только вошёл снизу, 1 — уже уходит вверх.
    const progress = ((box.top + box.height / 2) / viewport - 0.5) * -2;
    node.style.setProperty("--w-shift", `${(progress * depth).toFixed(1)}px`);
  }, [depth]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
  }, [update]);

  return (
    <figure ref={ref} className={cn("relative", className)}>
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("scale-[1.12] object-cover will-change-transform", imageClassName)}
          style={{ transform: "translate3d(0, var(--w-shift, 0px), 0) scale(1.12)" }}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs italic text-[var(--w-muted)]">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

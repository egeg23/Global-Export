"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export { onScrollFrame, reducedMotion } from "@/components/cf/motion";

type Variant = "rise" | "slide" | "zoom" | "tilt" | "drop" | "fade";

/**
 * Появление блока при прокрутке — один наблюдатель, срабатывает один раз.
 * Движение у блоков разное (`variant`), только transform и opacity; при
 * «уменьшить движение» блок просто стоит на месте (app/medacademy.css).
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
  index?: number;
  className?: string;
  as?: "div" | "li" | "section" | "figure" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} data-in={variant} style={{ "--i": index } as React.CSSProperties} className={cn("ma-in", shown && "is-in", className)}>
      {children}
    </Tag>
  );
}

/** Виден ли элемент — чтобы ставить на паузу то, что крутится вне экрана. */
export function useOnScreen<T extends Element>(margin = "120px") {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => setOn(entries.some((e) => e.isIntersecting)), { rootMargin: margin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);
  return [ref, on] as const;
}

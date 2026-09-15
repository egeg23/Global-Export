"use client";

import { useCallback, useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Появление при прокрутке, подчинённое миру.
 *
 * От витринного `<Reveal>` отличается тем, что длительность и кривая берутся
 * из токенов `data-world`: в «Стандарте» блок просто проявляется за 220 мс, в
 * «Люксе» всплывает за 600, в «Премиуме» — за 700 с кинематографичной кривой.
 * Один компонент, три разных ощущения.
 */
export function Rise({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "figure" | "header";
}) {
  const [shown, setShown] = useState(false);

  const attach = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={attach}
      className={cn("w-rise", shown && "w-rise-in", className)}
      style={delay ? ({ "--w-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Component>
  );
}

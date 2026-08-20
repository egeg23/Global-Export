"use client";

import { useCallback, useState } from "react";

import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger in milliseconds, applied via a CSS custom property. */
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "span";
};

/**
 * Fade-and-rise on first scroll into view.
 *
 * The transition itself lives in globals.css, so the only client-side cost is
 * one IntersectionObserver per element — no animation library, no layout
 * thrashing, and `prefers-reduced-motion` is handled by the stylesheet.
 *
 * The observer is attached from a ref callback rather than an effect, so it
 * starts watching the moment the node exists and tears itself down when React
 * detaches it.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const [visible, setVisible] = useState(false);

  const attach = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // Very old browser: show the content rather than hide it forever.
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={attach as never}
      className={cn("reveal", visible && "reveal-visible", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

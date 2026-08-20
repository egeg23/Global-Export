"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { process } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { t, type Locale } from "@/lib/i18n";

/** One photograph per stage, cycling through the imagery we have. */
const stageImages = [
  "/images/categories/beans.jpg",
  "/images/production.jpg",
  "/images/products/green-mung-beans.jpg",
  "/images/categories/dried-fruits.jpg",
  "/images/categories/organic.jpg",
  "/images/categories/dried-vegetables.jpg",
];

/**
 * The signature section of concept A: the imagery pins while the stages scroll
 * past it, so the field-to-container sequence reads as one continuous move.
 *
 * Built from `position: sticky` and one IntersectionObserver per stage — the
 * effect a scroll-animation library would be bought for, at no bundle cost and
 * with every stage present in the server-rendered HTML.
 */
export function ProcessJourney({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [active, setActive] = useState(0);
  const observers = useRef(new Map<number, IntersectionObserver>());

  const watch = useCallback(
    (index: number) => (node: HTMLLIElement | null) => {
      observers.current.get(index)?.disconnect();
      if (!node || typeof IntersectionObserver === "undefined") return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(index);
        },
        // Fires when a stage crosses the middle of the viewport.
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
      );

      observer.observe(node);
      observers.current.set(index, observer);
      return () => observer.disconnect();
    },
    [],
  );

  return (
    <section className="border-t border-sand-50/8 bg-[#0b0b0a] py-24 lg:py-32">
      <Container>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-harvest-300">
          {dict.home.processEyebrow}
        </p>
        <h2 className="mt-8 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] text-sand-50">
          {dict.home.processTitle}
        </h2>

        <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                {stageImages.slice(0, process.length).map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className={cn(
                      "object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      index === active
                        ? "scale-100 opacity-100"
                        : "scale-105 opacity-0",
                    )}
                  />
                ))}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0b0b0a]/70 to-transparent"
                />
                <span className="absolute bottom-6 left-6 font-display text-6xl text-sand-50/90">
                  {process[active]?.step}
                </span>
              </div>
            </div>
          </div>

          <ol className="lg:col-span-7">
            {process.map((step, index) => (
              <li
                key={step.step}
                ref={watch(index) as never}
                className={cn(
                  "border-t border-sand-50/10 py-10 transition-opacity duration-700 last:border-b",
                  index === active ? "opacity-100" : "opacity-45",
                )}
              >
                <div className="flex items-baseline gap-6">
                  <span
                    className={cn(
                      "font-display text-sm transition-colors duration-500",
                      index === active ? "text-harvest-300" : "text-sand-300/40",
                    )}
                  >
                    {step.step}
                  </span>
                  <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight text-sand-50">
                    {t(step.title, locale)}
                  </h3>
                </div>
                <p className="mt-4 max-w-xl pl-[3.25rem] text-base leading-relaxed text-sand-300/65">
                  {t(step.description, locale)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

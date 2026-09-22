"use client";

import Image from "next/image";
import { useState } from "react";

import { useStage } from "@/components/showcase/depth";
import { caption, photo, spots } from "@/content/nm/inside";
import { cn } from "@/lib/cn";

/**
 * Разбор кадра по узлам.
 *
 * Логотипы партнёров сами по себе ничего не доказывают — их у всех ряд.
 * Здесь тот же список привязан к месту: точка на ящике рассказывает про
 * ящик. Точка — обычная кнопка с `aria-pressed`, поэтому разбор
 * проходится с клавиатуры и читается голосом, а не только мышью.
 *
 * Кадр под точками живёт своей глубиной, но точки едут вместе с ним:
 * иначе подпись показывала бы не на тот ящик.
 */
export function Inside() {
  const [active, setActive] = useState(spots[0].id);
  const stage = useStage<HTMLDivElement>();
  const spot = spots.find((item) => item.id === active) ?? spots[0];

  return (
    <div ref={stage} className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-12">
      <figure className="m-0">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[var(--w-radius-lg)] bg-[var(--w-paper)]">
          <Image
            src={`/images/nm/${photo}.webp`}
            alt="Кухня фабрики: остров, витрины и встроенная техника"
            fill
            sizes="(max-width: 1024px) 100vw, 62vw"
            style={{ "--w-depth": "56px" } as React.CSSProperties}
            className="w-layer scale-[1.06] object-cover"
          />

          {spots.map((item) => {
            const on = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                onMouseEnter={() => setActive(item.id)}
                aria-pressed={on}
                aria-label={`${item.title}: ${item.brand}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                <span
                  className={cn(
                    "nm-spot grid size-7 place-items-center rounded-full border-2 transition-all sm:size-8",
                    on
                      ? "border-[var(--nm-champagne)] bg-[var(--nm-teal)] scale-110"
                      : "border-white/80 bg-[var(--nm-teal-deep)]/60 backdrop-blur-sm hover:scale-110",
                  )}
                  data-on={on ? "" : undefined}
                >
                  <span className="block size-2 rounded-full bg-[var(--nm-champagne)]" />
                </span>
              </button>
            );
          })}
        </div>

        <figcaption className="mt-4 text-[0.8rem] leading-relaxed text-[var(--w-muted)]">
          {caption}
        </figcaption>
      </figure>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div
          aria-live="polite"
          className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)]"
        >
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
            {spot.brand}
          </p>
          <h3 className="mt-3 text-[1.25rem] text-[var(--nm-teal)]">{spot.title}</h3>
          <p className="mt-4 text-[0.9rem] leading-relaxed text-[var(--w-muted)]">{spot.text}</p>
        </div>

        <ul className="mt-4 grid gap-1.5">
          {spots.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActive(item.id)}
                aria-pressed={item.id === active}
                className={cn(
                  "w-full cursor-pointer rounded-[var(--w-radius)] border px-4 py-2.5 text-left text-[0.84rem] transition-colors",
                  item.id === active
                    ? "border-[var(--nm-teal)] bg-[var(--nm-teal-soft)] text-[var(--w-ink)]"
                    : "border-transparent text-[var(--w-muted)] hover:border-[var(--w-line)]",
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

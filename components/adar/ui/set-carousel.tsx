"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Shell } from "@/components/adar/ui/shell";
import { formatPrice, formatWeight } from "@/lib/adar/format";
import { cn } from "@/lib/cn";
import type { GiftSet } from "@/lib/adar/types";

type Props = {
  sets: GiftSet[];
  title: string;
  note?: string;
  tone?: "light" | "dark";
  onPick: (set: GiftSet) => void;
};

/**
 * Лента наборов, которую можно крутить руками.
 *
 * Сама по себе она едет медленно вправо, но это не украшение: под курсором,
 * под пальцем и при перетаскивании движение останавливается, и лента
 * становится обычной полосой прокрутки со скольжением по карточкам. Клик по
 * набору открывает карточку с составом.
 *
 * Прокрутка — родная, со `scroll-snap`: колесо, трекпад, свайп и клавиатура
 * работают потому, что это настоящий скролл-контейнер, а не пересчёт
 * `transform` на каждый кадр.
 */
export function SetCarousel({ sets, title, note, tone = "light", onPick }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const dark = tone === "dark";

  // Отличает перетаскивание от клика: если палец проехал больше нескольких
  // пикселей, отпускание не должно открывать карточку.
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });

  const step = useCallback((direction: 1 | -1) => {
    const node = track.current;
    if (!node) return;
    const card = node.querySelector("li");
    const width = card ? card.getBoundingClientRect().width + 16 : node.clientWidth * 0.8;
    node.scrollBy({ left: direction * width, behavior: "smooth" });
  }, []);

  // Собственный ход ленты. Останавливается, когда посетитель к ней
  // прикоснулся, и не запускается вовсе при отключённых анимациях.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      const node = track.current;
      if (!node) return;
      const end = node.scrollWidth - node.clientWidth - 4;
      if (node.scrollLeft >= end) node.scrollTo({ left: 0, behavior: "smooth" });
      else step(1);
    }, 3200);

    return () => window.clearInterval(id);
  }, [paused, step]);

  return (
    <section
      aria-label={title}
      className={cn("py-16 lg:py-20", dark ? "bg-adar-green-950" : "bg-adar-cream-100/70")}
    >
      <Shell size="wide" className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2
            className={cn(
              "font-adar-display text-3xl leading-tight sm:text-4xl",
              dark ? "text-adar-cream-50" : "text-adar-green-950",
            )}
          >
            {title}
          </h2>
          {note ? (
            <p
              className={cn(
                "mt-3 max-w-xl text-sm leading-relaxed",
                dark ? "text-adar-cream-50/55" : "text-adar-ink-muted",
              )}
            >
              {note}
            </p>
          ) : null}
        </div>

        <div className="flex gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => step(direction)}
              className={cn(
                "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-colors",
                dark
                  ? "border-white/15 text-adar-cream-50 hover:border-adar-gold-500 hover:text-adar-gold-400"
                  : "border-adar-green-900/15 text-adar-green-900 hover:border-adar-green-900/40",
              )}
            >
              <span className="sr-only">{direction === -1 ? "Назад" : "Вперёд"}</span>
              <span aria-hidden="true">{direction === -1 ? "←" : "→"}</span>
            </button>
          ))}
        </div>
      </Shell>

      <ul
        ref={track}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onPointerDown={(event) => {
          const node = track.current;
          if (!node || event.pointerType === "touch") return;
          // Захват указателя здесь не ставится намеренно: он переадресует на
          // ленту и клик тоже, и нажатие на набор перестаёт открывать карточку.
          drag.current = {
            active: true,
            startX: event.clientX,
            startLeft: node.scrollLeft,
            moved: 0,
          };
          setPaused(true);
        }}
        onPointerMove={(event) => {
          const node = track.current;
          if (!node || !drag.current.active) return;
          const dx = event.clientX - drag.current.startX;
          drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
          node.scrollLeft = drag.current.startLeft - dx;
        }}
        onPointerUp={() => {
          drag.current.active = false;
        }}
        onPointerLeave={() => {
          drag.current.active = false;
        }}
        onPointerCancel={() => {
          drag.current.active = false;
        }}
        className={cn(
          "mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-10",
          // Курсор переключается состоянием :active, а не значением ref:
          // читать ref во время отрисовки нельзя, а нажатие браузер и так знает.
          "[scrollbar-width:thin] cursor-grab active:cursor-grabbing",
        )}
      >
        {sets.map((set) => (
          <li key={set.slug} className="w-52 shrink-0 snap-start sm:w-60">
            <button
              type="button"
              onClick={() => {
                // Отпускание после перетаскивания — не выбор набора.
                if (drag.current.moved > 6) return;
                onPick(set);
              }}
              className={cn(
                "group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-adar border text-left transition-colors duration-300",
                dark
                  ? "border-white/10 bg-white/[0.03] hover:border-adar-gold-500/40"
                  : "border-adar-green-900/10 bg-adar-cream-50 hover:border-adar-green-900/30",
              )}
            >
              <span className={cn("block aspect-square", dark ? "bg-white/[0.03]" : "bg-white")}>
                <Image
                  src={set.image}
                  alt=""
                  width={360}
                  height={360}
                  draggable={false}
                  className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              </span>

              <span className="flex flex-1 flex-col gap-2 p-4">
                <span
                  className={cn(
                    "text-[0.6rem] font-medium uppercase tracking-[0.14em]",
                    dark ? "text-adar-gold-400" : "text-adar-green-700",
                  )}
                >
                  {set.lineLabel}
                </span>
                <span
                  className={cn(
                    "text-sm leading-snug",
                    dark ? "text-adar-cream-50" : "text-adar-ink",
                  )}
                >
                  {set.name}
                </span>
                <span
                  className={cn(
                    "mt-auto flex items-baseline justify-between gap-2 text-sm",
                    dark ? "text-adar-cream-50/50" : "text-adar-ink-subtle",
                  )}
                >
                  <span
                    className={cn(
                      "font-medium tabular-nums",
                      dark ? "text-adar-gold-400" : "text-adar-green-800",
                    )}
                  >
                    {formatPrice(set.price)}
                  </span>
                  <span className="tabular-nums">{formatWeight(set.weight)}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Shell size="wide">
        <p
          className={cn(
            "mt-2 text-xs",
            dark ? "text-adar-cream-50/35" : "text-adar-ink-subtle",
          )}
        >
          Листайте мышью, пальцем или стрелками — нажмите на набор, чтобы
          увидеть состав.
        </p>
      </Shell>
    </section>
  );
}

"use client";

import { useState } from "react";

import { useStage } from "@/components/showcase/depth";
import { useT } from "@/components/tt/lang";
import { caption, nodes } from "@/content/tt/datacenter";
import { cn } from "@/lib/cn";

/**
 * Разбор ЦОД Tier 3.
 *
 * На их сайте про дата-центры сказано одной фразой — «соответствуют
 * стандартам надёжности Tier 3». Фраза верная и ничего не объясняет, а
 * платят именно за то, что за ней стоит. Здесь та же фраза разобрана по
 * узлам: два ввода питания, резерв охлаждения, резерв каналов.
 *
 * Схема нарисована, а не сфотографирована, и подписана как схема:
 * планировку конкретной площадки показывают на встрече, и выдавать
 * рисунок за их зал было бы обманом.
 */
export function DataCenter() {
  const t = useT();
  const [active, setActive] = useState(nodes[0].id);
  const stage = useStage<HTMLDivElement>();
  const node = nodes.find((item) => item.id === active) ?? nodes[0];

  return (
    <div
      ref={stage}
      className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12"
    >
      <figure className="tt-grid m-0 overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-paper)] p-4 sm:p-6">
        <svg viewBox="0 0 100 100" className="w-full" role="presentation">
          {/* Контур зала: два кольца питания и ряд стоек. */}
          <rect
            x="8"
            y="10"
            width="84"
            height="82"
            rx="3"
            className="tt-dc__room"
          />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={26 + i * 13}
              y="52"
              width="8"
              height="22"
              rx="1"
              className="tt-dc__rack"
            />
          ))}
          <path d="M16 26H84" className="tt-dc__bus" />
          <path d="M16 26V52M84 26V52" className="tt-dc__bus" />

          {nodes.map((item) => (
            <g
              key={item.id}
              className={cn("tt-dc__node", item.id === active && "is-on")}
              onMouseEnter={() => setActive(item.id)}
            >
              <circle cx={item.x} cy={item.y} r="6" className="tt-dc__halo" />
              <circle cx={item.x} cy={item.y} r="2.6" className="tt-dc__dot" />
              <circle
                cx={item.x}
                cy={item.y}
                r="9"
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={`${t(item.title)}: ${t(item.spec)}`}
                onFocus={() => setActive(item.id)}
                onClick={() => setActive(item.id)}
                className="cursor-pointer outline-none focus-visible:stroke-[var(--w-accent)] focus-visible:[stroke-width:1.5]"
              />
            </g>
          ))}
        </svg>

        <figcaption className="mt-4 text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
          {t(caption)}
        </figcaption>
      </figure>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div
          aria-live="polite"
          className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)]"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="tt-signal">{t({ ru: "Узел", kk: "Түйін" })}</p>
            <p className="tt-figure text-[0.9rem] text-[var(--w-accent)]">{t(node.spec)}</p>
          </div>
          <h3 className="mt-3 font-[family-name:var(--w-display)] text-[1.3rem] font-bold text-[var(--w-ink)]">
            {t(node.title)}
          </h3>
          <p className="mt-4 text-[0.9rem] leading-relaxed text-[var(--w-muted)]">{t(node.text)}</p>
        </div>

        <ul className="mt-4 grid gap-1.5">
          {nodes.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActive(item.id)}
                aria-pressed={item.id === active}
                className={cn(
                  "flex w-full cursor-pointer items-baseline justify-between gap-3 rounded-[var(--w-radius)] border px-4 py-2.5 text-left text-[0.84rem] transition-colors",
                  item.id === active
                    ? "border-[var(--w-accent)] bg-[var(--w-accent-soft)] text-[var(--w-ink)]"
                    : "border-transparent text-[var(--w-muted)] hover:border-[var(--w-line)]",
                )}
              >
                <span>{t(item.title)}</span>
                <span className="tt-figure text-[0.76rem] opacity-70">{t(item.spec)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

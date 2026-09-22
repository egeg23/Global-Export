"use client";

import { useEffect, useId, useState } from "react";

import { money } from "@/components/present/mavera/theme";
import { growthPct, type ForecastPoint } from "@/content/mavera/forecast";
import { cn } from "@/lib/cn";

/**
 * График прогноза цены по годам — одна линия, без библиотек.
 *
 * Одна серия, поэтому без легенды: имя серии — заголовок. Линия тонкая,
 * точки крупнее линии, подписаны только первая и последняя точки, сетка
 * отступает в фон. Наведение показывает год и цену. Под графиком — таблица
 * тех же чисел: для программ чтения с экрана и для тех, кто не верит линиям.
 * Цвет берётся из палитры мира, поэтому график одинаково живёт на слоновой
 * кости «Премиума» и на чёрном «Noir».
 */
export function PriceForecast({
  points,
  title,
  note = "Прогноз по стадии стройки и средней динамике района за 2021–2025. Не гарантия: рынок может пойти иначе.",
  compact = false,
  className,
}: {
  points: ForecastPoint[];
  title: string;
  note?: string;
  compact?: boolean;
  className?: string;
}) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  // Линия рисуется после первого кадра: стоящий график выглядит таблицей.
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, [points]);

  const W = 640;
  const H = compact ? 200 : 250;
  const padX = 14;
  const padTop = 34;
  const padBottom = 30;
  const prices = points.map((point) => point.priceUsd);
  const min = Math.min(...prices) * 0.94;
  const max = Math.max(...prices) * 1.02;
  const x = (index: number) => padX + (index * (W - padX * 2)) / Math.max(points.length - 1, 1);
  const y = (value: number) => padTop + (1 - (value - min) / Math.max(max - min, 1)) * (H - padTop - padBottom);
  const line = points.map((point, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(point.priceUsd).toFixed(1)}`).join(" ");
  const areaPath = `${line} L${x(points.length - 1).toFixed(1)},${H - padBottom} L${x(0).toFixed(1)},${H - padBottom} Z`;
  const first = points[0];
  const last = points[points.length - 1];
  const growth = growthPct(points);
  const gridYs = [0.25, 0.5, 0.75].map((share) => padTop + share * (H - padTop - padBottom));
  const gridValues = gridYs.map((gy) => min + (1 - (gy - padTop) / (H - padTop - padBottom)) * (max - min));

  const onMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * W;
    let nearest = 0;
    for (let index = 1; index < points.length; index += 1) if (Math.abs(x(index) - px) < Math.abs(x(nearest) - px)) nearest = index;
    setHover(nearest);
  };

  return (
    <figure className={cn("relative", className)}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className={cn(compact ? "text-sm" : "text-lg")}>{title}</span>
        <span className="text-sm tabular-nums text-[var(--w-accent)]">
          +{growth.toFixed(0)}% к {last.year}
        </span>
      </figcaption>

      <div className="relative mt-3">
        <svg
          role="img"
          aria-label={`Прогноз стоимости: ${title}, с ${money(first.priceUsd, "uzs")} в ${first.year} до ${money(last.priceUsd, "uzs")} в ${last.year}`}
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-pan-y select-none"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--w-accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--w-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Сетка — отступает в фон; подписи слева, в тексте, не в цвете серии. */}
          {gridYs.map((gy, index) => (
            <g key={gy}>
              <line x1={padX} x2={W - padX} y1={gy} y2={gy} stroke="var(--w-line)" strokeWidth="1" />
              <text x={padX} y={gy - 5} fontSize="10" fill="var(--w-muted)">
                {money(Math.round(gridValues[index]), "uzs")}
              </text>
            </g>
          ))}

          <path d={areaPath} fill={`url(#${id}-fill)`} className={cn("transition-opacity duration-1000", drawn ? "opacity-100" : "opacity-0")} />
          <path
            d={line}
            fill="none"
            stroke="var(--w-accent)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={drawn ? 0 : 1}
            className="transition-[stroke-dashoffset] duration-[1400ms] ease-out motion-reduce:transition-none"
          />

          {/* Перекрестие наведения. */}
          {hover !== null ? (
            <line x1={x(hover)} x2={x(hover)} y1={padTop - 8} y2={H - padBottom} stroke="var(--w-muted)" strokeWidth="1" strokeDasharray="3 3" />
          ) : null}

          {points.map((point, index) => (
            <circle
              key={point.year}
              cx={x(index)}
              cy={y(point.priceUsd)}
              r={hover === index ? 5.5 : 4}
              fill="var(--w-accent)"
              stroke="var(--w-surface)"
              strokeWidth="2"
              className="transition-[r] duration-200"
            />
          ))}

          {/* Годы — под осью. */}
          {points.map((point, index) => (
            <text
              key={point.year}
              x={x(index)}
              y={H - 8}
              fontSize="11"
              textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
              fill={hover === index ? "var(--w-ink)" : "var(--w-muted)"}
            >
              {point.year}
            </text>
          ))}

          {/* Прямые подписи — только у первой и последней точки. Первая — под точкой:
              линия идёт вверх, и над точкой стоит подпись сетки. */}
          <text x={x(0)} y={y(first.priceUsd) + 20} fontSize="12" fill="var(--w-ink)" textAnchor="start">
            {money(first.priceUsd, "uzs")}
          </text>
          <text x={x(points.length - 1)} y={y(last.priceUsd) - 12} fontSize="12" fill="var(--w-ink)" textAnchor="end">
            {money(last.priceUsd, "uzs")}
          </text>
        </svg>

        {hover !== null ? (
          <div
            role="tooltip"
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 border border-[var(--w-line)] bg-[var(--w-surface)] px-3 py-2 text-xs shadow-[var(--w-shadow)]"
            style={{ left: `${(hover / Math.max(points.length - 1, 1)) * 100}%` }}
          >
            <span className="block text-[var(--w-muted)]">{points[hover].year}</span>
            <span className="block tabular-nums text-[var(--w-ink)]">{money(points[hover].priceUsd, "uzs")}</span>
            {hover > 0 ? (
              <span className="block tabular-nums text-[var(--w-accent)]">
                +{((points[hover].priceUsd / first.priceUsd - 1) * 100).toFixed(0)}% к {first.year}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-[var(--w-muted)]">{note}</p>

      <details className="mt-2 text-xs text-[var(--w-muted)]">
        <summary className="cursor-pointer">Таблицей</summary>
        <table className="mt-2 w-full border-collapse text-left tabular-nums">
          <thead>
            <tr className="border-b border-[var(--w-line)]">
              <th className="py-1 pr-4 font-normal">Год</th>
              <th className="py-1 font-normal">Цена</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.year} className="border-b border-[var(--w-line)]">
                <td className="py-1 pr-4">{point.year}</td>
                <td className="py-1 text-[var(--w-ink)]">{money(point.priceUsd, "uzs")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

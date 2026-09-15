"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

import { money, type CurrencyId } from "./theme";

/**
 * Два экрана, ради которых и берут «Премиум»: генплан и подбор квартиры.
 *
 * Они вынесены из `screens.tsx`, потому что в отличие от остальных макетов
 * по-настоящему работают — корпус выбирается, шахматка откликается. На защите
 * это и есть разница между «нарисовали» и «сделали»: у московских девелоперов
 * (Донстрой, Level, ПИК) ровно эти два экрана несут продажи.
 *
 * Статусы квартир считаются детерминированной функцией от этажа и номера, а не
 * случайно: сервер и клиент должны отрисовать одну и ту же шахматку.
 */

type Corpus = {
  id: string;
  /** Полигон в координатах генплана. */
  points: string;
  /** Точка подписи. */
  label: [number, number];
  floors: string;
  flats: string;
  status: "Сдан" | "Строится" | "Продаётся";
  due: string;
  /** Стартовая цена за квадратный метр, в долларах. */
  priceUsd: number;
};

const corpuses: Corpus[] = [
  { id: "1", points: "40,150 150,150 150,215 40,215", label: [95, 187], floors: "9", flats: "108", status: "Сдан", due: "Сдан в 2024", priceUsd: 870 },
  { id: "2", points: "40,230 150,230 150,300 40,300", label: [95, 269], floors: "12", flats: "144", status: "Сдан", due: "Сдан в 2025", priceUsd: 920 },
  { id: "3", points: "175,120 270,120 270,215 175,215", label: [222, 171], floors: "16", flats: "192", status: "Продаётся", due: "IV кв. 2026", priceUsd: 970 },
  { id: "4", points: "295,120 390,120 390,215 295,215", label: [342, 171], floors: "16", flats: "192", status: "Продаётся", due: "IV кв. 2026", priceUsd: 990 },
  { id: "5", points: "175,240 390,240 390,300 175,300", label: [282, 274], floors: "9", flats: "120", status: "Строится", due: "II кв. 2027", priceUsd: 1030 },
  { id: "6", points: "415,120 520,120 520,200 415,200", label: [467, 163], floors: "14", flats: "168", status: "Строится", due: "IV кв. 2027", priceUsd: 1050 },
  { id: "7", points: "415,225 520,225 520,300 415,300", label: [467, 266], floors: "14", flats: "156", status: "Строится", due: "II кв. 2028", priceUsd: 1050 },
];

const statusTone: Record<Corpus["status"], string> = {
  Сдан: "0.32",
  Продаётся: "0.9",
  Строится: "0.58",
};

export function Genplan({
  compact = false,
  live = false,
  currency,
}: {
  compact?: boolean;
  live?: boolean;
  currency: CurrencyId;
}) {
  const [activeId, setActiveId] = useState("3");
  const active = corpuses.find((corpus) => corpus.id === activeId) ?? corpuses[0];

  return (
    <div className={cn("gap-[1.2em]", compact ? "flex flex-col" : "grid grid-cols-[1.9fr_1fr]")}>
      <div className="overflow-hidden rounded-[0.7em] border border-[var(--mv-line)] bg-[var(--mv-raised)] transition-colors duration-500">
        <svg viewBox="0 95 560 245" className="h-full w-full" role="presentation">
          {/* Участок: зелень, проезды, парковка. */}
          <rect width="560" height="340" fill="var(--mv-raised)" />
          <g stroke="var(--mv-line)" strokeWidth="1.5" fill="none">
            <path d="M0 110 H560" />
            <path d="M162 110 V330" />
            <path d="M402 110 V330" />
            <path d="M0 315 H560" />
          </g>
          <g fill="var(--mv-accent)" opacity="0.08">
            <circle cx="282" cy="225" r="26" />
            <circle cx="120" cy="330" r="34" />
            <circle cx="470" cy="330" r="30" />
          </g>

          {corpuses.map((corpus) => {
            const selected = corpus.id === activeId;
            // В превью макет целиком лежит внутри кнопки «Развернуть», поэтому
            // корпуса там не интерактивны: кнопка внутри кнопки ломает разметку.
            const handlers = live
              ? {
                  role: "button",
                  tabIndex: 0,
                  "aria-label": `Корпус ${corpus.id}, ${corpus.status}`,
                  "aria-pressed": selected,
                  onClick: () => setActiveId(corpus.id),
                  onKeyDown: (event: React.KeyboardEvent<SVGGElement>) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveId(corpus.id);
                    }
                  },
                  className: "cursor-pointer",
                }
              : {};
            return (
              <g key={corpus.id} {...handlers}>
                <polygon
                  points={corpus.points}
                  fill="var(--mv-accent)"
                  fillOpacity={selected ? 1 : statusTone[corpus.status]}
                  stroke="var(--mv-text)"
                  strokeOpacity={selected ? 0.9 : 0}
                  strokeWidth="2"
                  className="transition-all duration-300 hover:[fill-opacity:0.95]"
                />
                <text
                  x={corpus.label[0]}
                  y={corpus.label[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  fontWeight="600"
                  fill="var(--mv-accent-ink)"
                  opacity={selected ? 1 : 0.75}
                  pointerEvents="none"
                >
                  {corpus.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="flex flex-col rounded-[0.7em] border border-[var(--mv-line)] bg-[var(--mv-surface)] p-[1.1em] transition-colors duration-500">
        <span className="text-[0.55em] uppercase tracking-[0.18em] text-[var(--mv-muted)]">
          Корпус {active.id}
        </span>
        <p className="mt-[0.5em] text-[1.3em] font-semibold leading-none text-[var(--mv-text)]">
          {active.status}
        </p>
        <p className="mt-[0.4em] text-[0.6em] text-[var(--mv-muted)]">{active.due}</p>

        <dl className="mt-[1em] flex flex-col gap-[0.6em] border-t border-[var(--mv-line)] pt-[0.9em]">
          {[
            { label: "Этажность", value: active.floors },
            { label: "Квартир", value: active.flats },
            { label: "Цена от", value: `${money(active.priceUsd, currency)} за м²` },
          ].map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-[0.6em]">
              <dt className="text-[0.58em] text-[var(--mv-muted)]">{row.label}</dt>
              <dd className="text-[0.75em] font-medium text-[var(--mv-text)]">{row.value}</dd>
            </div>
          ))}
        </dl>

        <span className="mt-[1em] flex items-center justify-center rounded-full bg-[var(--mv-accent)] py-[0.7em] text-[0.62em] font-medium text-[var(--mv-accent-ink)]">
          Выбрать квартиру
        </span>

        <div className="mt-[1em] flex flex-wrap gap-x-[0.9em] gap-y-[0.4em] border-t border-[var(--mv-line)] pt-[0.8em]">
          {(["Сдан", "Строится", "Продаётся"] as const).map((status) => (
            <span
              key={status}
              className="flex items-center gap-[0.35em] text-[0.52em] text-[var(--mv-muted)]"
            >
              <span
                className="h-[0.5em] w-[0.5em] rounded-[0.1em] bg-[var(--mv-accent)]"
                style={{ opacity: Number(statusTone[status]) }}
              />
              {status}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Подбор квартиры                                                     */
/* ------------------------------------------------------------------ */

const floors = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const perFloor = 12;

type FlatState = "free" | "booked" | "sold";

/** Один и тот же результат на сервере и в браузере — без Math.random. */
function flatState(floor: number, index: number): FlatState {
  const seed = Math.sin(floor * 12.9898 + index * 78.233) * 43758.5453;
  const value = seed - Math.floor(seed);
  if (value < 0.22) return "sold";
  if (value < 0.34) return "booked";
  return "free";
}

function rooms(index: number): number {
  return [1, 2, 3, 2, 1, 3, 4, 2, 1, 2, 3, 2][index % 12];
}

function area(floor: number, index: number): string {
  return (32 + rooms(index) * 16 + ((floor * 3 + index * 7) % 9)).toFixed(1).replace(".", ",");
}

const tone: Record<FlatState, string> = {
  free: "bg-[var(--mv-accent)]",
  booked: "bg-[var(--mv-accent)] opacity-40",
  sold: "bg-[var(--mv-faint)]",
};

/** Стартовая цена корпуса 3 за квадратный метр, в долларах. */
const pickerPriceUsd = 970;

export function Picker({
  compact = false,
  live = false,
  currency,
}: {
  compact?: boolean;
  live?: boolean;
  currency: CurrencyId;
}) {
  const [selected, setSelected] = useState<[number, number]>([11, 2]);
  const [floor, index] = selected;
  const state = flatState(floor, index);

  return (
    <div className="flex flex-col gap-[1em]">
      {/* Фильтры — как у Level Group: комнатность, площадь, этаж, срок. */}
      <div className="flex flex-wrap items-center gap-[0.5em]">
        {["1К", "2К", "3К", "4К"].map((room, roomIndex) => (
          <span
            key={room}
            className={cn(
              "rounded-full px-[0.9em] py-[0.35em] text-[0.6em] font-medium transition-colors duration-500",
              roomIndex === 2
                ? "bg-[var(--mv-accent)] text-[var(--mv-accent-ink)]"
                : "border border-[var(--mv-line)] text-[var(--mv-muted)]",
            )}
          >
            {room}
          </span>
        ))}
        <span className="rounded-full border border-[var(--mv-line)] px-[0.9em] py-[0.35em] text-[0.6em] text-[var(--mv-muted)]">
          32 — 120 м²
        </span>
        <span className="rounded-full border border-[var(--mv-line)] px-[0.9em] py-[0.35em] text-[0.6em] text-[var(--mv-muted)]">
          Этаж 2 — 16
        </span>
        <span className="ml-auto text-[0.58em] text-[var(--mv-muted)]">Найдено: 86</span>
      </div>

      <div className={cn("gap-[1.2em]", compact ? "flex flex-col" : "grid grid-cols-[1.6fr_1fr]")}>
        {/* Шахматка: строка — этаж, клетка — квартира. */}
        <div className="rounded-[0.7em] border border-[var(--mv-line)] bg-[var(--mv-surface)] p-[0.9em] transition-colors duration-500">
          <div className="flex flex-col gap-[0.3em]">
            {floors.map((row) => (
              <div key={row} className="flex items-center gap-[0.4em]">
                <span className="w-[1.4em] shrink-0 text-right text-[0.5em] text-[var(--mv-muted)]">
                  {row}
                </span>
                <div className="flex flex-1 gap-[0.3em]">
                  {Array.from({ length: perFloor }, (_, cell) => {
                    const cellState = flatState(row, cell);
                    const isSelected = row === floor && cell === index;
                    const look = cn(
                      "block h-[1.05em] flex-1 rounded-[0.15em] transition-all duration-200",
                      tone[cellState],
                      isSelected &&
                        "outline outline-[0.12em] outline-offset-[0.1em] outline-[var(--mv-text)]",
                    );

                    return live ? (
                      <button
                        key={cell}
                        type="button"
                        aria-label={`Этаж ${row}, квартира ${cell + 1}`}
                        aria-pressed={isSelected}
                        onClick={() => setSelected([row, cell])}
                        className={look}
                      />
                    ) : (
                      <span key={cell} className={look} />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[0.8em] flex flex-wrap gap-x-[0.9em] gap-y-[0.3em] border-t border-[var(--mv-line)] pt-[0.7em]">
            {[
              ["Свободна", "free"],
              ["Бронь", "booked"],
              ["Продана", "sold"],
            ].map(([label, key]) => (
              <span
                key={label}
                className="flex items-center gap-[0.35em] text-[0.52em] text-[var(--mv-muted)]"
              >
                <span className={cn("h-[0.5em] w-[0.5em] rounded-[0.1em]", tone[key as FlatState])} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Карточка выбранной квартиры с планировкой. */}
        <aside className="rounded-[0.7em] border border-[var(--mv-line)] bg-[var(--mv-surface)] p-[1.1em] transition-colors duration-500">
          <p className="text-[0.85em] font-medium text-[var(--mv-text)]">
            {rooms(index)}-комнатная, {area(floor, index)} м²
          </p>
          <p className="mt-[0.3em] text-[0.58em] text-[var(--mv-muted)]">
            Корпус 3 · {floor} этаж ·{" "}
            {state === "free" ? "свободна" : state === "booked" ? "бронь" : "продана"}
          </p>

          <div className="mt-[0.9em] rounded-[0.5em] border border-[var(--mv-line)] p-[0.6em]">
            <svg viewBox="0 0 200 150" className="h-full w-full" role="presentation">
              <g
                stroke="var(--mv-text)"
                strokeOpacity="0.55"
                strokeWidth="3"
                fill="var(--mv-text)"
                fillOpacity="0.09"
              >
                <rect x="10" y="10" width="110" height="80" />
                <rect x="120" y="10" width="70" height="45" />
                <rect x="120" y="55" width="70" height="35" />
                <rect x="10" y="90" width="70" height="50" />
                <rect x="80" y="90" width="110" height="50" />
              </g>
              <g stroke="var(--mv-accent)" strokeWidth="3" fill="none">
                <path d="M10 40 V70" />
                <path d="M190 100 V130" />
              </g>
            </svg>
          </div>

          <p className="mt-[0.9em] text-[1.1em] font-semibold leading-none text-[var(--mv-text)]">
            {money(Number(area(floor, index).replace(",", ".")) * pickerPriceUsd, currency)}
          </p>
          <p className="mt-[0.35em] text-[0.55em] text-[var(--mv-muted)]">
            Рассрочка 0% на 18 месяцев
          </p>

          <span className="mt-[0.9em] flex items-center justify-center rounded-full bg-[var(--mv-accent)] py-[0.7em] text-[0.62em] font-medium text-[var(--mv-accent-ink)]">
            Забронировать
          </span>
        </aside>
      </div>
    </div>
  );
}

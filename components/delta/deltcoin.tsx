"use client";

import { useId, useState } from "react";

import { deltcoin, type PrizeId } from "@/content/delta/school";
import { cn } from "@/lib/cn";

/**
 * Deltcoin — их собственная система поощрения, и она уже работает.
 *
 * Сколько монет дают за ответ, школа не публикует, поэтому здесь нет
 * «симулятора урока» с выдуманными ставками. Есть копилка: двигаете
 * ползунок — растёт стопка монет, и призы по их настоящим ценам загораются
 * по очереди. Ребёнку видно, к чему идти, родителю — зачем стараться.
 */

const MAX = 1000;

export function Deltcoin() {
  const [coins, setCoins] = useState(420);
  const id = useId();
  const next = deltcoin.prizes.find((p) => p.price > coins);

  return (
    <section id="deltcoin" className="relative overflow-hidden bg-dl-ink px-4 py-20 text-white sm:px-6 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, rgb(255 216 74 / 0.18), transparent 40%), radial-gradient(circle at 85% 70%, rgb(91 168 255 / 0.2), transparent 45%)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-[1240px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-lemon">Deltcoin</p>
          <h2 className="mt-3 font-dl-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            За старание — монеты. За монеты — настоящие призы.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{deltcoin.what}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">
            Чем активнее ребёнок на уроке, тем больше Deltcoin. Их не покупают и не дарят — только
            зарабатывают.
          </p>

          {/* Копилка */}
          <div className="dl-clay mt-9 bg-white p-6 text-dl-ink">
            <div className="flex items-end justify-between gap-4">
              <label htmlFor={id} className="text-sm font-extrabold">
                Сколько накопил ребёнок
              </label>
              <p className="font-dl-display text-4xl font-black tabular-nums leading-none text-dl-blue">
                {coins}
                <span className="ml-1 text-base font-extrabold text-dl-ink-muted">DC</span>
              </p>
            </div>
            <input
              id={id}
              type="range"
              min={0}
              max={MAX}
              step={10}
              value={coins}
              onChange={(e) => setCoins(Number(e.target.value))}
              className="dl-range mt-5 w-full"
              style={{ "--fill": `${(coins / MAX) * 100}%` } as React.CSSProperties}
            />
            <p className="mt-3 min-h-[1.5rem] text-sm font-bold text-dl-ink-muted" aria-live="polite">
              {next ? (
                <>
                  До приза «{next.name}» — ещё <span className="text-dl-ink">{next.price - coins} DC</span>
                </>
              ) : (
                <span className="text-dl-green-700">Хватает на любой приз из магазина!</span>
              )}
            </p>
          </div>
        </div>

        {/* Магазин */}
        <div className="relative">
          <CoinStack coins={coins} />
          <ul className="relative grid grid-cols-2 gap-4">
            {deltcoin.prizes.map((prize, i) => {
              const open = coins >= prize.price;
              return (
                <li
                  key={prize.id}
                  className={cn(
                    "dl-clay relative flex flex-col items-center p-5 text-center text-dl-ink transition-all duration-500",
                    open ? "bg-white" : "bg-white/85 grayscale-[0.7]",
                    i % 2 === 1 && "sm:translate-y-8",
                  )}
                >
                  <span
                    className={cn(
                      "absolute -top-3 right-3 rounded-full border-2 border-dl-ink px-2.5 py-0.5 text-xs font-extrabold transition-colors",
                      open ? "bg-dl-green text-white" : "bg-dl-paper text-dl-ink-muted",
                    )}
                  >
                    {open ? "Можно забрать" : "Копим"}
                  </span>
                  <div className={cn("h-24 w-24 transition-transform duration-500", open ? "scale-100" : "scale-90 opacity-70")}>
                    <PrizeArt id={prize.id} />
                  </div>
                  <p className="mt-3 font-dl-display text-base font-black leading-tight">{prize.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-extrabold text-dl-blue">
                    <Coin className="h-4 w-4" />
                    {prize.price} Deltcoin
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Стопка монет за магазином — растёт вместе с ползунком. */
function CoinStack({ coins }: { coins: number }) {
  const count = Math.round((coins / MAX) * 12);
  return (
    <div className="pointer-events-none absolute -left-10 bottom-0 hidden flex-col-reverse lg:flex" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="dl-pop -mt-3 block h-6 w-14 rounded-[50%] border-[3px] border-dl-ink bg-dl-yellow"
          style={{ transform: `translateX(${(i % 3) - 1}px)` }}
        />
      ))}
    </div>
  );
}

export function Coin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#FFD84A" stroke="#10214A" strokeWidth="2" />
      <path d="M12 6.5 L16.5 15.5 H7.5 Z" fill="none" stroke="#004AAD" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/** Призы нарисованы — на их фотографиях поверх лежат подписи с ценой. */
function PrizeArt({ id }: { id: PrizeId }) {
  const ink = "#10214A";
  if (id === "pad")
    return (
      <svg viewBox="0 0 96 96" className="h-full w-full">
        <rect x="10" y="26" width="76" height="48" rx="10" fill="#2B3A63" stroke={ink} strokeWidth="3" />
        <rect x="16" y="32" width="64" height="36" rx="7" fill="#3A4B7A" />
        <rect x="64" y="58" width="10" height="4" rx="2" fill="#5BA8FF" />
      </svg>
    );
  if (id === "speaker")
    return (
      <svg viewBox="0 0 96 96" className="h-full w-full">
        <ellipse cx="48" cy="70" rx="28" ry="7" fill="#10214A" opacity="0.15" />
        <circle cx="48" cy="46" r="26" fill="#E9EDF5" stroke={ink} strokeWidth="3" />
        <circle cx="48" cy="46" r="16" fill="#2B3A63" />
        <circle cx="48" cy="46" r="6" fill="#10214A" />
        <text x="48" y="30" textAnchor="middle" fontSize="8" fontWeight="900" fill={ink}>JBL</text>
      </svg>
    );
  if (id === "mouse")
    return (
      <svg viewBox="0 0 96 96" className="h-full w-full">
        <path d="M48 12 C66 12 72 30 72 50 C72 72 62 84 48 84 C34 84 24 72 24 50 C24 30 30 12 48 12 Z" fill="#2B3A63" stroke={ink} strokeWidth="3" />
        <path d="M48 12 V40" stroke="#5BA8FF" strokeWidth="3" />
        <rect x="45" y="22" width="6" height="10" rx="3" fill="#FFD84A" stroke={ink} strokeWidth="2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full">
      <rect x="36" y="6" width="24" height="18" rx="4" fill="#9AA6BF" stroke={ink} strokeWidth="3" />
      <rect x="36" y="72" width="24" height="18" rx="4" fill="#9AA6BF" stroke={ink} strokeWidth="3" />
      <rect x="24" y="20" width="48" height="56" rx="12" fill="#10214A" stroke={ink} strokeWidth="3" />
      <rect x="29" y="25" width="38" height="46" rx="8" fill="#004AAD" />
      <path d="M48 58 C40 52 34 47 38 41 C41 37 46 38 48 42 C50 38 55 37 58 41 C62 47 56 52 48 58 Z" fill="#E5322D" />
    </svg>
  );
}

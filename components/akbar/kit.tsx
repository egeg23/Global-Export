"use client";

import Image from "next/image";
import NumberFlow from "@number-flow/react";
import { useState } from "react";

/**
 * Допники конструктора двери: цена набора, рассрочка, подборка.
 *
 * Цены — для примера. Фабрика их не публикует, поэтому на макете стоит
 * правдоподобная сетка в сумах (покрытие, стекло, высота, комплект);
 * настоящий прайс подставляется из их базы. Так и подписано под итогом.
 */

const BASE: Record<string, number> = {
  Эмаль: 1_850_000,
  Ясень: 2_450_000,
  "Американский орех": 3_200_000,
};
const FALLBACK = 1_900_000;
const GLASS = 320_000;
const HEIGHT: Record<string, number> = { "2": 1, "2.4": 1.15, "2.7": 1.3, "3": 1.5 };
const PARTS: Record<string, { price: number; tall: boolean }> = {
  Коробка: { price: 420_000, tall: true },
  Наличники: { price: 360_000, tall: true },
  Фурнитура: { price: 290_000, tall: false },
};

const round = (value: number) => Math.round(value / 10_000) * 10_000;

export type KitPart = { label: string; price: number };

/** Цена набора для примера: полотно по покрытию и высоте, стекло, комплект. */
export function kitPrice({
  material,
  glass,
  height,
  kit,
}: {
  material: string;
  glass: boolean;
  height: string;
  kit: readonly string[];
}): { total: number; parts: KitPart[] } {
  const factor = HEIGHT[height] ?? 1;
  const leaf = round(((BASE[material] ?? FALLBACK) + (glass ? GLASS : 0)) * factor);
  const parts: KitPart[] = [{ label: "Полотно", price: leaf }];
  for (const name of kit) {
    const part = PARTS[name];
    if (part) parts.push({ label: name, price: round(part.tall ? part.price * factor : part.price) });
  }
  return { total: parts.reduce((sum, part) => sum + part.price, 0), parts };
}

const sum = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} сум`;

export function KitTotal({ total, parts }: { total: number; parts: KitPart[] }) {
  return (
    <div className="border-t border-ak-ivory/15 pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="ak-eyebrow text-ak-gold-300">Итого за комплект</p>
        <p className="font-ak-display text-4xl font-medium leading-none tabular-nums sm:text-5xl">
          <NumberFlow value={total} locales="ru-RU" /> <span className="text-xl text-ak-ivory/70">сум</span>
        </p>
      </div>
      <ul className="mt-3 grid gap-1 text-sm text-ak-ivory/65">
        {parts.map((part) => (
          <li key={part.label} className="flex justify-between gap-4">
            <span>{part.label}</span>
            <span className="tabular-nums">{sum(part.price)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ak-ivory/50">Цены для примера — на сайте их подставит прайс фабрики.</p>
    </div>
  );
}

const MONTHS = [3, 6, 12] as const;

export function Installment({ total, onApply }: { total: number; onApply: (note: string) => void }) {
  const [months, setMonths] = useState<(typeof MONTHS)[number]>(12);
  const monthly = Math.ceil(total / months / 1000) * 1000;
  return (
    <div className="rounded-2xl bg-ak-ivory/[0.06] p-4 ring-1 ring-ak-ivory/10 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold">Рассрочка Uzum Nasiya · Alif</p>
        <div role="group" aria-label="Срок рассрочки" className="flex gap-1.5">
          {MONTHS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={months === value}
              onClick={() => setMonths(value)}
              className={`min-h-10 rounded-full px-3.5 text-xs font-semibold transition-colors ${
                months === value ? "bg-ak-gold text-ak-ink" : "text-ak-ivory/70 ring-1 ring-ak-ivory/20 hover:text-ak-ivory"
              }`}
            >
              {value} мес.
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <p className="tabular-nums">
          <span className="font-ak-display text-3xl font-medium">
            <NumberFlow value={monthly} locales="ru-RU" />
          </span>{" "}
          <span className="text-sm text-ak-ivory/70">сум в месяц</span>
        </p>
        <button
          type="button"
          onClick={() => onApply(`рассрочка на ${months} мес., ${sum(monthly)} в месяц`)}
          className="min-h-11 rounded-full px-4 text-sm font-semibold text-ak-gold-300 ring-1 ring-ak-gold-300/50 transition-colors hover:bg-ak-gold-300 hover:text-ak-ink"
        >
          Оформить рассрочку
        </button>
      </div>
      <p className="mt-2 text-xs text-ak-ivory/50">Для примера без наценки — условия банка подставим из договора.</p>
    </div>
  );
}

export type Pick = { key: string; title: string; summary: string; thumb: string };

const SITE = "https://akbar-rich.uz";

/** Подборка: собранные двери копятся здесь и уходят одной ссылкой в Telegram. */
export function Favorites({ current }: { current: Pick }) {
  const [list, setList] = useState<Pick[]>([]);
  const saved = list.some((entry) => entry.key === current.key);
  const toggle = () =>
    setList((value) => (saved ? value.filter((entry) => entry.key !== current.key) : [...value, current].slice(-6)));
  const text = ["Моя подборка дверей Akbar Rich:", ...list.map((entry, index) => `${index + 1}. ${entry.summary}`)].join("\n");

  return (
    <div className="rounded-[1.75rem] border border-ak-ink/15 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="ak-eyebrow text-ak-muted">Подборка</p>
          <p className="mt-1 text-sm text-ak-muted">
            {list.length ? `Сохранено: ${list.length}` : "Соберите несколько дверей и сравните дома"}
          </p>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={saved}
          className={`ak-btn min-h-12 ${saved ? "ak-btn-ink" : "ak-btn-line"}`}
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z" />
          </svg>
          {saved ? "В подборке" : "В подборку"}
        </button>
      </div>

      {list.length ? (
        <>
          <ul className="ak-rail -mx-1 mt-5 flex gap-3 overflow-x-auto px-1 pb-1">
            {list.map((entry) => (
              <li key={entry.key} className="relative w-20 shrink-0">
                <span className="relative block aspect-[420/512] overflow-hidden rounded-xl bg-[#dcdcdc]">
                  <Image src={entry.thumb} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <span className="mt-1.5 block truncate text-xs">{entry.title}</span>
                <button
                  type="button"
                  onClick={() => setList((value) => value.filter((item) => item.key !== entry.key))}
                  aria-label={`Убрать из подборки: ${entry.title}`}
                  className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ak-ink text-xs text-ak-ivory"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(SITE)}&text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ak-btn ak-btn-gold mt-5 w-full sm:w-auto"
          >
            Отправить подборку в Telegram
          </a>
        </>
      ) : null}
    </div>
  );
}

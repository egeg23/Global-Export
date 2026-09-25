"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Предложение студии: из чего складывается цена этого макета.
 *
 * Блок нужен не заказчику сайта, а тому, кому мы этот макет показываем.
 * Поэтому он честно подписан: это цена нашей работы, а не что-то с их
 * стороны.
 *
 * ВНИМАНИЕ, расхождение с правилом витрины. В CLAUDE.md от 23.09.2026
 * записано: «цен студии на витрине нет — и возвращать их нельзя». Этот
 * блок добавлен 25.09.2026 по прямой просьбе владельца: он назвал суммы
 * (175 000 ₽ по России, $2 100 по Казахстану) и попросил тумблеры, чтобы
 * состав можно было урезать на встрече. Просьба свежее правила, поэтому
 * блок здесь, а расхождение вынесено владельцу отдельной строкой — если
 * правило портфолио в силе, блок снимается удалением одной главы на
 * каждой из двух страниц, всё остальное остаётся на месте.
 *
 * Смысл тумблеров в том, что торг идёт не «дайте скидку», а «уберите
 * блок». Базовая часть не выключается: сайт без вёрстки, адаптива и
 * выкатки не бывает, и делать вид, что бывает, — обман.
 */

export type OfferItem = {
  id: string;
  label: string;
  note: string;
  price: number;
  /** Входит всегда: снять тумблером нельзя. */
  locked?: boolean;
  /** Цена без скидки — показывается зачёркнутой. */
  was?: number;
};

/**
 * Валюта передаётся ключом, а не функцией форматирования.
 *
 * Страница Tranio — серверный компонент, а функцию с сервера в клиентский
 * компонент передать нельзя. Ключ передать можно, и формат живёт там же,
 * где рисуется.
 */
const formats: Record<"rub" | "usd", (value: number) => string> = {
  rub: (value) => `${value.toLocaleString("ru-RU").replace(/\s/g, " ")} ₽`,
  usd: (value) => `$${value.toLocaleString("ru-RU").replace(/\s/g, " ")}`,
};

export function Offer({
  items,
  currency,
  title,
  lead,
  fullLabel,
  note,
}: {
  items: OfferItem[];
  currency: "rub" | "usd";
  title: string;
  lead: string;
  fullLabel: string;
  note: string;
}) {
  const [off, setOff] = useState<string[]>([]);
  const money = formats[currency];

  const on = (item: OfferItem) => item.locked || !off.includes(item.id);
  const total = items.reduce((sum, item) => (on(item) ? sum + item.price : sum), 0);
  const full = items.reduce((sum, item) => sum + item.price, 0);
  const saved = full - total;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
      <ul className="grid gap-2.5">
        {items.map((item) => {
          const active = on(item);
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={item.locked}
                onClick={() =>
                  setOff((prev) =>
                    prev.includes(item.id)
                      ? prev.filter((id) => id !== item.id)
                      : [...prev, item.id],
                  )
                }
                role="switch"
                aria-checked={active}
                className={cn(
                  "flex w-full items-start gap-4 rounded-[var(--w-radius)] border p-4 text-left transition-colors",
                  item.locked
                    ? "cursor-default border-[var(--w-line)] bg-[var(--w-paper)]"
                    : active
                      ? "cursor-pointer border-[var(--w-accent)] bg-[var(--w-accent-soft)]"
                      : "cursor-pointer border-[var(--w-line)] opacity-55 hover:opacity-80",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5 transition-colors",
                    active ? "border-[var(--w-accent)] bg-[var(--w-accent)]" : "border-[var(--w-line)]",
                  )}
                >
                  <span
                    className={cn(
                      "block size-3.5 rounded-full transition-transform",
                      active ? "translate-x-4 bg-[var(--w-accent-ink)]" : "bg-[var(--w-muted)]",
                    )}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="text-[0.95rem] font-medium">{item.label}</span>
                    <span className="shrink-0 text-[0.86rem] text-[var(--w-muted)]">
                      {item.was ? (
                        <s className="mr-2 opacity-60">{money(item.was)}</s>
                      ) : null}
                      {money(item.price)}
                    </span>
                  </span>
                  <span className="mt-1 block text-[0.8rem] leading-snug text-[var(--w-muted)]">
                    {item.note}
                    {item.locked ? " · входит всегда" : ""}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)] sm:p-8">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
            {title}
          </p>

          <p className="mt-4 text-[clamp(1.9rem,4.4vw,2.8rem)] leading-none text-[var(--w-ink)]">
            {money(total)}
          </p>

          <p className="mt-3 text-[0.88rem] text-[var(--w-muted)]" aria-live="polite">
            {saved > 0 ? (
              <>
                {fullLabel} {money(full)} · вы убрали блоков на {money(saved)}
              </>
            ) : (
              <>{lead}</>
            )}
          </p>

          <p className="mt-6 border-t border-[var(--w-line)] pt-5 text-[0.8rem] leading-relaxed text-[var(--w-muted)]">
            {note}
          </p>
        </div>
      </div>
    </div>
  );
}

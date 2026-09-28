"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Предложение студии: из каких блоков складывается этот макет.
 *
 * Блок нужен не заказчику сайта, а тому, кому мы этот макет показываем.
 * Поэтому он честно подписан: это состав нашей работы, а не что-то с их
 * стороны.
 *
 * Цен здесь нет. 25.09.2026 владелец попросил суммы с тумблерами, 28.09 —
 * «стоимости скрой, но конструкторы оставь по блокам»: это и правило
 * витрины из CLAUDE.md, где цен студии нет вовсе. Сумм нет и в данных, а не
 * только на экране: список уходит в браузер целиком, и спрятанное число
 * читалось бы из кода страницы. Смета по собранному составу — на встрече,
 * из панели devuz.studio.
 *
 * Смысл тумблеров остался тем же: разговор идёт не «дайте скидку», а
 * «уберите блок». Базовая часть не выключается: сайт без вёрстки, адаптива
 * и выкатки не бывает, и делать вид, что бывает, — обман.
 *
 * Список делится надвое. Сверху — то, что в макете уже сделано: эти
 * тумблеры включены, и снять блок можно. Снизу — то, чего в макете нет и
 * что можно доделать: эти выключены, и тумблер добавляет блок в состав.
 * Смешивать их в одну кучу нельзя, иначе итог перестаёт значить «вот что
 * вы сейчас видите».
 */

export type OfferItem = {
  id: string;
  label: string;
  note: string;
  /** Входит всегда: снять тумблером нельзя. */
  locked?: boolean;
  /** Нет в макете: тумблер выключен, блок добавляется сверх состава. */
  extra?: boolean;
};

/** «7 блоков», «1 блок», «3 блока». */
function blocks(count: number): string {
  const tens = count % 100;
  const ones = count % 10;
  if (tens >= 11 && tens <= 14) return `${count} блоков`;
  if (ones === 1) return `${count} блок`;
  if (ones >= 2 && ones <= 4) return `${count} блока`;
  return `${count} блоков`;
}

export function Offer({
  items,
  title,
  lead,
  note,
  madeLabel = "Что в макете уже сделано",
  extraLabel = "Что можно добавить сверх макета",
}: {
  items: OfferItem[];
  title: string;
  lead: string;
  note: string;
  madeLabel?: string;
  extraLabel?: string;
}) {
  // Одно состояние на оба списка: в нём лежат выключенные тумблеры.
  // Для блоков макета выключенным считается снятый, для дополнений —
  // ещё не добавленный, поэтому дополнения лежат здесь с самого начала.
  const [off, setOff] = useState<string[]>(() =>
    items.filter((item) => item.extra).map((item) => item.id),
  );

  const made = items.filter((item) => !item.extra);
  const extras = items.filter((item) => item.extra);

  const on = (item: OfferItem) => item.locked || !off.includes(item.id);

  const kept = made.filter(on).length;
  const added = extras.filter(on);
  const removed = made.length - kept;
  const total = kept + added.length;

  const toggle = (id: string) =>
    setOff((prev) => (prev.includes(id) ? prev.filter((other) => other !== id) : [...prev, id]));

  const row = (item: OfferItem) => {
    const active = on(item);
    return (
      <li key={item.id}>
              <button
                type="button"
                disabled={item.locked}
                onClick={() => toggle(item.id)}
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
                  <span className="block text-[0.95rem] font-medium">{item.label}</span>
                  <span className="mt-1 block text-[0.8rem] leading-snug text-[var(--w-muted)]">
                    {item.note}
                    {item.locked ? " · входит всегда" : ""}
                  </span>
                </span>
              </button>
      </li>
    );
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
      <div className="grid gap-7">
        {/* На телефоне карточка с итогом уезжает под список, и человек
            щёлкает тумблеры, не видя, что делается с составом. Поэтому над
            списком висит узкая полоса с тем же числом. Экранному диктору
            её не читаем: об изменении он узнаёт из карточки ниже, а два
            голоса на одно событие — это шум. */}
        <div
          aria-hidden
          className="sticky top-[4.5rem] z-20 flex items-baseline justify-between gap-3 rounded-[var(--w-radius)] border border-[var(--w-line)] bg-[var(--w-surface)] px-4 py-2.5 shadow-[var(--w-shadow)] lg:hidden"
        >
          <span className="text-[0.66rem] uppercase tracking-[0.2em] text-[var(--w-accent)]">
            {title}
          </span>
          <span className="text-[1.05rem] font-medium text-[var(--w-ink)]">{blocks(total)}</span>
        </div>

        {extras.length > 0 ? (
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
            {madeLabel}
          </p>
        ) : null}
        <ul className="grid gap-2.5">{made.map(row)}</ul>

        {extras.length > 0 ? (
          <>
            <p className="mt-2 text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
              {extraLabel}
            </p>
            <ul className="grid gap-2.5">{extras.map(row)}</ul>
          </>
        ) : null}
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)] sm:p-8">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
            {title}
          </p>

          <p className="mt-4 text-[clamp(1.9rem,4.4vw,2.8rem)] leading-none text-[var(--w-ink)]">
            {blocks(total)}
          </p>

          {/* Строка под числом объясняет, из чего оно сложилось: что снято
              с состава макета и что добавлено сверх него. Когда не тронуто
              ничего, вместо подсчёта стоит обычная подпись. */}
          <p className="mt-3 text-[0.88rem] leading-relaxed text-[var(--w-muted)]" aria-live="polite">
            {removed > 0 || added.length > 0 ? (
              <>
                Из макета — {kept} из {made.length}
                {removed > 0 ? <> · убрано: {removed}</> : null}
                {added.length > 0 ? <> · сверх макета: {added.map((item) => item.label).join(", ")}</> : null}
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

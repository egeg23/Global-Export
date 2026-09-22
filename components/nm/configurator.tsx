"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  defaultChoice,
  estimate,
  groups,
  layoutOf,
  layouts,
  optionOf,
  readyBy,
  sums,
  type Choice,
  type Group,
} from "@/content/nm/kitchen";
import { cn } from "@/lib/cn";

/**
 * Конфигуратор кухни — то, ради чего страницу открывают второй раз.
 *
 * Схема взята из шаблона «Interactive Configurator» ui-ux-pro-max: выбор
 * наверху, характеристики рядом, цена в липкой строке снизу, заявка прямо
 * из конфигуратора. Оттуда же требование доступности — управление кнопками
 * и клавиатурой, без перетаскивания, — поэтому здесь обычные радиокнопки в
 * группах, а не ползунки и не drag.
 *
 * Слева не рендер «вашей кухни», а доска материалов: крупный образец
 * фасада и рядом образец столешницы. Так честнее — это настоящие их
 * материалы, снятые на их объектах, а не перекрашенная фотография чужой
 * кухни, которая обещала бы то, чего заказчик не заказывал.
 */
export function Configurator() {
  const [choice, setChoice] = useState<Choice>(defaultChoice);
  const [sent, setSent] = useState(false);

  const plan = useMemo(() => estimate(choice), [choice]);
  const layout = layoutOf(choice);
  const front = optionOf("front", choice.front);
  const top = optionOf("top", choice.top);

  const pick = (group: Group["id"], option: string) =>
    setChoice((prev) => ({ ...prev, [group]: option }));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
      {/* Доска материалов */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative aspect-square w-full overflow-hidden rounded-[var(--w-radius-lg)] bg-[var(--w-paper)] shadow-[var(--w-shadow)]">
          {front.swatch ? (
            <Image
              key={front.swatch}
              src={`/images/nm/swatches/${front.swatch}.webp`}
              alt={`Образец: ${front.label}`}
              fill
              sizes="(max-width: 1024px) 100vw, 34vw"
              className="object-cover"
            />
          ) : null}

          {/* Столешница ложится на фасад углом — как выкладывают образцы
              на столе в салоне. */}
          {top.swatch ? (
            <div className="absolute bottom-0 right-0 h-[42%] w-[52%] overflow-hidden rounded-tl-[var(--w-radius-lg)] border-l border-t border-[var(--nm-champagne)]/70 shadow-[0_-12px_40px_-20px_rgba(7,40,46,0.6)]">
              <Image
                key={top.swatch}
                src={`/images/nm/swatches/${top.swatch}.webp`}
                alt={`Образец: ${top.label}`}
                fill
                sizes="18vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="absolute left-0 top-0 m-4 rounded-[var(--w-radius)] bg-[var(--nm-teal-deep)]/80 px-3 py-2 backdrop-blur-sm">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[var(--nm-champagne)]">
              Образцы материалов
            </p>
          </div>
        </div>

        <p className="mt-4 text-[0.82rem] leading-relaxed text-[var(--w-muted)]">
          <b className="text-[var(--w-ink)]">{front.label}</b> · {front.note}
        </p>
        <p className="mt-2 text-[0.82rem] leading-relaxed text-[var(--w-muted)]">
          <b className="text-[var(--w-ink)]">{top.label}</b> · {top.note}
        </p>
        <p className="mt-4 border-t border-[var(--w-line)] pt-4 text-[0.76rem] leading-relaxed text-[var(--w-muted)]">
          Образцы сняты на объектах фабрики. Настоящий цвет выбирают в салоне:
          экран врёт про оттенок у любого производителя.
        </p>
      </div>

      {/* Выбор */}
      <div>
        <fieldset>
          <legend className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
            Планировка
          </legend>
          <p className="mt-2 text-[0.84rem] text-[var(--w-muted)]">
            От неё зависит длина фронта, а значит и цена
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {layouts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => pick("layout", item.id)}
                aria-pressed={choice.layout === item.id}
                className={cn(
                  "group cursor-pointer rounded-[var(--w-radius)] border p-3.5 text-left transition-colors",
                  choice.layout === item.id
                    ? "border-[var(--nm-teal)] bg-[var(--nm-teal-soft)]"
                    : "border-[var(--w-line)] hover:border-[var(--w-accent)]",
                )}
              >
                <svg
                  viewBox="0 0 64 64"
                  className={cn(
                    "h-9 w-9 transition-colors",
                    choice.layout === item.id
                      ? "fill-[var(--nm-teal)]"
                      : "fill-[var(--w-muted)] opacity-60",
                  )}
                  aria-hidden
                >
                  <path d={item.plan} />
                </svg>
                <span className="mt-2.5 block text-[0.86rem] font-medium">{item.label}</span>
                <span className="mt-1 block text-[0.72rem] text-[var(--w-muted)]">
                  {item.metres} п.м.
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {groups.map((group) => (
          <fieldset key={group.id} className="mt-9">
            <legend className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
              {group.label}
            </legend>
            <p className="mt-2 text-[0.84rem] text-[var(--w-muted)]">{group.hint}</p>
            <div className="mt-4 grid gap-2.5">
              {group.options.map((option) => {
                const active = choice[group.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => pick(group.id, option.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex cursor-pointer items-start gap-4 rounded-[var(--w-radius)] border p-4 text-left transition-colors",
                      active
                        ? "border-[var(--nm-teal)] bg-[var(--nm-teal-soft)]"
                        : "border-[var(--w-line)] hover:border-[var(--w-accent)]",
                    )}
                  >
                    {option.swatch ? (
                      <span className="relative size-11 shrink-0 overflow-hidden rounded-[var(--w-radius)]">
                        <Image
                          src={`/images/nm/swatches/${option.swatch}.webp`}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      <span className="size-11 shrink-0 rounded-[var(--w-radius)] border border-[var(--w-line)] bg-[var(--w-paper)]" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="text-[0.94rem] font-medium">{option.label}</span>
                        <span className="text-[0.8rem] text-[var(--w-muted)]">
                          {option.perMetre > 0 ? `+${sums(option.perMetre)} млн / п.м.` : "включено"}
                        </span>
                      </span>
                      <span className="mt-1 block text-[0.8rem] leading-snug text-[var(--w-muted)]">
                        {option.note}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <Summary plan={plan} layout={layout.label} sent={sent} onSend={() => setSent(true)} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Итог: цена, срок и заявка                                           */
/* ------------------------------------------------------------------ */

function Summary({
  plan,
  layout,
  sent,
  onSend,
}: {
  plan: ReturnType<typeof estimate>;
  layout: string;
  sent: boolean;
  onSend: () => void;
}) {
  // Дата пишется прямо в узел, а не в состояние: часы во время отрисовки
  // дали бы на сервере и в браузере разные строки, а лишняя перерисовка
  // ради одной подписи не нужна.
  const ready = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ready.current) ready.current.textContent = readyBy(plan.days);
  }, [plan.days]);

  return (
    <div
      id="estimate"
      className="mt-10 scroll-mt-28 rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)] sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
            Ориентир по смете
          </p>
          <p className="mt-3 text-[clamp(1.7rem,4vw,2.5rem)] leading-none text-[var(--nm-teal)]">
            {sums(plan.low)} — {sums(plan.high)}
            <span className="ml-2 text-[0.42em] text-[var(--w-muted)]">млн сум</span>
          </p>
          <p className="mt-2.5 text-[0.84rem] text-[var(--w-muted)]">
            {layout}, {plan.metres} п.м. · {sums(plan.perMetre)} млн за погонный метр
          </p>
        </div>

        <div className="text-right">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
            Готово примерно
          </p>
          <p className="mt-3 text-[1.5rem] leading-none text-[var(--nm-teal)]">
            <span ref={ready}>—</span>
          </p>
          <p className="mt-2.5 text-[0.84rem] text-[var(--w-muted)]">
            {plan.days} дней от заявки
          </p>
        </div>
      </div>

      <details className="mt-7 border-t border-[var(--w-line)] pt-5">
        <summary className="cursor-pointer text-[0.86rem] text-[var(--w-ink)]">
          Из чего сложилась цена
        </summary>
        <ul className="mt-4 grid gap-2">
          {plan.lines.map((line) => (
            <li
              key={line.group}
              className="flex justify-between gap-4 text-[0.84rem] text-[var(--w-muted)]"
            >
              <span>
                {line.group}: <b className="font-medium text-[var(--w-ink)]">{line.label}</b>
              </span>
              <span className="tabular-nums">
                {line.perMetre > 0 ? `+${sums(line.perMetre)}` : "—"}
              </span>
            </li>
          ))}
        </ul>
      </details>

      {sent ? (
        <p
          role="status"
          className="mt-7 rounded-[var(--w-radius)] border border-[var(--nm-teal)] bg-[var(--nm-teal-soft)] p-4 text-[0.88rem] leading-relaxed"
        >
          Это макет — заявка никуда не ушла. В рабочем сайте здесь отправляется
          состав целиком: планировка, материалы, фурнитура, вилка цены и срок, —
          и менеджер перезванивает, уже зная, о чём речь.
        </p>
      ) : (
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSend}
            className="cursor-pointer rounded-[var(--w-radius)] bg-[var(--nm-teal)] px-7 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Отправить на расчёт
          </button>
          <span className="text-[0.8rem] text-[var(--w-muted)]">
            Замер и консультация бесплатные
          </span>
        </div>
      )}

      <p className="mt-6 text-[0.76rem] leading-relaxed text-[var(--w-muted)]">
        Цены в конфигураторе — ориентир по рынку, разложенный по материалам и
        фурнитуре фабрики, а не её прайс. Точную сумму называют после замера; в
        рабочем сайте таблица приходит из панели управления.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Липкая строка цены                                                  */
/* ------------------------------------------------------------------ */

/**
 * Полоса снизу с текущей ценой. Появляется, только пока конфигуратор в
 * кадре: на остальной странице она была бы просто рекламной лентой.
 */
export function PriceBar() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const section = document.getElementById("configurator");
    if (!section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setShown(entry.isIntersecting);
      },
      { rootMargin: "-25% 0px -25% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (!shown) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--w-line)] bg-[var(--w-surface)]/95 backdrop-blur-xl lg:hidden">
      <a
        href="#estimate"
        className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-3.5"
      >
        <span className="text-[0.8rem] text-[var(--w-muted)]">Ориентир по смете</span>
        <span className="rounded-[var(--w-radius)] bg-[var(--nm-teal)] px-5 py-2.5 text-[0.84rem] text-white">
          Смотреть расчёт
        </span>
      </a>
    </div>
  );
}

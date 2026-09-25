"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  bestWithin,
  clampAmount,
  days,
  defaultChoice,
  estimate,
  extras,
  fromPrice,
  groupOf,
  kindOf,
  kinds,
  layoutOf,
  layouts,
  optionOf,
  optionsFor,
  readyBy,
  sums,
  volume,
  type Choice,
  type GroupId,
  type KindId,
} from "@/content/nm/calc";
import { cn } from "@/lib/cn";

/**
 * Калькулятор мебели — то, ради чего страницу открывают второй раз.
 *
 * Порядок взят у калькулятора на devuz.studio, потому что он проверен:
 * «01 что делаем» — крупный выбор, «02 настройте под себя» — объём,
 * материалы и надбавки, «03 предварительная оценка» — вилка, срок и
 * оговорка. Внутри этой схемы лежит шаблон «Interactive Configurator»
 * из ui-ux-pro-max: выбор наверху, характеристики рядом, цена в липкой
 * строке снизу, заявка прямо отсюда. Оттуда же требование доступности —
 * управление кнопками и клавиатурой, без перетаскивания.
 *
 * Слева не рендер «вашей кухни», а доска материалов: крупный образец
 * фасада и рядом образец столешницы. Так честнее — это настоящие их
 * материалы, снятые на их объектах, а не перекрашенная фотография чужой
 * кухни, которая обещала бы то, чего заказчик не заказывал.
 */
export function Configurator() {
  const [choice, setChoice] = useState<Choice>(defaultChoice);
  const [sent, setSent] = useState(false);

  const kind = kindOf(choice.kind);
  // Пересчёт дешёвый, а мемоизацию здесь всё равно делает компилятор React.
  const plan = estimate(choice);
  const front = optionOf("front", choice.front, kind.id);
  const top = kind.groups.includes("top") ? optionOf("top", choice.top, kind.id) : undefined;

  const pick = (group: GroupId, option: string) =>
    setChoice((prev) => ({ ...prev, [group]: option }));

  /**
   * Смена типа мебели подставляет его типовой объём.
   *
   * Четыре с половиной метра кухни и четыре с половиной метра тумбы в
   * ванной — разные вещи, и вторая просто не бывает такой. Материалы при
   * этом не сбрасываются: если выбран шпон, он останется шпоном, а
   * неподходящие варианты сами откатятся в `optionOf`.
   */
  const pickKind = (id: KindId) =>
    setChoice((prev) => {
      const next = kindOf(id);
      const amount = id === "kitchen" ? layoutOf(prev).metres : next.amount;
      return { ...prev, kind: id, amount: clampAmount(next, amount) };
    });

  const pickLayout = (id: string) =>
    setChoice((prev) => {
      const layout = layouts.find((item) => item.id === id) ?? layouts[1];
      return { ...prev, layout: id, amount: clampAmount(kindOf(prev.kind), layout.metres) };
    });

  return (
    <div className="grid gap-12">
      {/* 01 — что делаем */}
      <Step number="01" title="Что делаем" hint="Считаем не только кухни: выберите, что нужно вам">
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {kinds.map((item) => {
            const active = choice.kind === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => pickKind(item.id)}
                  aria-pressed={active}
                  className={cn(
                    "group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[var(--w-radius-lg)] border text-left transition-colors",
                    active
                      ? "border-[var(--nm-teal)] bg-[var(--nm-teal-soft)]"
                      : "border-[var(--w-line)] hover:border-[var(--w-accent)]",
                  )}
                >
                  <span className="relative block aspect-[16/10] w-full overflow-hidden bg-[var(--w-paper)]">
                    <Image
                      src={`/images/nm/${item.photo}.webp`}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                      className={cn(
                        "object-cover transition-transform duration-700 group-hover:scale-105",
                        active ? "" : "opacity-85 saturate-[0.85]",
                      )}
                    />
                  </span>
                  <span className="flex flex-1 flex-col p-4">
                    <span className="text-[0.94rem] font-medium leading-snug">{item.label}</span>
                    <span className="mt-1 block text-[0.78rem] leading-snug text-[var(--w-muted)]">
                      {item.note}
                    </span>
                    <span className="mt-3 block text-[0.8rem] text-[var(--nm-teal)]">
                      от {sums(fromPrice(item))} млн сум
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Step>

      {/* 02 — настройте под себя */}
      <Step
        number="02"
        title="Настройте под себя"
        hint="Объём, материалы и фурнитура. Цена и срок едут на каждом нажатии"
      >
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
              ) : (
                <Image
                  src={`/images/nm/${kind.photo}.webp`}
                  alt={`Образец: ${front.label}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 34vw"
                  className="object-cover"
                />
              )}

              {/* Столешница ложится на фасад углом — как выкладывают образцы
                  на столе в салоне. */}
              {top?.swatch ? (
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
            {top ? (
              <p className="mt-2 text-[0.82rem] leading-relaxed text-[var(--w-muted)]">
                <b className="text-[var(--w-ink)]">{top.label}</b> · {top.note}
              </p>
            ) : null}
            <p className="mt-4 border-t border-[var(--w-line)] pt-4 text-[0.76rem] leading-relaxed text-[var(--w-muted)]">
              Образцы сняты на наших объектах. Настоящий цвет выбирают в салоне:
              экран врёт про оттенок у любого производителя.
            </p>
          </div>

          {/* Выбор */}
          <div>
            <Amount
              kind={kind}
              amount={choice.amount}
              onChange={(amount) => setChoice((prev) => ({ ...prev, amount }))}
            />

            {kind.groups.includes("layout") ? (
              <fieldset className="mt-9">
                <legend className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
                  Планировка
                </legend>
                <p className="mt-2 text-[0.84rem] text-[var(--w-muted)]">
                  Подставляет типовую длину фронта — её можно поправить выше
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {layouts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => pickLayout(item.id)}
                      aria-pressed={choice.layout === item.id}
                      className={cn(
                        "cursor-pointer rounded-[var(--w-radius)] border p-3.5 text-left transition-colors",
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
            ) : null}

            {kind.groups
              .filter((id) => id !== "layout")
              .map((id) => {
                const group = groupOf(id)!;
                const options = optionsFor(id, kind.id);
                const chosen = optionOf(id, choice[id], kind.id);
                return (
                  <fieldset key={id} className="mt-9">
                    <legend className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
                      {group.label}
                    </legend>
                    <p className="mt-2 text-[0.84rem] text-[var(--w-muted)]">{group.hint}</p>
                    <div className="mt-4 grid gap-2.5">
                      {options.map((option) => {
                        const active = chosen.id === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => pick(id, option.id)}
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
                                  {option.perUnit > 0
                                    ? `+${sums(option.perUnit)} млн / п.м.`
                                    : "включено"}
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
                );
              })}

            {extras.map((extra) => (
              <fieldset key={extra.id} className="mt-9">
                <legend className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
                  {extra.label}
                </legend>
                <p className="mt-2 text-[0.84rem] text-[var(--w-muted)]">{extra.hint}</p>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {extra.options.map((option) => {
                    const active = choice[extra.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setChoice((prev) => ({ ...prev, [extra.id]: option.id }))}
                        aria-pressed={active}
                        className={cn(
                          "cursor-pointer rounded-[var(--w-radius)] border p-4 text-left transition-colors",
                          active
                            ? "border-[var(--nm-teal)] bg-[var(--nm-teal-soft)]"
                            : "border-[var(--w-line)] hover:border-[var(--w-accent)]",
                        )}
                      >
                        <span className="block text-[0.94rem] font-medium">{option.label}</span>
                        <span className="mt-1 block text-[0.8rem] leading-snug text-[var(--w-muted)]">
                          {option.note}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      </Step>

      {/* 03 — предварительная оценка */}
      <Step number="03" title="Предварительная оценка" hint="Вилка, срок и состав — то же, что считает менеджер">
        <Summary
          plan={plan}
          sent={sent}
          onSend={() => setSent(true)}
          onBudget={(budget) => {
            const found = bestWithin(kind, choice.amount, budget, choice);
            if (found) setChoice(found);
            return found !== null;
          }}
        />
      </Step>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Шаг                                                                 */
/* ------------------------------------------------------------------ */

function Step({
  number,
  title,
  hint,
  children,
}: {
  number: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-[var(--w-line)] pb-4">
        <h3 className="text-[1.15rem] text-[var(--nm-teal)]">
          <span className="mr-2 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
            {number}
          </span>
          {title}
        </h3>
        <p className="text-[0.84rem] text-[var(--w-muted)]">{hint}</p>
      </header>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Объём                                                               */
/* ------------------------------------------------------------------ */

/**
 * Ползунок объёма с кнопками по краям.
 *
 * Ползунок — для тех, кто мышью, кнопки — для пальца и для клавиатуры:
 * попасть в ручку ползунка на телефоне трудно, а шаг в 20 см кнопкой
 * нажимается без прицеливания.
 */
function Amount({
  kind,
  amount,
  onChange,
}: {
  kind: ReturnType<typeof kindOf>;
  amount: number;
  onChange: (amount: number) => void;
}) {
  const shift = (delta: number) => onChange(clampAmount(kind, amount + delta));

  return (
    <fieldset>
      <legend className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
        {kind.amountLabel}
      </legend>
      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => shift(-kind.step)}
          disabled={amount <= kind.min}
          aria-label={`Уменьшить: ${kind.amountLabel}`}
          className="size-11 shrink-0 cursor-pointer rounded-[var(--w-radius)] border border-[var(--w-line)] text-lg transition-colors hover:border-[var(--w-accent)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>

        <div className="min-w-0 flex-1">
          <input
            type="range"
            min={kind.min}
            max={kind.max}
            step={kind.step}
            value={amount}
            onChange={(event) => onChange(clampAmount(kind, Number(event.target.value)))}
            aria-label={kind.amountLabel}
            aria-valuetext={volume(kind, amount)}
            className="nm-range w-full"
          />
          <p className="mt-2 text-[0.8rem] text-[var(--w-muted)]">
            от {volume(kind, kind.min)} до {volume(kind, kind.max)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => shift(kind.step)}
          disabled={amount >= kind.max}
          aria-label={`Увеличить: ${kind.amountLabel}`}
          className="size-11 shrink-0 cursor-pointer rounded-[var(--w-radius)] border border-[var(--w-line)] text-lg transition-colors hover:border-[var(--w-accent)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>

        {/* Значение читает сам ползунок через aria-valuetext; если оставить
            его ещё и здесь живой областью, экранный диктор произнесёт
            каждое движение дважды. Глазам цифра нужна, голосу — нет. */}
        <output
          aria-hidden
          className="w-28 shrink-0 text-right text-[1.15rem] tabular-nums text-[var(--nm-teal)]"
        >
          {volume(kind, amount)}
        </output>
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Итог: цена, срок и заявка                                           */
/* ------------------------------------------------------------------ */

function Summary({
  plan,
  sent,
  onSend,
  onBudget,
}: {
  plan: ReturnType<typeof estimate>;
  sent: boolean;
  onSend: () => void;
  onBudget: (budget: number) => boolean;
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
      className="scroll-mt-28 rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)] sm:p-8"
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
            {plan.kind.label}, {volume(plan.kind, plan.amount)}
            {plan.kind.scale === 1 ? "" : ` · ${sums(plan.metres)} п.м. фронта`} ·{" "}
            {sums(plan.perMetre)} млн за погонный метр
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
            {days(plan.days)} от заявки
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
                {line.perUnit > 0 ? `+${sums(line.perUnit)}` : "—"}
              </span>
            </li>
          ))}
        </ul>
      </details>

      <Budget onBudget={onBudget} />

      {sent ? (
        <p
          role="status"
          className="mt-7 rounded-[var(--w-radius)] border border-[var(--nm-teal)] bg-[var(--nm-teal-soft)] p-4 text-[0.88rem] leading-relaxed"
        >
          Заявка принята. У менеджера уже есть состав целиком: тип мебели,
          объём, материалы, фурнитура, вилка цены и срок, — он перезвонит,
          зная, о чём речь.
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
        Цены в калькуляторе — ориентир, разложенный по материалам и фурнитуре.
        Точную сумму называем после замера; замер бесплатный.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Расчёт от бюджета                                                   */
/* ------------------------------------------------------------------ */

/**
 * «У меня есть столько» — обратный ход калькулятора.
 *
 * Так спрашивает человек, который уже отложил сумму. Ни у них, ни у
 * конкурентов такого нет: везде сначала заставляют выбрать, а цену
 * называют по телефону. Здесь наоборот — называете деньги, получаете
 * самый дорогой набор, который в них укладывается.
 */
function Budget({ onBudget }: { onBudget: (budget: number) => boolean }) {
  const [value, setValue] = useState("");
  const [miss, setMiss] = useState(false);

  const apply = () => {
    const budget = Number(value.replace(",", "."));
    if (!Number.isFinite(budget) || budget <= 0) return;
    setMiss(!onBudget(budget));
  };

  return (
    <div className="mt-7 border-t border-[var(--w-line)] pt-5">
      <p className="text-[0.86rem] text-[var(--w-ink)]">Или наоборот: назовите бюджет</p>
      <p className="mt-1.5 text-[0.8rem] text-[var(--w-muted)]">
        Подберём самый дорогой набор, который в него укладывается
      </p>
      <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
        <label className="flex items-center gap-2 rounded-[var(--w-radius)] border border-[var(--w-line)] px-4 py-2.5">
          <input
            type="number"
            inputMode="decimal"
            min={1}
            step={1}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setMiss(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                apply();
              }
            }}
            placeholder="60"
            aria-label="Бюджет в миллионах сумов"
            className="w-24 bg-transparent text-[1rem] tabular-nums outline-none"
          />
          <span className="text-[0.8rem] text-[var(--w-muted)]">млн сум</span>
        </label>
        <button
          type="button"
          onClick={apply}
          className="cursor-pointer rounded-[var(--w-radius)] border border-[var(--nm-teal)] px-5 py-2.5 text-[0.86rem] text-[var(--nm-teal)] transition-colors hover:bg-[var(--nm-teal-soft)]"
        >
          Подобрать
        </button>
      </div>
      {miss ? (
        <p role="status" className="mt-3 text-[0.8rem] text-[var(--w-muted)]">
          В эти деньги такой объём не укладывается даже в самом простом
          исполнении. Уменьшите метраж выше — или позвоните: у нас бывают
          остатки материала с других заказов.
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Липкая строка цены                                                  */
/* ------------------------------------------------------------------ */

/**
 * Полоса снизу с текущей ценой. Появляется, только пока калькулятор в
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

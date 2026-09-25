"use client";

import { useEffect, useRef, useState } from "react";

import { useStage } from "@/components/showcase/depth";
import {
  MIN_CAPITAL,
  forecast,
  money,
  strategies,
  years,
  type Strategy,
} from "@/content/tr/strategies";
import { cn } from "@/lib/cn";

/**
 * Калькулятор инвестиционных стратегий.
 *
 * Четыре стратегии и их доходности стоят у Tranio на главной одной
 * строкой — «строительство в Европе 10—15%» — и там же умирают: ни
 * посчитать, ни сравнить. Здесь из той же строки выходит ответ на
 * вопрос, ради которого её читают: сколько это в деньгах и через
 * сколько лет.
 *
 * Считаем сложным процентом по обеим границам вилки и показываем именно
 * вилку. Точка вместо вилки в этом жанре — обещание, которого никто не
 * давал.
 */
export function Strategies() {
  const [active, setActive] = useState(strategies[0].id);
  const [capital, setCapital] = useState(250);
  const [horizon, setHorizon] = useState<number | null>(null);
  const stage = useStage<HTMLDivElement>();

  const strategy = strategies.find((item) => item.id === active) ?? strategies[0];
  const span = horizon ?? strategy.years;
  const result = forecast(strategy, Math.max(capital, strategy.from), span);

  return (
    <div ref={stage} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <div>
        <fieldset>
          <legend className="tr-eyebrow">Стратегия</legend>
          <div className="mt-4 grid gap-2.5">
            {strategies.map((item) => (
              <StrategyRow
                key={item.id}
                strategy={item}
                active={item.id === active}
                onPick={() => {
                  setActive(item.id);
                  setHorizon(null);
                  setCapital((prev) => Math.max(prev, item.from));
                }}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-9">
          <legend className="tr-eyebrow">Капитал</legend>
          <div className="mt-4 flex items-center gap-4">
            <input
              type="range"
              min={MIN_CAPITAL}
              max={3000}
              step={10}
              value={capital}
              onChange={(event) => setCapital(Number(event.target.value))}
              aria-label="Капитал в тысячах евро"
              aria-valuetext={`€${money(capital)}`}
              className="tr-range min-w-0 flex-1"
            />
            <output
              aria-hidden
              className="tr-figure w-32 shrink-0 text-right text-[1.15rem] text-[var(--w-accent)]"
            >
              €{money(capital)}
            </output>
          </div>
          <p className="mt-2 text-[0.78rem] text-[var(--w-muted)]">
            Нижняя граница — €70 тыс., наш порог входа в стратегии.
            У выбранной стратегии минимум €{strategy.from} тыс.
          </p>
        </fieldset>

        <fieldset className="mt-9">
          <legend className="tr-eyebrow">Горизонт</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {[strategy.years, strategy.years + 2, strategy.years + 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setHorizon(value)}
                aria-pressed={span === value}
                className={cn(
                  "tr-figure cursor-pointer rounded-full border px-4 py-2 text-[0.86rem] transition-colors",
                  span === value
                    ? "border-[var(--w-accent)] bg-[var(--w-accent-soft)] text-[var(--w-ink)]"
                    : "border-[var(--w-line)] text-[var(--w-muted)] hover:border-[var(--w-accent)]",
                )}
              >
                {years(value)}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Результат */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div
          id="forecast"
          className="scroll-mt-28 rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)] sm:p-8"
        >
          <p className="tr-eyebrow">Прогноз по вилке стратегии</p>

          <p className="tr-figure mt-5 text-[clamp(1.9rem,4.4vw,2.8rem)] leading-none text-[var(--w-ink)]">
            €{money(result.low)} — €{money(result.high)}
          </p>
          <p className="mt-3 text-[0.9rem] text-[var(--w-muted)]">
            через {years(span)} при вложении €{money(Math.max(capital, strategy.from))}
          </p>

          <dl className="mt-7 grid gap-3 border-t border-[var(--w-line)] pt-5">
            <Row label="Доходность" value={`${strategy.yield[0]}—${strategy.yield[1]}% годовых`} yield />
            <Row label="Прибыль" value={`€${money(result.profitLow)} — €${money(result.profitHigh)}`} />
            <Row label="Как это работает" value={strategy.how} plain />
          </dl>

          <Payback low={result.profitLow} high={result.profitHigh} capital={Math.max(capital, strategy.from)} />

          <p className="mt-7 text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
            Доходности наших стратегий: строительство в Европе 10—15%, в Дубае
            8%, реновация 2—12%, аренда 7%. Счёт сложным процентом по границам
            вилки. Это прогноз, а не обещание: у конкретного проекта своя
            экономика, и её считаем после разбора.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StrategyRow({
  strategy,
  active,
  onPick,
}: {
  strategy: Strategy;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={cn(
        "flex cursor-pointer items-start gap-4 rounded-[var(--w-radius)] border p-4 text-left transition-colors",
        active
          ? "border-[var(--w-accent)] bg-[var(--w-accent-soft)]"
          : "border-[var(--w-line)] hover:border-[var(--w-accent)]",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className="text-[0.96rem] font-medium">{strategy.label}</span>
          <span className="tr-figure tr-yield text-[0.92rem]">
            {strategy.yield[0] === strategy.yield[1]
              ? `${strategy.yield[0]}%`
              : `${strategy.yield[0]}—${strategy.yield[1]}%`}
          </span>
        </span>
        <span className="mt-1 block text-[0.8rem] leading-snug text-[var(--w-muted)]">
          {strategy.note}
        </span>
      </span>
    </button>
  );
}

function Row({
  label,
  value,
  plain,
  yield: isYield,
}: {
  label: string;
  value: string;
  plain?: boolean;
  yield?: boolean;
}) {
  // Отбивка точками — приём финансовой таблицы, и работает она только с
  // цифрой справа: нерастяжимая строка прозы в той же строке уезжала за
  // край телефона и обрезалась. Поэтому у прозы подпись сверху, значение
  // под ней, и переносится оно как обычный текст.
  if (plain) {
    return (
      <div>
        <dt className="text-[0.86rem] text-[var(--w-muted)]">{label}</dt>
        <dd className="mt-1 text-[0.92rem] leading-relaxed text-[var(--w-ink)]">{value}</dd>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-3">
      <dt className="min-w-0 text-[0.86rem] text-[var(--w-muted)]">{label}</dt>
      <span className="tr-dots" aria-hidden />
      <dd
        className={cn(
          "tr-figure shrink-0 text-[0.92rem] text-[var(--w-ink)]",
          isYield && "tr-yield",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * Полоса окупаемости: во сколько раз прибыль перекрывает вложение.
 *
 * Пишется прямо в узел через ссылку — состояние ради ширины полосы
 * добавило бы перерисовку всей карточки на каждый шаг ползунка.
 */
function Payback({ low, high, capital }: { low: number; high: number; capital: number }) {
  const bar = useRef<HTMLDivElement>(null);
  // Полоса показывает ту же величину, что и подпись: прибыль к вложению.
  // Потолок в полтора вложения — дальше шкала перестаёт быть читаемой.
  const share = Math.min(high / capital, 1.5) / 1.5;

  useEffect(() => {
    if (bar.current) bar.current.style.setProperty("--tr-fill", String(share));
  }, [share]);

  const ratio = (value: number) => (value / capital).toFixed(2).replace(".", ",");

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.8rem] text-[var(--w-muted)]">Прибыль к вложению</span>
        <span className="tr-figure text-[0.86rem] text-[var(--w-ink)]">
          ×{ratio(low)} — ×{ratio(high)}
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--w-line)]">
        <div
          ref={bar}
          className="tr-bar h-full rounded-full bg-[var(--w-accent)]"
          role="presentation"
        />
      </div>
    </div>
  );
}

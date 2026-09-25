"use client";

import { useEffect, useRef } from "react";

import { useStage } from "@/components/showcase/depth";
import { useT, useLang } from "@/components/tt/lang";
import { useBuilder } from "@/components/tt/builder-store";
import { groups, quote, services, tenge } from "@/content/tt/services";
import { cn } from "@/lib/cn";

/**
 * Конструктор подключения для бизнеса.
 *
 * Восемнадцать услуг на их сайте лежат плоским списком иконок, и выбрать
 * из него нельзя ничего: непонятно, что с чем сочетается и во что
 * обойдётся. Здесь тот же список собирается тумблерами, а смета и срок
 * пересчитываются на каждом нажатии.
 *
 * Зависимости включаются сами и говорят об этом вслух: телефонии без
 * канала связи не бывает, и дописывать канал к сумме молча нечестно.
 */
export function Builder() {
  const t = useT();
  const { lang } = useLang();
  const { picked, seats, toggle, setSeats } = useBuilder();
  const stage = useStage<HTMLDivElement>();

  const plan = quote(picked, seats);

  return (
    <div ref={stage} className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
      <div>
        <fieldset>
          <legend className="tt-signal">
            {t({ ru: "Рабочих мест", kk: "Жұмыс орны" })}
          </legend>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSeats(seats - 5)}
              disabled={seats <= 1}
              aria-label={t({ ru: "Меньше мест", kk: "Орын азайту" })}
              className="size-11 shrink-0 cursor-pointer rounded-[var(--w-radius)] border border-[var(--w-line)] text-lg transition-colors hover:border-[var(--w-accent)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>
            <input
              type="range"
              min={1}
              max={500}
              step={1}
              value={seats}
              onChange={(event) => setSeats(Number(event.target.value))}
              aria-label={t({ ru: "Количество рабочих мест", kk: "Жұмыс орындарының саны" })}
              className="tt-range min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={() => setSeats(seats + 5)}
              disabled={seats >= 500}
              aria-label={t({ ru: "Больше мест", kk: "Орын қосу" })}
              className="size-11 shrink-0 cursor-pointer rounded-[var(--w-radius)] border border-[var(--w-line)] text-lg transition-colors hover:border-[var(--w-accent)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
            <output
              aria-hidden
              className="tt-figure w-16 shrink-0 text-right text-[1.2rem] text-[var(--w-accent)]"
            >
              {seats}
            </output>
          </div>
        </fieldset>

        {groups.map((group) => (
          <fieldset key={group.id} className="mt-9">
            <legend className="tt-signal">{t(group.label)}</legend>
            <p className="mt-2 text-[0.84rem] text-[var(--w-muted)]">{t(group.hint)}</p>
            <div className="mt-4 grid gap-2.5">
              {services
                .filter((service) => service.group === group.id)
                .map((service) => {
                  const on = picked.includes(service.id);
                  const auto = plan.forced.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggle(service.id)}
                      role="switch"
                      aria-checked={on || auto}
                      className={cn(
                        "flex cursor-pointer items-start gap-4 rounded-[var(--w-radius)] border p-4 text-left transition-colors",
                        on || auto
                          ? "border-[var(--w-accent)] bg-[var(--w-accent-soft)]"
                          : "border-[var(--w-line)] hover:border-[var(--w-accent)]",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5 transition-colors",
                          on || auto
                            ? "border-[var(--w-accent)] bg-[var(--w-accent)]"
                            : "border-[var(--w-line)]",
                        )}
                      >
                        <span
                          className={cn(
                            "block size-3.5 rounded-full transition-transform",
                            on || auto
                              ? "translate-x-4 bg-[var(--w-accent-ink)]"
                              : "bg-[var(--w-muted)]",
                          )}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <span className="text-[0.95rem] font-medium">{t(service.label)}</span>
                          <span className="tt-figure text-[0.8rem] text-[var(--w-muted)]">
                            {tenge(service.monthly)}
                            {service.perSeat
                              ? t({ ru: " / место / мес.", kk: " / орын / ай" })
                              : t({ ru: " / мес.", kk: " / ай" })}
                          </span>
                        </span>
                        <span className="mt-1 block text-[0.8rem] leading-snug text-[var(--w-muted)]">
                          {t(service.note)}
                        </span>
                        {auto && !on ? (
                          <span className="mt-2 block text-[0.76rem] text-[var(--w-accent)]">
                            {t({
                              ru: "Включено само: без этого выбранное не работает",
                              kk: "Өздігінен қосылды: онсыз таңдалған жұмыс істемейді",
                            })}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <Quote plan={plan} seats={seats} lang={lang} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Quote({
  plan,
  seats,
  lang,
}: {
  plan: ReturnType<typeof quote>;
  seats: number;
  lang: "ru" | "kk";
}) {
  const t = useT();
  const ready = useRef<HTMLSpanElement>(null);

  // Дата пишется в узел: часы во время отрисовки дали бы на сервере и в
  // браузере разные строки.
  useEffect(() => {
    if (!ready.current) return;
    if (plan.days === 0) {
      ready.current.textContent = "—";
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + plan.days);
    ready.current.textContent = date.toLocaleDateString(lang === "kk" ? "kk-KZ" : "ru-RU", {
      day: "numeric",
      month: "long",
    });
  }, [plan.days, lang]);

  return (
    <div
      id="quote"
      className="scroll-mt-28 rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)] sm:p-8"
    >
      <p className="tt-signal">{t({ ru: "Ориентир по смете", kk: "Смета бойынша бағдар" })}</p>

      <p className="tt-figure mt-4 text-[clamp(1.7rem,4vw,2.5rem)] leading-none text-[var(--w-ink)]">
        {tenge(plan.monthly)}
        <span className="ml-2 text-[0.4em] text-[var(--w-muted)]">
          {t({ ru: "в месяц", kk: "айына" })}
        </span>
      </p>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <p className="text-[0.86rem] text-[var(--w-muted)]">
          {t({ ru: "Подключение", kk: "Қосылу" })}{" "}
          <span className="tt-figure text-[var(--w-ink)]">{tenge(plan.setup)}</span>
        </p>
        <p className="text-[0.86rem] text-[var(--w-muted)]">
          {t({ ru: "Готово к", kk: "Дайын болады" })}{" "}
          <span className="tt-figure text-[var(--w-ink)]">
            <span ref={ready}>—</span>
          </span>
        </p>
      </div>

      <details className="mt-6 border-t border-[var(--w-line)] pt-5" open>
        <summary className="cursor-pointer text-[0.86rem] text-[var(--w-ink)]">
          {t({ ru: "Из чего сложилась сумма", kk: "Сома неден құралды" })}
        </summary>
        {plan.lines.length === 0 ? (
          <p className="mt-4 text-[0.84rem] text-[var(--w-muted)]">
            {t({
              ru: "Ничего не выбрано. Отметьте хотя бы канал связи — с него начинается всё остальное.",
              kk: "Ештеңе таңдалмады. Кемінде байланыс арнасын белгілеңіз — қалғаны содан басталады.",
            })}
          </p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {plan.lines.map((line) => (
              <li
                key={line.id}
                className="flex items-baseline justify-between gap-4 text-[0.84rem] text-[var(--w-muted)]"
              >
                <span className={cn(plan.forced.includes(line.id) && "text-[var(--w-accent)]")}>
                  {t(line.label)}
                </span>
                <span className="tt-figure shrink-0 tabular-nums">{tenge(line.monthly)}</span>
              </li>
            ))}
          </ul>
        )}
      </details>

      {plan.forced.length > 0 ? (
        <p role="status" className="mt-5 text-[0.8rem] leading-relaxed text-[var(--w-accent)]">
          {t({
            ru: "Канал связи добавлен сам: без него не работают ни телефония, ни VPN, ни видео.",
            kk: "Байланыс арнасы өздігінен қосылды: онсыз телефония да, VPN де, бейне де жұмыс істемейді.",
          })}
        </p>
      ) : null}

      <p className="mt-6 text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
        {t({
          ru: `Цены ориентировочные: точную смету называем после обследования объекта. Счёт идёт на ${seats} рабочих мест.`,
          kk: `Бағалар шамамен берілген: нақты сметаны нысанды тексергеннен кейін айтамыз. Есеп ${seats} жұмыс орнына жүргізіледі.`,
        })}
      </p>
    </div>
  );
}

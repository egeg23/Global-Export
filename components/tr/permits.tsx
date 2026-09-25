"use client";

import Image from "next/image";
import { useState } from "react";

import { Rise } from "@/components/mavera/reveal";
import { useStage } from "@/components/showcase/depth";
import { eur } from "@/content/tr/countries";
import { fit, goals, months, type Goal } from "@/content/tr/permits";
import { cn } from "@/lib/cn";

/**
 * Подбор ВНЖ и гражданства.
 *
 * У них это блок из четырёх абзацев с перечислением программ. Вопрос, с
 * которым туда заходят, — «что подойдёт лично мне и как быстро», — и
 * отвечают на него здесь: цель плюс бюджет дают список, отсортированный
 * по сроку оформления.
 */
export function Permits() {
  const [goal, setGoal] = useState<Goal | null>("mobility");
  const [budget, setBudget] = useState(400);
  const stage = useStage<HTMLDivElement>();

  const found = fit(goal, budget);
  const fastest = found[0] ?? null;

  return (
    <div ref={stage} className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <fieldset>
          <legend className="tr-eyebrow">Зачем статус</legend>
          <div className="mt-4 grid gap-2.5">
            {goals.map((item) => {
              const on = goal === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(on ? null : item.id)}
                  aria-pressed={on}
                  className={cn(
                    "cursor-pointer rounded-[var(--w-radius)] border p-4 text-left transition-colors",
                    on
                      ? "border-[var(--w-accent)] bg-[var(--w-accent-soft)]"
                      : "border-[var(--w-line)] hover:border-[var(--w-accent)]",
                  )}
                >
                  <span className="block text-[0.94rem] font-medium">{item.label}</span>
                  <span className="mt-1 block text-[0.78rem] leading-snug text-[var(--w-muted)]">
                    {item.note}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="tr-eyebrow">Бюджет на программу</legend>
          <div className="mt-4 flex items-center gap-4">
            <input
              type="range"
              min={40}
              max={600}
              step={10}
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
              aria-label="Бюджет на программу в тысячах евро"
              aria-valuetext={eur(budget)}
              className="tr-range min-w-0 flex-1"
            />
            <output
              aria-hidden
              className="tr-figure w-28 shrink-0 text-right text-[1.1rem] text-[var(--w-accent)]"
            >
              {eur(budget)}
            </output>
          </div>
        </fieldset>

        {fastest ? (
          <div
            aria-live="polite"
            className="mt-8 rounded-[var(--w-radius-lg)] border border-[var(--w-accent)] bg-[var(--w-accent-soft)] p-5"
          >
            <p className="tr-eyebrow">Быстрее всех</p>
            <p className="mt-2.5 text-[1.05rem] font-medium text-[var(--w-ink)]">{fastest.label}</p>
            <p className="tr-figure mt-1.5 text-[0.86rem] text-[var(--w-muted)]">
              {months(fastest.months)} · {fastest.from}
            </p>
          </div>
        ) : null}
      </div>

      <div>
        <p className="mb-4 text-[0.92rem] text-[var(--w-muted)]" aria-live="polite">
          Подходит <b className="tr-figure text-[var(--w-accent)]">{found.length}</b> из 10 программ
        </p>

        {found.length === 0 ? (
          <p className="text-[0.94rem] leading-relaxed text-[var(--w-muted)]">
            Под такую цель и такой бюджет программ не нашлось. Поднимите бюджет
            — самая дешёвая в списке начинается от €40 тыс.
          </p>
        ) : (
          <ul className="grid gap-px overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-line)]">
            {found.map((permit, index) => (
              <Rise
                as="li"
                key={permit.id}
                delay={index * 50}
                className="bg-[var(--w-surface)] p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="tr-eyebrow">{permit.kind}</span>
                    {permit.flags.length ? (
                      <span className="flex items-center gap-1">
                        {permit.flags.map((flag) => (
                          <Image
                            key={flag}
                            src={`/images/tr/flags/${flag}.svg`}
                            alt=""
                            width={18}
                            height={13}
                            className="h-3 w-auto rounded-[1px]"
                          />
                        ))}
                      </span>
                    ) : null}
                  </div>
                  <span className="tr-figure text-[0.84rem] text-[var(--w-muted)]">
                    {months(permit.months)}
                  </span>
                </div>

                <p className="mt-2 text-[1rem] font-medium text-[var(--w-ink)]">{permit.label}</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-[0.82rem] leading-snug text-[var(--w-muted)]">
                    {permit.note}
                  </span>
                  <span className="tr-dots" aria-hidden />
                  <span className="tr-figure shrink-0 text-[0.9rem] text-[var(--w-ink)]">
                    {permit.from}
                  </span>
                </div>
              </Rise>
            ))}
          </ul>
        )}

        <p className="mt-6 text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
          ВНЖ ЕС от €250 тыс., ВНЖ ОАЭ от $205 тыс., гражданство Турции,
          Египта, Вануату и стран Карибского бассейна. Сроки типовые по
          программам: по вашему случаю называем точнее после разбора.
        </p>
      </div>
    </div>
  );
}

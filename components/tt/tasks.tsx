"use client";

import { Rise } from "@/components/mavera/reveal";
import { useT } from "@/components/tt/lang";
import { useBuilder } from "@/components/tt/builder-store";
import { quote, tenge } from "@/content/tt/services";
import { scenarios } from "@/content/tt/scenarios";
import { cn } from "@/lib/cn";

/**
 * Подбор решения под задачу.
 *
 * Клиент приходит не за «IP VPN», а с задачей: открываю офис, переношу
 * серверы, связываю филиалы. На их сайте услуги разложены по названиям
 * технологий, и переводить задачу в набор услуг человек должен сам.
 * Здесь наоборот: выбрал задачу — конструктор выше сам отметил то, что
 * под неё нужно, и показал смету.
 *
 * Поэтому у каждой карточки сразу стоит её цена: сценарий не отправляет
 * «узнавать», он отвечает.
 */
export function Tasks() {
  const t = useT();
  const { scenario, applyScenario } = useBuilder();

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((item, index) => {
          const plan = quote(item.services, item.seats);
          const on = scenario === item.id;
          return (
            <Rise as="li" key={item.id} delay={index * 60}>
              <a
                href="#builder"
                onClick={() => applyScenario(item.id)}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "flex h-full cursor-pointer flex-col rounded-[var(--w-radius-lg)] border p-5 transition-colors",
                  on
                    ? "border-[var(--w-accent)] bg-[var(--w-accent-soft)]"
                    : "border-[var(--w-line)] bg-[var(--w-surface)] hover:border-[var(--w-accent)]",
                )}
              >
                <span className="text-[1.02rem] font-medium leading-snug text-[var(--w-ink)]">
                  {t(item.title)}
                </span>
                <span className="mt-2 block text-[0.84rem] leading-snug text-[var(--w-muted)]">
                  {t(item.text)}
                </span>

                <span className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-[var(--w-line)] pt-4">
                  <span className="tt-figure text-[1.05rem] text-[var(--w-accent)]">
                    {tenge(plan.monthly)}
                  </span>
                  <span className="text-[0.76rem] text-[var(--w-muted)]">
                    {t({ ru: "в месяц", kk: "айына" })} · {plan.lines.length}{" "}
                    {t({ ru: "услуг", kk: "қызмет" })} · {plan.days}{" "}
                    {t({ ru: "дней", kk: "күн" })}
                  </span>
                </span>

                <span className="mt-3 inline-flex items-center gap-2 text-[0.82rem] text-[var(--w-accent)]">
                  {on
                    ? t({ ru: "Набран в конструкторе", kk: "Конструкторда жиналды" })
                    : t({ ru: "Собрать в конструкторе", kk: "Конструкторда жинау" })}
                  <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden>
                    <path d="M13 5l7 7-7 7v-5H4v-4h9z" />
                  </svg>
                </span>
              </a>
            </Rise>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

import { useStage } from "@/components/showcase/depth";
import {
  countries,
  eur,
  kinds,
  match,
  purposes,
  type Kind,
  type Purpose,
} from "@/content/tr/countries";
import { cn } from "@/lib/cn";

/**
 * Подбор направления: зачем, что и на сколько.
 *
 * На их сайте поиск устроен как у всех порталов — страна, тип, цена,
 * «Найти», — и отвечает списком объектов. Вопрос, с которым на самом деле
 * приходят, звучит иначе: «у меня столько-то денег и такая-то цель, куда
 * вообще смотреть». Здесь отвечают именно на него: выбор сразу
 * пересчитывает список направлений, показывает вилку доходности и города
 * с фотографиями, а не выкидывает на страницу выдачи.
 */
export function Search() {
  const [purpose, setPurpose] = useState<Purpose | null>("rent");
  const [kind, setKind] = useState<Kind | null>(null);
  const [budget, setBudget] = useState(300);
  const [open, setOpen] = useState<string | null>(null);

  const found = match({ purpose, kind, budget });
  const stage = useStage<HTMLDivElement>();

  const band = found.length
    ? [Math.min(...found.map((c) => c.yield[0])), Math.max(...found.map((c) => c.yield[1]))]
    : null;

  return (
    <div ref={stage} className="grid gap-10">
      {/* Фильтр */}
      <div className="grid gap-8 rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-6 shadow-[var(--w-shadow)] sm:p-8">
        <fieldset>
          <legend className="tr-eyebrow">Зачем покупаете</legend>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {purposes.map((item) => {
              const on = purpose === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPurpose(on ? null : item.id)}
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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <fieldset>
            <legend className="tr-eyebrow">Что ищете</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {kinds.map((item) => {
                const on = kind === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setKind(on ? null : item.id)}
                    aria-pressed={on}
                    className={cn(
                      "cursor-pointer rounded-full border px-4 py-2 text-[0.86rem] transition-colors",
                      on
                        ? "border-[var(--w-accent)] bg-[var(--w-accent-soft)] text-[var(--w-ink)]"
                        : "border-[var(--w-line)] text-[var(--w-muted)] hover:border-[var(--w-accent)]",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="tr-eyebrow">Бюджет</legend>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="range"
                min={70}
                max={1000}
                step={10}
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                aria-label="Бюджет в тысячах евро"
                aria-valuetext={eur(budget)}
                className="tr-range min-w-0 flex-1"
              />
              <output
                aria-hidden
                className="tr-figure w-28 shrink-0 text-right text-[1.15rem] text-[var(--w-accent)]"
              >
                {eur(budget)}
              </output>
            </div>
            <p className="mt-2 text-[0.78rem] text-[var(--w-muted)]">
              От €70 тыс. — порог входа наших инвестиционных стратегий
            </p>
          </fieldset>
        </div>
      </div>

      {/* Итог подбора */}
      <div
        id="search-result"
        aria-live="polite"
        className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--w-line)] pb-4"
      >
        <p className="text-[1.05rem] text-[var(--w-ink)]">
          Подходит{" "}
          <b className="tr-figure text-[var(--w-accent)]">{found.length}</b>{" "}
          {plural(found.length)} из {countries.length}
        </p>
        {band ? (
          <p className="tr-figure text-[0.92rem] text-[var(--w-muted)]">
            доходность{" "}
            <span className="tr-yield">
              {band[0]}—{band[1]}%
            </span>{" "}
            годовых
          </p>
        ) : null}
      </div>

      {found.length === 0 ? (
        <p className="text-[0.94rem] leading-relaxed text-[var(--w-muted)]">
          Под такую цель и такой бюджет направлений не нашлось. Поднимите
          бюджет или снимите ограничение по типу объекта — а лучше позвоните:
          у нас 10 офисов и партнёры в тех странах, которых нет в этом списке.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {found.map((country, index) => {
            const shown = open === country.id;
            const cover = country.cities.find((city) => city.photo);
            return (
              <li
                key={country.id}
                style={{ "--nm-i": index } as React.CSSProperties}
                className="overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(shown ? null : country.id)}
                  aria-expanded={shown}
                  className="block w-full cursor-pointer text-left"
                >
                  <span className="relative block aspect-[16/10] w-full overflow-hidden bg-[var(--w-paper)]">
                    {cover?.photo ? (
                      <Image
                        src={`/images/tr/cities/${cover.photo}.webp`}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center">
                        <Image
                          src={`/images/tr/flags/${country.flag}.svg`}
                          alt=""
                          width={64}
                          height={48}
                          className="h-10 w-auto opacity-70"
                        />
                      </span>
                    )}
                    <span className="absolute left-3 top-3 flex items-center gap-2 rounded-[var(--w-radius)] bg-[var(--w-surface)]/90 px-2.5 py-1.5 backdrop-blur-sm">
                      <Image
                        src={`/images/tr/flags/${country.flag}.svg`}
                        alt=""
                        width={20}
                        height={14}
                        className="h-3.5 w-auto"
                      />
                      <span className="text-[0.82rem] font-medium">{country.name}</span>
                    </span>
                  </span>

                  <span className="flex items-baseline justify-between gap-3 px-5 pb-2 pt-4">
                    <span className="text-[0.8rem] text-[var(--w-muted)]">вход от</span>
                    <span className="tr-figure text-[1.02rem] text-[var(--w-ink)]">
                      {eur(country.entry)}
                    </span>
                  </span>
                  <span className="flex items-baseline justify-between gap-3 px-5 pb-4">
                    <span className="text-[0.8rem] text-[var(--w-muted)]">доходность</span>
                    <span className="tr-figure tr-yield text-[1.02rem]">
                      {country.yield[0]}—{country.yield[1]}%
                    </span>
                  </span>
                </button>

                {shown ? (
                  <div className="border-t border-[var(--w-line)] px-5 py-4">
                    <p className="text-[0.84rem] leading-relaxed text-[var(--w-muted)]">
                      {country.note}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {country.cities.map((city) => (
                        <li
                          key={city.name}
                          className="rounded-full border border-[var(--w-line)] px-2.5 py-1 text-[0.76rem] text-[var(--w-muted)]"
                        >
                          {city.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-[0.78rem] leading-relaxed text-[var(--w-muted)]">
        Порог входа по направлению — ориентир: точную цену называем по
        конкретному объекту. Доходности — по нашим четырём стратегиям.
      </p>
    </div>
  );
}

function plural(count: number): string {
  const last = count % 10;
  const teen = count % 100 >= 11 && count % 100 <= 14;
  if (!teen && last === 1) return "направление";
  if (!teen && last >= 2 && last <= 4) return "направления";
  return "направлений";
}

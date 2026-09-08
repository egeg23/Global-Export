"use client";

import { useId, useMemo, useState } from "react";

import { SetCard } from "@/components/adar/ui/set-card";
import { Shell } from "@/components/adar/ui/shell";
import { items, lines, sets } from "@/content/adar/catalog";
import { priceRange, searchIndex, translit } from "@/lib/adar/catalog";
import { formatNumber, formatPrice, plural, pluralize } from "@/lib/adar/format";
import { cn } from "@/lib/cn";
import type { GiftSet, SetLine } from "@/lib/adar/types";

type Sort = "price-asc" | "price-desc" | "weight-desc" | "count-desc";

const sorts: { id: Sort; label: string }[] = [
  { id: "price-asc", label: "сначала дешевле" },
  { id: "price-desc", label: "сначала дороже" },
  { id: "weight-desc", label: "тяжелее" },
  { id: "count-desc", label: "больше позиций" },
];

/**
 * Поисковый указатель считается один раз на модуль, а не на каждое нажатие
 * клавиши: восемьдесят наборов, тысяча восемьсот строк состава — собирать
 * это заново на каждый символ незачем.
 */
const haystack = new Map(sets.map((set) => [set.slug, searchIndex(set)]));

const STEP = 12;

/**
 * Каталог с поиском и фильтрами.
 *
 * Ищет не только по названию набора, но и по тому, что внутри: «киндер»
 * находит семнадцать наборов, а не ноль. Найденные наименования показываются
 * прямо в карточке — иначе непонятно, почему набор попал в выдачу.
 */
export function CatalogBrowser() {
  const id = useId();
  const [query, setQuery] = useState("");
  const [line, setLine] = useState<SetLine | "all">("all");
  const [budget, setBudget] = useState(priceRange.max);
  const [pack, setPack] = useState<GiftSet["pack"] | "all">("all");
  const [sort, setSort] = useState<Sort>("price-asc");
  const [shown, setShown] = useState(STEP);

  const needle = query.trim().toLowerCase();
  // «киндер» и «kinder» должны находить одно и то же.
  const latin = translit(needle);

  const found = useMemo(() => {
    const filtered = sets.filter((set) => {
      if (set.price > budget) return false;
      if (line !== "all" && set.line !== line) return false;
      if (pack !== "all" && set.pack !== pack) return false;
      if (needle) {
        const hay = haystack.get(set.slug) ?? "";
        if (!hay.includes(needle) && !hay.includes(latin)) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "weight-desc") return b.weight - a.weight;
      return b.count - a.count;
    });
    return sorted;
  }, [budget, latin, line, needle, pack, sort]);

  const visible = found.slice(0, shown);
  const dirty = Boolean(needle) || line !== "all" || pack !== "all" || budget !== priceRange.max;

  function reset() {
    setQuery("");
    setLine("all");
    setPack("all");
    setBudget(priceRange.max);
    setShown(STEP);
  }

  /** Наименования внутри набора, попавшие под запрос. */
  function matchedContents(set: GiftSet): string[] {
    if (!needle) return [];
    const names = set.parts.map(([item]) => items[item]).filter((name) => {
      const lower = name.toLowerCase();
      return lower.includes(needle) || translit(lower).includes(latin);
    });
    return [...new Set(names)].slice(0, 3);
  }

  const chip =
    "rounded-full border px-4 py-2 text-sm transition-colors duration-200 cursor-pointer";
  const chipOff =
    "border-adar-green-900/12 bg-white text-adar-ink-muted hover:border-adar-green-900/30 hover:text-adar-ink";
  const chipOn = "border-adar-green-900 bg-adar-green-900 text-adar-cream-50";

  return (
    <section id="katalog" className="bg-adar-cream-100/70 py-20 lg:py-28">
      <Shell size="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-adar-green-500">
              Каталог
            </p>
            <h2 className="mt-4 font-adar-display text-4xl leading-tight text-adar-green-950 sm:text-5xl">
              {sets.length} наборов и поиск по составу
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-adar-ink-muted">
            Наберите «киндер», «сок» или «мешок» — найдутся наборы, где это
            действительно лежит внутри. Бюджет и линейка сужают выдачу до
            нескольких вариантов.
          </p>
        </div>

        {/* Панель фильтров */}
        <div className="mt-10 rounded-adar border border-adar-green-900/10 bg-adar-cream-50 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <label
                htmlFor={`${id}-q`}
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-adar-ink-subtle"
              >
                Поиск по названию и составу
              </label>
              <div className="relative">
                <input
                  id={`${id}-q`}
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setShown(STEP);
                  }}
                  placeholder="киндер, сок, мешок, VIP…"
                  className="w-full rounded-xl border border-adar-green-900/12 bg-white py-3 pl-11 pr-4 text-base outline-none transition-colors focus-visible:border-adar-green-700"
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-adar-ink-subtle"
                >
                  <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="m13.5 13.5 3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="lg:col-span-4">
              <label
                htmlFor={`${id}-budget`}
                className="mb-2 flex items-baseline justify-between text-xs font-medium uppercase tracking-[0.14em] text-adar-ink-subtle"
              >
                Бюджет до
                <span className="text-sm font-medium normal-case tracking-normal text-adar-green-800 tabular-nums">
                  {formatPrice(budget)}
                </span>
              </label>
              <input
                id={`${id}-budget`}
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={10000}
                value={budget}
                onChange={(event) => {
                  setBudget(Number(event.target.value));
                  setShown(STEP);
                }}
                className="h-9 w-full cursor-pointer accent-adar-green-800"
              />
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor={`${id}-sort`}
                className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-adar-ink-subtle"
              >
                Сортировка
              </label>
              <select
                id={`${id}-sort`}
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="w-full cursor-pointer rounded-xl border border-adar-green-900/12 bg-white px-3 py-3 text-sm outline-none focus-visible:border-adar-green-700"
              >
                {sorts.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-adar-green-900/8 pt-6">
            <button
              type="button"
              onClick={() => {
                setLine("all");
                setShown(STEP);
              }}
              className={cn(chip, line === "all" ? chipOn : chipOff)}
            >
              Все линейки
            </button>
            {lines.map((option) => (
              <button
                key={option.id}
                type="button"
                title={option.hint}
                onClick={() => {
                  setLine(option.id);
                  setShown(STEP);
                }}
                className={cn(chip, line === option.id ? chipOn : chipOff)}
              >
                {option.label}
              </button>
            ))}

            <span aria-hidden="true" className="mx-2 hidden h-6 w-px bg-adar-green-900/12 sm:block" />

            {(
              [
                { id: "all", label: "Любая упаковка" },
                { id: "box", label: "Коробка" },
                { id: "bag", label: "Мешок" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setPack(option.id);
                  setShown(STEP);
                }}
                className={cn(chip, pack === option.id ? chipOn : chipOff)}
              >
                {option.label}
              </button>
            ))}

            {dirty ? (
              <button
                type="button"
                onClick={reset}
                className="ml-auto cursor-pointer text-sm text-adar-ink-subtle underline underline-offset-4 transition-colors hover:text-adar-ink"
              >
                Сбросить
              </button>
            ) : null}
          </div>
        </div>

        <p aria-live="polite" className="mt-6 text-sm text-adar-ink-muted">
          {found.length > 0 ? (
            <>
              Найден{plural(found.length, ["", "о", "о"])}{" "}
              <strong className="font-medium text-adar-ink">
                {pluralize(found.length, ["набор", "набора", "наборов"])}
              </strong>
              {found.length > 1 ? (
                <>
                  {" "}
                  · от {formatNumber(Math.min(...found.map((set) => set.price)))} до{" "}
                  {formatNumber(Math.max(...found.map((set) => set.price)))} сум
                </>
              ) : null}
            </>
          ) : (
            "Ничего не нашлось — попробуйте поднять бюджет или сбросить фильтры."
          )}
        </p>

        {found.length > 0 ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((set) => {
              const matched = matchedContents(set);
              return (
                <li key={set.slug} className="flex">
                  <div className="flex w-full flex-col">
                    <SetCard set={set} className="flex-1" />
                    {matched.length > 0 ? (
                      <p className="mt-2 px-1 text-xs leading-relaxed text-adar-green-700">
                        В составе: {matched.join(", ")}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}

        {shown < found.length ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShown((value) => value + STEP * 2)}
              className="cursor-pointer rounded-full border border-adar-green-900/15 bg-white px-7 py-3.5 text-sm font-medium text-adar-green-900 transition-colors duration-300 hover:border-adar-green-900/35"
            >
              Показать ещё — осталось {found.length - shown}
            </button>
          </div>
        ) : null}
      </Shell>
    </section>
  );
}

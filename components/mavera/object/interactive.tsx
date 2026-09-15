"use client";

import { useMemo, useState } from "react";

import { money } from "@/components/present/mavera/theme";
import { banks, monthlyPayment } from "@/content/mavera/banks";
import { projects } from "@/content/mavera/data";
import { cn } from "@/lib/cn";
import { area, corpusCount, filterFlats, flatsOf, type Flat } from "@/lib/mavera/flats";

/**
 * Выбор квартиры и расчёт ипотеки — одним компонентом.
 *
 * Разделять их нельзя: смысл экрана в том, что выбранная квартира тут же
 * попадает в калькулятор, и посетитель видит платёж по конкретной квартире, а
 * не по «средней цене». Ради этого состояние живёт здесь, а не в двух местах.
 *
 * Показ различается по вариантам: «Стандарт» получает таблицу, которую можно
 * сортировать глазами, «Люкс» — карточки, «Премиум» — шахматку этажей. Данные
 * при этом одни и те же.
 */

type Variant = "standard" | "lux" | "premium";

const statusLabel: Record<Flat["status"], string> = {
  free: "Свободна",
  booked: "Бронь",
  sold: "Продана",
};

/** Четыре типовые планировки — рисуются, а не подставляются картинкой. */
function FlatPlan({ plan, rooms }: { plan: number; rooms: number }) {
  const walls = "var(--w-ink)";
  const rooms3 = (
    <>
      <rect x="6" y="6" width="104" height="78" />
      <rect x="110" y="6" width="84" height="44" />
      <rect x="110" y="50" width="84" height="34" />
      <rect x="6" y="84" width="70" height="60" />
      <rect x="76" y="84" width="118" height="60" />
    </>
  );
  const rooms2 = (
    <>
      <rect x="6" y="6" width="120" height="70" />
      <rect x="126" y="6" width="68" height="70" />
      <rect x="6" y="76" width="90" height="68" />
      <rect x="96" y="76" width="98" height="68" />
    </>
  );
  const rooms1 = (
    <>
      <rect x="6" y="6" width="188" height="86" />
      <rect x="6" y="92" width="96" height="52" />
      <rect x="102" y="92" width="92" height="52" />
    </>
  );
  const rooms4 = (
    <>
      <rect x="6" y="6" width="88" height="62" />
      <rect x="94" y="6" width="100" height="62" />
      <rect x="6" y="68" width="88" height="42" />
      <rect x="94" y="68" width="100" height="42" />
      <rect x="6" y="110" width="188" height="34" />
    </>
  );

  const shape = rooms >= 4 ? rooms4 : rooms === 3 ? rooms3 : rooms === 2 ? rooms2 : rooms1;

  return (
    <svg viewBox="0 0 200 150" className="h-full w-full" role="img" aria-label={`Планировка №${plan}`}>
      <g
        stroke={walls}
        strokeOpacity="0.45"
        strokeWidth="3"
        fill="var(--w-ink)"
        fillOpacity="0.05"
        transform={plan % 2 === 0 ? "translate(200,0) scale(-1,1)" : undefined}
      >
        {shape}
      </g>
      {/* Балкон — по стороне, которая зависит от планировки. */}
      <rect
        x={plan > 2 ? 194 : 0}
        y="96"
        width="6"
        height="40"
        fill="var(--w-accent)"
        opacity="0.8"
      />
    </svg>
  );
}

export function ObjectInteractive({ slug, variant }: { slug: string; variant: Variant }) {
  const project = projects.find((p) => p.slug === slug);
  const all = useMemo(() => flatsOf(slug), [slug]);
  const corpuses = project ? corpusCount(project) : 1;

  const [rooms, setRooms] = useState<number[]>([]);
  const [corpus, setCorpus] = useState<number | null>(null);
  const [floorFrom, setFloorFrom] = useState(2);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [onlyFree, setOnlyFree] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const found = useMemo(
    () =>
      filterFlats(all, { rooms, corpus, floorFrom, priceMaxUsd: priceMax, onlyFree }).sort(
        (a, b) => a.priceUsd - b.priceUsd,
      ),
    [all, rooms, corpus, floorFrom, priceMax, onlyFree],
  );

  const selected = found.find((f) => f.id === selectedId) ?? found[0] ?? all[0];

  // Ипотека считается по выбранной квартире, а не по «цене от».
  const [bankId, setBankId] = useState(banks[0].id);
  const bank = banks.find((b) => b.id === bankId) ?? banks[0];
  const [downShare, setDownShare] = useState(0.3);
  const [years, setYears] = useState(10);

  const price = selected?.priceUsd ?? 0;
  const down = Math.round(price * Math.max(downShare, bank.down));
  const loan = Math.max(price - down, 0);
  const term = Math.min(years, bank.years);
  const monthly = loan > 0 ? monthlyPayment(loan, bank.rate, term) : 0;
  const overpay = monthly * term * 12 - loan;

  const toggleRoom = (n: number) =>
    setRooms((prev) => (prev.includes(n) ? prev.filter((r) => r !== n) : [...prev, n]));

  const chip = (active: boolean) =>
    cn(
      "px-4 py-2 text-sm transition-colors duration-200",
      variant === "premium" ? "rounded-full" : variant === "lux" ? "rounded-[2px]" : "rounded-none",
      active
        ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
        : "border border-[var(--w-line)] text-[var(--w-muted)] hover:text-[var(--w-ink)]",
    );

  const surface = cn(
    "border border-[var(--w-line)] bg-[var(--w-surface)]",
    variant === "premium" ? "rounded-[var(--w-radius-lg)]" : variant === "lux" ? "rounded-[2px]" : "rounded-none",
  );

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* Фильтры и результаты */}
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button key={n} type="button" onClick={() => toggleRoom(n)} className={chip(rooms.includes(n))}>
              {n}-комн.
            </button>
          ))}
          <span className="mx-1 h-6 w-px bg-[var(--w-line)]" />
          <button type="button" onClick={() => setCorpus(null)} className={chip(corpus === null)}>
            Все корпуса
          </button>
          {Array.from({ length: corpuses }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" onClick={() => setCorpus(n)} className={chip(corpus === n)}>
              Корпус {n}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="flex items-baseline justify-between text-sm">
              <span className="text-[var(--w-muted)]">Этаж не ниже</span>
              <span className="tabular-nums">{floorFrom}</span>
            </span>
            <input
              type="range"
              min={2}
              max={20}
              value={floorFrom}
              onChange={(e) => setFloorFrom(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--w-accent)]"
            />
          </label>

          <label className="block">
            <span className="flex items-baseline justify-between text-sm">
              <span className="text-[var(--w-muted)]">Бюджет до</span>
              <span className="tabular-nums">
                {priceMax ? money(priceMax, "uzs") : "без ограничения"}
              </span>
            </span>
            <input
              type="range"
              min={40000}
              max={200000}
              step={5000}
              value={priceMax ?? 200000}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPriceMax(v >= 200000 ? null : v);
              }}
              className="mt-2 w-full accent-[var(--w-accent)]"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--w-line)] py-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setOnlyFree(e.target.checked)}
              className="h-4 w-4 accent-[var(--w-accent)]"
            />
            Только свободные
          </label>
          <p className="text-sm text-[var(--w-muted)]">
            Найдено: <span className="font-medium text-[var(--w-ink)] tabular-nums">{found.length}</span>
          </p>
        </div>

        {/* Показ результата — свой в каждом варианте */}
        {variant === "premium" ? (
          <ChessBoard flats={found} selectedId={selected?.id} onPick={setSelectedId} />
        ) : variant === "lux" ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {found.slice(0, 8).map((flat) => (
              <li key={flat.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(flat.id)}
                  className={cn(
                    "w-full border p-5 text-left transition-colors duration-300",
                    flat.id === selected?.id
                      ? "border-[var(--w-accent)] bg-[var(--w-surface)]"
                      : "border-[var(--w-line)] hover:border-[var(--w-ink)]",
                  )}
                >
                  <p className="font-[family-name:var(--w-display)] text-xl">
                    {flat.rooms}-комнатная, {area(flat.area)} м²
                  </p>
                  <p className="mt-1.5 text-sm text-[var(--w-muted)]">
                    Корпус {flat.corpus} · {flat.floor} этаж · {flat.view.toLowerCase()}
                  </p>
                  <p className="mt-3 font-[family-name:var(--w-display)] text-lg">
                    {money(flat.priceUsd, "uzs")}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--w-line)] text-[0.65rem] uppercase tracking-[0.14em] text-[var(--w-muted)]">
                  <th className="py-3 pr-4 font-normal">Корпус</th>
                  <th className="py-3 pr-4 font-normal">Этаж</th>
                  <th className="py-3 pr-4 font-normal">Комнат</th>
                  <th className="py-3 pr-4 font-normal">Площадь</th>
                  <th className="py-3 pr-4 font-normal">Вид</th>
                  <th className="py-3 pr-4 font-normal">Цена</th>
                  <th className="py-3 font-normal">Статус</th>
                </tr>
              </thead>
              <tbody>
                {found.slice(0, 10).map((flat) => (
                  <tr
                    key={flat.id}
                    onClick={() => setSelectedId(flat.id)}
                    className={cn(
                      "cursor-pointer border-b border-[var(--w-line)] transition-colors",
                      flat.id === selected?.id ? "bg-[var(--w-accent-soft)]" : "hover:bg-[var(--w-paper)]",
                    )}
                  >
                    <td className="py-3 pr-4 tabular-nums">{flat.corpus}</td>
                    <td className="py-3 pr-4 tabular-nums">{flat.floor}</td>
                    <td className="py-3 pr-4 tabular-nums">{flat.rooms}</td>
                    <td className="py-3 pr-4 tabular-nums">{area(flat.area)} м²</td>
                    <td className="py-3 pr-4 text-[var(--w-muted)]">{flat.view}</td>
                    <td className="py-3 pr-4 tabular-nums">{money(flat.priceUsd, "uzs")}</td>
                    <td className="py-3 text-[var(--w-muted)]">{statusLabel[flat.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {found.length === 0 ? (
          <p className="mt-6 border border-[var(--w-line)] px-6 py-12 text-center text-sm text-[var(--w-muted)]">
            По этим условиям ничего нет. Снимите один из фильтров.
          </p>
        ) : null}
      </div>

      {/* Карточка квартиры и калькулятор */}
      <div className="lg:col-span-5">
        <div className={cn(surface, "p-6 sm:p-7")}>
          {selected ? (
            <>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-xl">
                  {selected.rooms}-комнатная, {area(selected.area)} м²
                </h3>
                <span className="text-sm text-[var(--w-muted)]">{statusLabel[selected.status]}</span>
              </div>
              <p className="mt-1.5 text-sm text-[var(--w-muted)]">
                Корпус {selected.corpus} · {selected.floor} этаж · {selected.view.toLowerCase()} ·
                планировка №{selected.plan}
              </p>

              <div className="mt-5 h-44 border border-[var(--w-line)] p-3">
                <FlatPlan plan={selected.plan} rooms={selected.rooms} />
              </div>

              <p className="mt-5 text-2xl font-medium tabular-nums">{money(selected.priceUsd, "uzs")}</p>
              <p className="mt-1 text-sm text-[var(--w-muted)]">
                {money(Math.round(selected.priceUsd / selected.area), "uzs")} за м²
              </p>
            </>
          ) : null}

          {/* Калькулятор — считает по выбранной квартире */}
          <div className="mt-7 border-t border-[var(--w-line)] pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="text-lg">Ипотека и рассрочка</h4>
              <span className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--w-muted)]">
                Расчёт примерный
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {banks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setBankId(item.id);
                    setDownShare((prev) => Math.max(prev, item.down));
                    setYears((prev) => Math.min(prev, item.years));
                  }}
                  className={cn(
                    "px-3 py-1.5 text-xs transition-colors duration-200",
                    variant === "premium" ? "rounded-full" : "rounded-none",
                    item.id === bankId
                      ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
                      : "border border-[var(--w-line)] text-[var(--w-muted)] hover:text-[var(--w-ink)]",
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-[var(--w-muted)]">
              {bank.note} · ставка {bank.rate === 0 ? "0%" : `${bank.rate}%`} · взнос от{" "}
              {Math.round(bank.down * 100)}% · до {bank.years} лет
            </p>

            <label className="mt-5 block">
              <span className="flex items-baseline justify-between text-sm">
                <span className="text-[var(--w-muted)]">Первый взнос</span>
                <span className="tabular-nums">
                  {Math.round(downShare * 100)}% · {money(down, "uzs")}
                </span>
              </span>
              <input
                type="range"
                min={Math.round(bank.down * 100)}
                max={90}
                value={Math.round(downShare * 100)}
                onChange={(e) => setDownShare(Number(e.target.value) / 100)}
                className="mt-2 w-full accent-[var(--w-accent)]"
              />
            </label>

            <label className="mt-4 block">
              <span className="flex items-baseline justify-between text-sm">
                <span className="text-[var(--w-muted)]">Срок</span>
                <span className="tabular-nums">
                  {term < 2 ? `${Math.round(term * 12)} мес.` : `${term} лет`}
                </span>
              </span>
              <input
                type="range"
                min={1}
                max={bank.years}
                step={bank.years < 2 ? 0.5 : 1}
                value={term}
                onChange={(e) => setYears(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--w-accent)]"
              />
            </label>

            <dl className="mt-6 space-y-2.5 border-t border-[var(--w-line)] pt-5 text-sm">
              {[
                ["Ежемесячный платёж", money(Math.round(monthly), "uzs")],
                ["Сумма кредита", money(loan, "uzs")],
                ["Переплата", bank.rate === 0 ? "нет" : money(Math.round(overpay), "uzs")],
              ].map(([label, value], index) => (
                <div key={label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-[var(--w-muted)]">{label}</dt>
                  <dd className={cn("tabular-nums", index === 0 && "text-lg font-medium")}>{value}</dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              className={cn(
                "mt-6 w-full bg-[var(--w-accent)] px-6 py-3.5 text-sm font-medium text-[var(--w-accent-ink)] transition-opacity hover:opacity-90",
                variant === "premium" ? "w-glow rounded-full" : "rounded-none",
              )}
            >
              {selected?.status === "free" ? "Забронировать на 5 дней" : "Оставить заявку"}
            </button>

            <p className="mt-3 text-xs leading-relaxed text-[var(--w-muted)]">
              Ставки банков условные и заданы для примера — в готовом сайте они
              правятся в панели управления. Точные условия подтверждает банк.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Шахматка «Премиума»: этаж — строка, квартира — клетка. */
function ChessBoard({
  flats,
  selectedId,
  onPick,
}: {
  flats: Flat[];
  selectedId?: string;
  onPick: (id: string) => void;
}) {
  const floors = [...new Set(flats.map((f) => f.floor))].sort((a, b) => b - a);

  return (
    <div className="mt-6 rounded-[var(--w-radius-lg)] border border-[var(--w-line)] p-4">
      <div className="flex max-h-[26rem] flex-col gap-1.5 overflow-y-auto pr-1">
        {floors.map((floor) => (
          <div key={floor} className="flex items-center gap-2">
            <span className="w-6 shrink-0 text-right text-xs tabular-nums text-[var(--w-muted)]">
              {floor}
            </span>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {flats
                .filter((f) => f.floor === floor)
                .map((flat) => (
                  <button
                    key={flat.id}
                    type="button"
                    onClick={() => onPick(flat.id)}
                    aria-label={`Корпус ${flat.corpus}, этаж ${flat.floor}, ${flat.rooms}-комнатная ${area(flat.area)} м²`}
                    title={`${flat.rooms}к · ${area(flat.area)} м² · корпус ${flat.corpus}`}
                    className={cn(
                      "h-6 w-9 rounded-[4px] text-[0.6rem] tabular-nums transition-all duration-200",
                      flat.status === "free"
                        ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
                        : flat.status === "booked"
                          ? "bg-[var(--w-accent)]/40 text-[var(--w-ink)]"
                          : "bg-[var(--w-line)] text-[var(--w-muted)]",
                      flat.id === selectedId && "outline outline-2 outline-offset-2 outline-[var(--w-ink)]",
                    )}
                  >
                    {flat.rooms}к
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--w-line)] pt-4 text-xs text-[var(--w-muted)]">
        {[
          ["Свободна", "bg-[var(--w-accent)]"],
          ["Бронь", "bg-[var(--w-accent)]/40"],
          ["Продана", "bg-[var(--w-line)]"],
        ].map(([label, tone]) => (
          <span key={label} className="flex items-center gap-2">
            <span className={cn("h-3 w-5 rounded-[3px]", tone)} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

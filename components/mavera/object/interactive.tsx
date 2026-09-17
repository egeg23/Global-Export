"use client";

import { useMemo, useState } from "react";

import { Addon, useAddon } from "@/components/configurator/context";
import { useCountUp, useMotionPreferred } from "@/components/mavera/motion";
import { FlatPlan } from "@/components/mavera/object/flat-plan";
import { money } from "@/components/present/mavera/theme";
import { banks, monthlyPayment } from "@/content/mavera/banks";
import type { Plan } from "@/content/mavera/plans";
import { cn } from "@/lib/cn";
import { area, filterFlats, type Flat } from "@/lib/mavera/catalog";

/**
 * Выбор квартиры и расчёт ипотеки — одним компонентом.
 *
 * Разделять их нельзя: смысл экрана в том, что выбранная квартира тут же
 * попадает в калькулятор, и посетитель видит платёж по конкретной квартире, а
 * не по «средней цене». Ради этого состояние живёт здесь, а не в двух местах.
 *
 * Показ различается по вариантам, и различие — в наполнении, а не только в
 * оформлении: цена пакета должна быть видна в возможностях. «Стандарт» —
 * таблица квартир с выбором комнатности, без ползунков и без чертежа; «Люкс» —
 * фильтры по корпусу, этажу и бюджету и карточки; «Премиум» — то же плюс
 * чертёж планировки, а шахматка, калькулятор и бронь у него в пакете. Данные
 * при этом одни и те же.
 *
 * Список квартир, чертежи и подписи приходят с сервера готовыми: здесь только
 * фильтр, выбор и расчёт платежа. Как квартиры получаются — браузер не знает.
 */

type Variant = "standard" | "lux" | "premium" | "noir";

/** До какого числа держится бронь: пять дней от момента нажатия. Считается в обработчике, не при отрисовке. */
function bookedUntilLabel(): string {
  const date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

const statusLabel: Record<Flat["status"], string> = {
  free: "Свободна",
  booked: "Бронь",
  sold: "Продана",
};

export function ObjectInteractive({
  variant,
  flats: source,
  corpuses,
  plans,
  projectName,
}: {
  variant: Variant;
  flats: Flat[];
  corpuses: number;
  plans: Plan[];
  projectName: string;
}) {
  const [rooms, setRooms] = useState<number[]>([]);
  const [corpus, setCorpus] = useState<number | null>(null);
  const [floorFrom, setFloorFrom] = useState(2);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [onlyFree, setOnlyFree] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Онлайн-бронирование: бронь меняет статус квартиры здесь же — в шахматке,
  // в списке и в карточке. Заявка без брони просто подтверждается.
  const [booked, setBooked] = useState<Record<string, string>>({});
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const all = useMemo(
    () => source.map((flat) => (booked[flat.id] ? { ...flat, status: "booked" as const } : flat)),
    [source, booked],
  );

  // Движение разрешают и система, и тумблер «Анимации» в конструкторе.
  const systemMotion = useMotionPreferred();
  const addonMotion = useAddon("motion");
  const motion = systemMotion && addonMotion;
  // Допники карточки: шахматка вместо списка, калькулятор, бронь вместо заявки.
  const chess = useAddon("chess");
  const booking = useAddon("booking");
  // Допник «Избранное»: подборка живёт здесь же, в состоянии подбора.
  const favorites = useAddon("favorites");
  const [saved, setSaved] = useState<string[]>([]);
  const toggleSaved = (id: string) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const found = useMemo(
    () =>
      filterFlats(all, { rooms, corpus, floorFrom, priceMaxUsd: priceMax, onlyFree }).sort(
        (a, b) => a.priceUsd - b.priceUsd,
      ),
    [all, rooms, corpus, floorFrom, priceMax, onlyFree],
  );

  // Только что забронированная квартира остаётся в карточке, даже если фильтр
  // «только свободные» убрал её из списка: человек должен видеть, что сделал.
  const selected =
    (selectedId && booked[selectedId] ? all : found).find((f) => f.id === selectedId) ?? found[0] ?? all[0];
  const bookedUntil = selected ? booked[selected.id] : undefined;
  const isRequested = selected ? requestedIds.includes(selected.id) : false;
  // Меняется при любой правке фильтра — список переигрывает появление.
  const listKey = `${rooms.join()}-${corpus}-${floorFrom}-${priceMax}-${onlyFree}`;
  const shownPrice = useCountUp(selected?.priceUsd ?? 0, motion);
  const plan = selected ? { name: selected.planName, note: selected.planNote } : null;
  const drawing = selected ? (plans.find((item) => item.id === selected.planId) ?? plans[0]) : null;

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

  // Уровень подбора по пакету: см. описание вверху файла. «Noir» — тот же пакет, что «Премиум».
  const top = variant === "premium" || variant === "noir";
  const simple = variant === "standard";
  const withDrawing = top;

  const chip = (active: boolean) =>
    cn(
      "px-4 py-2 text-sm transition-colors duration-200",
      top ? "rounded-full" : variant === "lux" ? "rounded-[2px]" : "rounded-none",
      active
        ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
        : "border border-[var(--w-line)] text-[var(--w-muted)] hover:text-[var(--w-ink)]",
    );

  const surface = cn(
    "border border-[var(--w-line)] bg-[var(--w-surface)]",
    top ? "rounded-[var(--w-radius-lg)]" : variant === "lux" ? "rounded-[2px]" : "rounded-none",
  );

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* Фильтры и результаты. min-w-0: иначе таблица квартир распирает колонку и страницу на телефоне. */}
      <div className="min-w-0 lg:col-span-7">
        <div className="flex flex-wrap items-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button key={n} type="button" onClick={() => toggleRoom(n)} className={chip(rooms.includes(n))}>
              {n}-комн.
            </button>
          ))}
          {simple ? null : (
            <>
              <span className="mx-1 h-6 w-px bg-[var(--w-line)]" />
              <button type="button" onClick={() => setCorpus(null)} className={chip(corpus === null)}>
                Все корпуса
              </button>
              {Array.from({ length: corpuses }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" onClick={() => setCorpus(n)} className={chip(corpus === n)}>
                  Корпус {n}
                </button>
              ))}
            </>
          )}
        </div>

        {simple ? null : (
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
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--w-line)] py-4">
          {simple ? (
            <span className="text-sm text-[var(--w-muted)]">Свободные квартиры всех корпусов</span>
          ) : (
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={onlyFree}
                onChange={(e) => setOnlyFree(e.target.checked)}
                className="h-4 w-4 accent-[var(--w-accent)]"
              />
              Только свободные
            </label>
          )}
          <p className="text-sm text-[var(--w-muted)]">
            Найдено:{" "}
            <span key={found.length} className="mv-fade font-medium text-[var(--w-ink)] tabular-nums">
              {found.length}
            </span>
          </p>
        </div>

        {/* Показ результата: шахматка — допник; без неё свой список в каждом варианте */}
        <Addon id="chess" compact className="mt-6">
          <ChessBoard key={listKey} flats={found} selectedId={selected?.id} onPick={setSelectedId} />
        </Addon>
        {chess ? null : variant === "lux" ? (
          <ul key={listKey} className="mt-6 grid gap-4 sm:grid-cols-2">
            {found.slice(0, 8).map((flat, index) => (
              <li key={flat.id} className="w-row" style={{ "--w-delay": `${index * 55}ms` } as React.CSSProperties}>
                <button
                  type="button"
                  onClick={() => setSelectedId(flat.id)}
                  className={cn(
                    "w-full border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 motion-reduce:transform-none",
                    flat.id === selected?.id
                      ? "border-[var(--w-accent)] bg-[var(--w-surface)]"
                      : "border-[var(--w-line)] hover:border-[var(--w-ink)]",
                  )}
                >
                  <p className="font-[family-name:var(--w-display)] text-xl">
                    {favorites && saved.includes(flat.id) ? <span className="mr-1.5 text-[var(--w-accent)]">♥</span> : null}
                    {flat.typeName}, {area(flat.area)} м²
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
              <tbody key={listKey}>
                {found.slice(0, 10).map((flat, index) => (
                  <tr
                    key={flat.id}
                    onClick={() => setSelectedId(flat.id)}
                    style={{ "--w-delay": `${index * 35}ms` } as React.CSSProperties}
                    className={cn(
                      "w-row cursor-pointer border-b border-[var(--w-line)] transition-colors duration-300",
                      flat.id === selected?.id ? "bg-[var(--w-accent-soft)]" : "hover:bg-[var(--w-paper)]",
                    )}
                  >
                    <td className="py-3 pr-4 tabular-nums">
                      {favorites && saved.includes(flat.id) ? <span className="mr-1.5 text-[var(--w-accent)]">♥</span> : null}
                      {flat.corpus}
                    </td>
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
                  {selected.typeName}, {area(selected.area)} м²
                </h3>
                <span className="text-sm text-[var(--w-muted)]">{statusLabel[selected.status]}</span>
              </div>
              <p className="mt-1.5 text-sm text-[var(--w-muted)]">
                Корпус {selected.corpus} · {selected.floor} этаж · {selected.view.toLowerCase()}
              </p>

              {/* Чертёж планировки — «Премиум»; «Люкс» называет планировку словами, «Стандарт» — нет. */}
              {withDrawing ? (
                <div className="mt-5 aspect-[320/232] border border-[var(--w-line)] p-2.5">
                  {drawing ? (
                    <FlatPlan key={selected.id} plan={drawing} areas={selected.roomAreas} area={selected.area} />
                  ) : null}
                </div>
              ) : null}
              {plan && !simple ? (
                <p key={`${plan.name}-note`} className="mv-fade mt-3 text-xs leading-relaxed text-[var(--w-muted)]">
                  <span className="font-medium text-[var(--w-ink)]">{plan.name}. </span>
                  {plan.note}
                </p>
              ) : null}

              <p className="mt-5 text-2xl font-medium tabular-nums">{money(shownPrice, "uzs")}</p>
              <p className="mt-1 text-sm text-[var(--w-muted)]">
                {money(Math.round(selected.priceUsd / selected.area), "uzs")} за м²
              </p>

              {/* Допник «Избранное и подборка»: сердечко и подборка, которая уходит ссылкой. */}
              <Addon id="favorites" compact className="mt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    aria-pressed={saved.includes(selected.id)}
                    onClick={() => toggleSaved(selected.id)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200",
                      top ? "rounded-full" : variant === "lux" ? "rounded-[2px]" : "rounded-none",
                      saved.includes(selected.id)
                        ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
                        : "border border-[var(--w-line)] text-[var(--w-muted)] hover:text-[var(--w-ink)]",
                    )}
                  >
                    <span aria-hidden="true">♥</span>
                    {saved.includes(selected.id) ? "В подборке" : "В подборку"}
                  </button>
                  <span className="text-xs text-[var(--w-muted)]">
                    Сохранено: <span className="font-medium text-[var(--w-ink)] tabular-nums">{saved.length}</span>
                    {saved.length ? (
                      <>
                        {" · "}
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(
                            `ЖК «${projectName}» — подборка:\n` +
                              all
                                .filter((flat) => saved.includes(flat.id))
                                .map((flat) => `${flat.typeName}, ${area(flat.area)} м², корпус ${flat.corpus}, ${flat.floor} этаж — ${money(flat.priceUsd, "uzs")}`)
                                .join("\n"),
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-dotted underline-offset-2 hover:text-[var(--w-ink)]"
                        >
                          Отправить подборку в Telegram
                        </a>
                      </>
                    ) : null}
                  </span>
                </div>
              </Addon>
            </>
          ) : null}

          {/* Калькулятор — допник; считает по выбранной квартире */}
          <Addon id="calc" className="mt-7 border-t border-[var(--w-line)] pt-6">
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
                    top ? "rounded-full" : "rounded-none",
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

            <p className="mt-4 text-xs leading-relaxed text-[var(--w-muted)]">
              Ставки банков условные и заданы для примера — в готовом сайте они
              правятся в панели управления. Точные условия подтверждает банк.
            </p>
          </Addon>

          <div className="mt-6 border-t border-[var(--w-line)] pt-6">
            {selected && bookedUntil ? (
              <div role="status" className="mv-fade border border-[var(--w-accent)] bg-[var(--w-accent-soft)] px-5 py-4 text-sm">
                <p className="font-medium">Забронирована до {bookedUntil}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--w-muted)]">
                  Квартира снята с продажи на 5 дней — в шахматке и списке она уже
                  помечена как бронь. Менеджер свяжется для подтверждения.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setBooked((prev) => {
                      const next = { ...prev };
                      delete next[selected.id];
                      return next;
                    })
                  }
                  className="mt-3 text-xs underline decoration-dotted underline-offset-2"
                >
                  Снять бронь
                </button>
              </div>
            ) : selected && isRequested ? (
              <p role="status" className="mv-fade border border-[var(--w-accent)] bg-[var(--w-accent-soft)] px-5 py-3.5 text-sm">
                Заявка принята. Менеджер перезвонит в течение 15 минут.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!selected) return;
                  if (booking && selected.status === "free") {
                    setBooked((prev) => ({ ...prev, [selected.id]: bookedUntilLabel() }));
                  } else {
                    setRequestedIds((prev) => [...prev, selected.id]);
                  }
                }}
                className={cn(
                  "w-full bg-[var(--w-accent)] px-6 py-3.5 text-sm font-medium text-[var(--w-accent-ink)] transition-opacity hover:opacity-90",
                  top ? "w-glow rounded-full" : "rounded-none",
                )}
              >
                {booking && selected?.status === "free" ? "Забронировать на 5 дней" : "Оставить заявку"}
              </button>
            )}

            {/* Онлайн-бронирование — допник: без него кнопка ведёт на заявку менеджеру */}
            <Addon id="booking" className="mt-3">
              <p className="text-xs leading-relaxed text-[var(--w-muted)]">
                Бронь бесплатная: квартира снимается с продажи на 5 дней, договор
                подписывается в офисе или онлайн.
              </p>
            </Addon>
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
    <div className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] p-4">
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
                    aria-label={`Корпус ${flat.corpus}, этаж ${flat.floor}, ${flat.typeName.toLowerCase()} ${area(flat.area)} м²`}
                    title={`${flat.rooms}к · ${area(flat.area)} м² · корпус ${flat.corpus}`}
                    className={cn(
                      "h-6 w-9 rounded-[4px] text-[0.6rem] tabular-nums transition-all duration-200",
                      flat.status === "free"
                        ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
                        : flat.status === "booked"
                          ? "bg-[var(--w-accent)]/40 text-[var(--w-ink)]"
                          : "bg-[var(--w-line)] text-[var(--w-muted)]",
                      flat.id === selectedId &&
                        "w-pop outline outline-2 outline-offset-2 outline-[var(--w-ink)]",
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

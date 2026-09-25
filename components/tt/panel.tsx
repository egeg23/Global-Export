"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { LangSwitch, useT } from "@/components/tt/lang";
import { branches } from "@/content/tt/company";
import { initialLog, initialOrders, orderStates, type Order, type OrderState } from "@/content/tt/panel";
import { quote, services, tenge } from "@/content/tt/services";
import { cn } from "@/lib/cn";

/**
 * Панель управления «Транстелекома».
 *
 * Панель входит в цену, значит её надо показать. Три экрана: заявки из
 * конструктора с составом и сметой, подключения по филиалам и таблица
 * тарифов.
 *
 * Тарифы здесь не витрина: правка цены услуги сразу пересчитывает сметы
 * во всех заявках и попадает в журнал. Это и объясняет, за что панель
 * стоит денег.
 *
 * Панель, как и сайт, говорит на двух языках.
 */

type Screen = "orders" | "branches" | "prices";

export function Panel() {
  const t = useT();
  const [screen, setScreen] = useState<Screen>("orders");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [entries, setEntries] = useState(initialLog);
  const [prices, setPrices] = useState<Record<string, number>>({});

  const log = (text: { ru: string; kk: string }) =>
    setEntries((prev) => [
      { id: `l${prev.length + 1}`, text, who: "Айгүл", at: "сейчас" },
      ...prev,
    ]);

  const setState = (id: string, state: OrderState) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, state } : order)));
    const label = orderStates.find((item) => item.id === state)!.label;
    log({
      ru: `Заявка ${id} · статус: ${label.ru}`,
      kk: `${id} өтінімі · күйі: ${label.kk}`,
    });
  };

  const setPrice = (id: string, value: number) => {
    setPrices((prev) => ({ ...prev, [id]: value }));
    const service = services.find((item) => item.id === id);
    if (!service) return;
    log({
      ru: `Тариф «${service.label.ru}»: ${tenge(value)}`,
      kk: `«${service.label.kk}» тарифі: ${tenge(value)}`,
    });
  };

  /** Смета заявки с учётом цен, поправленных в панели. */
  const total = (order: Order) => {
    const base = quote(order.services, order.seats);
    const shift = base.lines.reduce((sum, line) => {
      const service = services.find((item) => item.id === line.id);
      const override = prices[line.id];
      if (!service || override === undefined) return sum;
      const was = service.perSeat ? service.monthly * order.seats : service.monthly;
      const now = service.perSeat ? override * order.seats : override;
      return sum + (now - was);
    }, 0);
    return { ...base, monthly: base.monthly + shift };
  };

  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--w-line)] bg-[var(--w-surface)]">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center gap-4 px-5 py-4 sm:px-8">
          <Image src="/images/tt/logo.svg" alt="" width={72} height={28} className="h-6 w-auto" />
          <p className="text-[1.05rem] font-medium">
            {t({ ru: "Панель управления", kk: "Басқару панелі" })}
          </p>
          <div className="ml-auto flex items-center gap-3">
            <LangSwitch />
            <Link
              href="/ttc"
              className="rounded-[var(--w-radius)] border border-[var(--w-line)] px-3.5 py-2 text-[0.82rem] transition-colors hover:border-[var(--w-accent)]"
            >
              {t({ ru: "На сайт", kk: "Сайтқа" })}
            </Link>
          </div>
        </div>

        <nav className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
          <ul className="flex gap-1 overflow-x-auto">
            {(
              [
                ["orders", { ru: "Заявки", kk: "Өтінімдер" }],
                ["branches", { ru: "По филиалам", kk: "Филиалдар бойынша" }],
                ["prices", { ru: "Тарифы", kk: "Тарифтер" }],
              ] as [Screen, { ru: string; kk: string }][]
            ).map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setScreen(id)}
                  aria-pressed={screen === id}
                  className={cn(
                    "cursor-pointer whitespace-nowrap border-b-2 px-4 py-3 text-[0.9rem] transition-colors",
                    screen === id
                      ? "border-[var(--w-accent)] text-[var(--w-ink)]"
                      : "border-transparent text-[var(--w-muted)] hover:text-[var(--w-ink)]",
                  )}
                >
                  {t(label)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="mx-auto grid w-full max-w-[1500px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          {screen === "orders" ? (
            <Orders orders={orders} total={total} onState={setState} />
          ) : null}
          {screen === "branches" ? <Branches orders={orders} total={total} /> : null}
          {screen === "prices" ? <Prices prices={prices} onChange={setPrice} /> : null}
        </div>

        <aside>
          <p className="tt-signal">{t({ ru: "Журнал действий", kk: "Әрекеттер журналы" })}</p>
          <ul className="mt-4 grid gap-2.5">
            {entries.slice(0, 8).map((entry) => (
              <li
                key={entry.id}
                className="rounded-[var(--w-radius)] border border-[var(--w-line)] bg-[var(--w-surface)] p-3.5"
              >
                <p className="text-[0.84rem] leading-snug text-[var(--w-ink)]">{t(entry.text)}</p>
                <p className="tt-figure mt-1.5 text-[0.74rem] text-[var(--w-muted)]">
                  {entry.who} · {entry.at}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */

function Orders({
  orders,
  total,
  onState,
}: {
  orders: Order[];
  total: (order: Order) => ReturnType<typeof quote>;
  onState: (id: string, state: OrderState) => void;
}) {
  const t = useT();

  return (
    <div>
      <h2 className="font-[family-name:var(--w-display)] text-[1.3rem] font-bold">
        {t({ ru: "Заявки из конструктора", kk: "Конструктордан келген өтінімдер" })}
      </h2>
      <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">
        {t({
          ru: "Каждая приходит с составом: набор услуг, число рабочих мест, филиал и смета.",
          kk: "Әрқайсысы құрамымен келеді: қызметтер жиыны, жұмыс орындарының саны, филиал және смета.",
        })}
      </p>

      <ul className="mt-6 grid gap-4">
        {orders.map((order) => {
          const plan = total(order);
          const branch = branches.find((item) => item.id === order.branch);
          return (
            <li
              key={order.id}
              className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[1rem] font-medium">{order.client}</p>
                  <p className="tt-figure mt-1 text-[0.76rem] text-[var(--w-muted)]">
                    {order.id} · {order.at} · {order.contact} ·{" "}
                    {branch ? t(branch.name) : ""} · {order.manager}
                  </p>
                </div>
                <p className="tt-figure text-right text-[1.05rem] text-[var(--w-accent)]">
                  {tenge(plan.monthly)}
                  <span className="ml-1.5 block text-[0.62em] text-[var(--w-muted)]">
                    {t({ ru: "в месяц", kk: "айына" })}
                  </span>
                </p>
              </div>

              <ul className="mt-4 flex flex-wrap gap-2 border-t border-[var(--w-line)] pt-4">
                <Tag>
                  {order.seats} {t({ ru: "мест", kk: "орын" })}
                </Tag>
                {plan.lines.map((line) => (
                  <Tag key={line.id}>{t(line.label)}</Tag>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {orderStates.map((state) => (
                  <button
                    key={state.id}
                    type="button"
                    onClick={() => onState(order.id, state.id)}
                    aria-pressed={order.state === state.id}
                    className={cn(
                      "cursor-pointer rounded-[var(--w-radius)] border px-3 py-1.5 text-[0.76rem] transition-colors",
                      order.state === state.id
                        ? "border-[var(--w-accent)] bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
                        : "border-[var(--w-line)] text-[var(--w-muted)] hover:border-[var(--w-accent)]",
                    )}
                  >
                    {t(state.label)}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Branches({
  orders,
  total,
}: {
  orders: Order[];
  total: (order: Order) => ReturnType<typeof quote>;
}) {
  const t = useT();
  const rows = branches
    .map((branch) => {
      const own = orders.filter((order) => order.branch === branch.id);
      return {
        branch,
        count: own.length,
        monthly: own.reduce((sum, order) => sum + total(order).monthly, 0),
      };
    })
    .sort((a, b) => b.monthly - a.monthly);
  const top = rows[0]?.monthly || 1;

  return (
    <div>
      <h2 className="font-[family-name:var(--w-display)] text-[1.3rem] font-bold">
        {t({ ru: "Подключения по филиалам", kk: "Филиалдар бойынша қосылымдар" })}
      </h2>
      <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">
        {t({
          ru: "Где сейчас идут работы и сколько это приносит в месяц.",
          kk: "Қазір жұмыс қай жерде жүріп жатыр және айына қанша әкеледі.",
        })}
      </p>

      <ul className="mt-6 grid gap-3">
        {rows.map((row) => (
          <li key={row.branch.id} className="flex items-center gap-4">
            <span className="w-40 shrink-0 text-[0.88rem]">{t(row.branch.name)}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--w-line)]">
              <span
                className="block h-full rounded-full bg-[var(--w-accent)]"
                style={{ width: `${(row.monthly / top) * 100}%` }}
              />
            </span>
            <span className="tt-figure w-36 shrink-0 text-right text-[0.84rem]">
              {row.monthly > 0 ? tenge(row.monthly) : "—"}
            </span>
            <span className="tt-figure w-6 shrink-0 text-right text-[0.8rem] text-[var(--w-muted)]">
              {row.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Prices({
  prices,
  onChange,
}: {
  prices: Record<string, number>;
  onChange: (id: string, value: number) => void;
}) {
  const t = useT();

  return (
    <div>
      <h2 className="font-[family-name:var(--w-display)] text-[1.3rem] font-bold">
        {t({ ru: "Тарифы услуг", kk: "Қызмет тарифтері" })}
      </h2>
      <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">
        {t({
          ru: "Та самая таблица, по которой конструктор на сайте считает смету. Меняете здесь — меняются сметы в заявках.",
          kk: "Сайттағы конструктор смета есептейтін дәл сол кесте. Мұнда өзгертсеңіз — өтінімдердегі сметалар өзгереді.",
        })}
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-[0.88rem]">
          <thead>
            <tr className="border-b border-[var(--w-line)] text-left text-[0.72rem] uppercase tracking-[0.14em] text-[var(--w-muted)]">
              <th className="py-3 pr-4 font-medium">{t({ ru: "Услуга", kk: "Қызмет" })}</th>
              <th className="py-3 pr-4 font-medium">{t({ ru: "В месяц, ₸", kk: "Айына, ₸" })}</th>
              <th className="py-3 pr-4 font-medium">
                {t({ ru: "Подключение, ₸", kk: "Қосылу, ₸" })}
              </th>
              <th className="py-3 font-medium">{t({ ru: "Дней", kk: "Күн" })}</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => {
              const value = prices[service.id] ?? service.monthly;
              const changed = prices[service.id] !== undefined;
              return (
                <tr key={service.id} className="border-b border-[var(--w-line)]">
                  <td className="py-3 pr-4">{t(service.label)}</td>
                  <td className="py-3 pr-4">
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={value}
                      onChange={(event) => onChange(service.id, Number(event.target.value))}
                      aria-label={t(service.label)}
                      className={cn(
                        "tt-figure w-28 rounded-[var(--w-radius)] border bg-transparent px-2.5 py-1.5 outline-none transition-colors",
                        changed
                          ? "border-[var(--w-accent)] text-[var(--w-accent)]"
                          : "border-[var(--w-line)] focus:border-[var(--w-accent)]",
                      )}
                    />
                  </td>
                  <td className="tt-figure py-3 pr-4">{service.setup.toLocaleString("ru-RU")}</td>
                  <td className="tt-figure py-3">{service.days}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full border border-[var(--w-line)] px-3 py-1.5 text-[0.78rem] text-[var(--w-muted)]">
      {children}
    </li>
  );
}

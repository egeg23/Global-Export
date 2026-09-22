"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  days,
  estimate,
  groups,
  kindOf,
  layoutOf,
  optionOf,
  sums,
  volume,
  type Group,
  type GroupId,
} from "@/content/nm/calc";
import {
  initialLeads,
  initialLog,
  initialOrders,
  leadStates,
  stages,
  staff,
  type Entry,
  type Lead,
  type LeadState,
  type Order,
  type Stage,
} from "@/content/nm/panel";
import { cn } from "@/lib/cn";

/**
 * Панель управления фабрики.
 *
 * Не та, что показывали застройщикам: у мебельщиков другая работа, и
 * шахматка квартир им ни к чему. Здесь три экрана, которыми пользуются
 * каждый день — заявки из конфигуратора, заказы в цеху и таблица цен, —
 * и они связаны одним состоянием.
 *
 * Связь и делает из набора экранов прототип: поменяли цену погонного метра
 * в «Материалах» — пересчитались сметы во всех заявках, где этот материал
 * выбран, и в журнале появилась строка. Именно это заказчик и проверяет на
 * встрече: «а если я подниму цену на шпон?»
 *
 * Состояние живёт в памяти вкладки. Обновление страницы возвращает
 * исходное — за панелью нет базы, и обещать её было бы обманом: база и
 * есть та работа, которая стоит в смете.
 */

type Screen = "leads" | "orders" | "prices";

const screens: { id: Screen; label: string }[] = [
  { id: "leads", label: "Заявки" },
  { id: "orders", label: "Производство" },
  { id: "prices", label: "Материалы и цены" },
];

export function PanelApp() {
  const [screen, setScreen] = useState<Screen>("leads");
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [log, setLog] = useState<Entry[]>(initialLog);
  /** Надбавки, изменённые в панели: id опции → цена за погонный метр. */
  const [prices, setPrices] = useState<Record<string, number>>({});

  const note = (what: string, who = "Нигора") =>
    setLog((all) => [
      { id: `l-${all.length + 1}-${Date.now()}`, at: "сейчас", who, what },
      ...all,
    ]);

  return (
    <main className="min-h-screen bg-[var(--w-bg)] text-[var(--w-ink)]">
      <header className="border-b border-[var(--w-line)] bg-[var(--w-surface)]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">
              Namuna
            </p>
            <p className="mt-1 text-[1.05rem]">Панель управления</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[0.8rem] text-[var(--w-muted)] sm:inline">
              {staff[0].name} · {staff[0].role}
            </span>
            <Link
              href="/namuna"
              className="rounded-[var(--w-radius)] border border-[var(--w-line)] px-4 py-2 text-[0.78rem] transition-colors hover:border-[var(--w-accent)]"
            >
              Выйти → на сайт
            </Link>
          </div>
        </div>

        <nav className="mx-auto flex w-full max-w-[1400px] gap-1 px-5 sm:px-8">
          {screens.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setScreen(item.id)}
              aria-current={screen === item.id ? "page" : undefined}
              className={cn(
                "cursor-pointer border-b-2 px-4 py-3 text-[0.88rem] transition-colors",
                screen === item.id
                  ? "border-[var(--nm-teal)] text-[var(--nm-teal)]"
                  : "border-transparent text-[var(--w-muted)] hover:text-[var(--w-ink)]",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_20rem]">
        <div>
          {screen === "leads" ? (
            <Leads leads={leads} prices={prices} onState={(id, state) => {
              setLeads((all) => all.map((l) => (l.id === id ? { ...l, state } : l)));
              note(`Заявка ${id} · статус: ${state}`);
            }} />
          ) : null}
          {screen === "orders" ? (
            <Orders orders={orders} onStage={(id, stage) => {
              setOrders((all) => all.map((o) => (o.id === id ? { ...o, stage } : o)));
              note(`Заказ ${id} · этап: ${stage}`, "Сардор");
            }} />
          ) : null}
          {screen === "prices" ? (
            <Prices
              prices={prices}
              onPrice={(group, option, label, value) => {
                setPrices((all) => ({ ...all, [option]: value }));
                note(`${group} · ${label}: ${sums(value)} млн за п.м.`, "Сардор");
              }}
            />
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <h2 className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--w-accent)]">
            Журнал действий
          </h2>
          <ul className="mt-4 grid gap-3">
            {log.slice(0, 8).map((entry) => (
              <li
                key={entry.id}
                className="rounded-[var(--w-radius)] border border-[var(--w-line)] bg-[var(--w-surface)] p-3.5"
              >
                <p className="text-[0.84rem] leading-snug">{entry.what}</p>
                <p className="mt-1.5 text-[0.74rem] text-[var(--w-muted)]">
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

/** Смета заявки с учётом цен, поправленных в панели. */
function leadTotal(lead: Lead, prices: Record<string, number>) {
  const base = estimate(lead.choice);
  const kind = kindOf(lead.choice.kind);
  const delta = kind.groups
    .filter((id: GroupId) => id !== "layout")
    .reduce((sum: number, id: GroupId) => {
      const option = optionOf(id, lead.choice[id], kind.id);
      const override = prices[option.id];
      return override === undefined ? sum : sum + (override - option.perUnit);
    }, 0);
  const shift = delta * base.metres;
  return { low: base.low + shift * 0.88, high: base.high + shift * 1.12, days: base.days };
}

function Leads({
  leads,
  prices,
  onState,
}: {
  leads: Lead[];
  prices: Record<string, number>;
  onState: (id: string, state: LeadState) => void;
}) {
  return (
    <div>
      <h2 className="text-[1.2rem]">Заявки из калькулятора</h2>
      <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">
        Каждая заявка приходит с составом: менеджеру не нужно выяснять по
        телефону, о какой мебели речь. Источник видно сразу — человек собрал
        состав сам или спросил в чате.
      </p>

      <ul className="mt-6 grid gap-4">
        {leads.map((lead) => {
          const total = leadTotal(lead, prices);
          const kind = kindOf(lead.choice.kind);
          return (
            <li
              key={lead.id}
              className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[1rem] font-medium">
                    {lead.name}{" "}
                    <span className="text-[0.82rem] font-normal text-[var(--w-muted)]">
                      {lead.contact}
                    </span>
                  </p>
                  <p className="mt-1 text-[0.78rem] text-[var(--w-muted)]">
                    {lead.id} · {lead.at} · {lead.city} · менеджер {lead.manager} ·{" "}
                    <span className="text-[var(--w-accent)]">{lead.source}</span>
                  </p>
                </div>
                <p className="text-right text-[1.05rem] text-[var(--nm-teal)]">
                  {sums(total.low)} — {sums(total.high)}
                  <span className="ml-1.5 text-[0.62em] text-[var(--w-muted)]">млн сум</span>
                </p>
              </div>

              <ul className="mt-4 flex flex-wrap gap-2 border-t border-[var(--w-line)] pt-4">
                <Tag>{kind.label}</Tag>
                <Tag>{volume(kind, lead.choice.amount)}</Tag>
                {kind.groups.includes("layout") ? <Tag>{layoutOf(lead.choice).label}</Tag> : null}
                {kind.groups
                  .filter((id: GroupId) => id !== "layout")
                  .map((id: GroupId) => (
                    <Tag key={id}>{optionOf(id, lead.choice[id], kind.id).label}</Tag>
                  ))}
                <Tag>{days(total.days)}</Tag>
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {leadStates.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => onState(lead.id, state)}
                    aria-pressed={lead.state === state}
                    className={cn(
                      "cursor-pointer rounded-[var(--w-radius)] border px-3 py-1.5 text-[0.76rem] transition-colors",
                      lead.state === state
                        ? "border-[var(--nm-teal)] bg-[var(--nm-teal)] text-white"
                        : "border-[var(--w-line)] text-[var(--w-muted)] hover:border-[var(--w-accent)]",
                    )}
                  >
                    {state}
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

function Orders({
  orders,
  onStage,
}: {
  orders: Order[];
  onStage: (id: string, stage: Stage) => void;
}) {
  return (
    <div>
      <h2 className="text-[1.2rem]">Заказы в производстве</h2>
      <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">
        Этап двигается одним нажатием — и сразу видно, что где стоит.
      </p>

      <ul className="mt-6 grid gap-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-[1rem] font-medium">{order.client}</p>
              <p className="text-[0.82rem] text-[var(--w-muted)]">
                {order.id} · готовность {order.due}
              </p>
            </div>
            <p className="mt-1.5 text-[0.88rem] text-[var(--w-muted)]">{order.what}</p>

            <ol className="mt-4 flex flex-wrap gap-1.5">
              {stages.map((stage, index) => {
                const done = stages.indexOf(order.stage) >= index;
                return (
                  <li key={stage}>
                    <button
                      type="button"
                      onClick={() => onStage(order.id, stage)}
                      aria-pressed={order.stage === stage}
                      className={cn(
                        "cursor-pointer rounded-[var(--w-radius)] border px-3 py-1.5 text-[0.76rem] transition-colors",
                        order.stage === stage
                          ? "border-[var(--nm-teal)] bg-[var(--nm-teal)] text-white"
                          : done
                            ? "border-[var(--w-accent)] text-[var(--w-accent)]"
                            : "border-[var(--w-line)] text-[var(--w-muted)] hover:border-[var(--w-accent)]",
                      )}
                    >
                      {stage}
                    </button>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Prices({
  prices,
  onPrice,
}: {
  prices: Record<string, number>;
  onPrice: (group: string, option: string, label: string, value: number) => void;
}) {
  const rows = useMemo(
    () =>
      groups.flatMap((group: Group) =>
        group.options.map((option) => ({ group, option })),
      ),
    [],
  );

  return (
    <div>
      <h2 className="text-[1.2rem]">Материалы и цены</h2>
      <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">
        Та самая таблица, из которой конфигуратор на сайте берёт цифры.
        Поправьте надбавку — и сметы во всех заявках с этим материалом
        пересчитаются.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-[0.88rem]">
          <thead>
            <tr className="border-b border-[var(--w-line)] text-left text-[0.72rem] uppercase tracking-[0.14em] text-[var(--w-muted)]">
              <th className="py-3 pr-4 font-medium">Группа</th>
              <th className="py-3 pr-4 font-medium">Материал</th>
              <th className="py-3 pr-4 font-medium">Надбавка, млн / п.м.</th>
              <th className="py-3 font-medium">Дней</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ group, option }) => {
              const value = prices[option.id] ?? option.perUnit;
              const changed = prices[option.id] !== undefined;
              return (
                <tr key={option.id} className="border-b border-[var(--w-line)]">
                  <td className="py-3 pr-4 text-[var(--w-muted)]">{group.label}</td>
                  <td className="py-3 pr-4">{option.label}</td>
                  <td className="py-3 pr-4">
                    <label className="flex items-center gap-2">
                      <span className="sr-only">
                        Надбавка за {option.label}, млн сум за погонный метр
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={value}
                        onChange={(event) =>
                          onPrice(group.label, option.id, option.label, Number(event.target.value))
                        }
                        className={cn(
                          "w-24 rounded-[var(--w-radius)] border bg-[var(--w-surface)] px-2.5 py-1.5 tabular-nums outline-none transition-colors focus:border-[var(--nm-teal)]",
                          changed ? "border-[var(--w-accent)]" : "border-[var(--w-line)]",
                        )}
                      />
                      {changed ? (
                        <span className="text-[0.72rem] text-[var(--w-accent)]">изменено</span>
                      ) : null}
                    </label>
                  </td>
                  <td className="py-3 text-[var(--w-muted)] tabular-nums">+{option.days}</td>
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
    <li className="rounded-[var(--w-radius)] border border-[var(--w-line)] px-2.5 py-1 text-[0.76rem] text-[var(--w-muted)]">
      {children}
    </li>
  );
}

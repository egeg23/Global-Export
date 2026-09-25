"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { countries, eur, purposes } from "@/content/tr/countries";
import { initialLeads, initialLog, leadStates, type Lead, type LeadState } from "@/content/tr/panel";
import { cn } from "@/lib/cn";

/**
 * Панель управления Tranio.
 *
 * Панель входит в цену, значит её надо показать, а не пообещать. Внутри
 * три экрана, и все три отвечают на вопросы, которые у менеджера
 * возникают каждый день: кто пришёл и с чем, какие направления реально
 * спрашивают, и какие пороги входа стоят в подборе.
 *
 * Третий экран — не витрина, а рабочее место: правка порога входа по
 * стране сразу меняет выдачу подбора на сайте, и правка попадает в
 * журнал. Именно это и объясняет, за что панель стоит денег.
 */

type Screen = "leads" | "demand" | "countries";

export function Panel() {
  const [screen, setScreen] = useState<Screen>("leads");
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [entries, setEntries] = useState(initialLog);
  const [thresholds, setThresholds] = useState<Record<string, number>>({});

  const log = (text: string) =>
    setEntries((prev) => [
      { id: `l${prev.length + 1}`, text, who: "Ирина", at: "сейчас" },
      ...prev,
    ]);

  const setState = (id: string, state: LeadState) => {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, state } : lead)));
    log(`Заявка ${id} · статус: ${state}`);
  };

  const setThreshold = (country: string, value: number) => {
    setThresholds((prev) => ({ ...prev, [country]: value }));
    const name = countries.find((item) => item.id === country)?.name ?? country;
    log(`Порог входа по ${name}: ${eur(value)}`);
  };

  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--w-line)] bg-[var(--w-surface)]">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <Image src="/images/tr/mark.svg" alt="" width={28} height={28} className="size-6" />
            <div>
              <p className="tr-eyebrow">Tranio</p>
              <p className="text-[1.05rem] font-medium">Панель управления</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <p className="hidden text-[0.82rem] text-[var(--w-muted)] sm:block">
              Ирина · менеджер по подбору
            </p>
            <Link
              href="/tranio"
              className="rounded-[var(--w-radius)] border border-[var(--w-line)] px-3.5 py-2 text-[0.82rem] transition-colors hover:border-[var(--w-accent)]"
            >
              Выйти → на сайт
            </Link>
          </div>
        </div>

        <nav className="mx-auto w-full max-w-[1500px] px-5 sm:px-8">
          <ul className="flex gap-1 overflow-x-auto">
            {(
              [
                ["leads", "Заявки"],
                ["demand", "Спрос"],
                ["countries", "Направления и пороги"],
              ] as [Screen, string][]
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
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="mx-auto grid w-full max-w-[1500px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          {screen === "leads" ? <Leads leads={leads} onState={setState} /> : null}
          {screen === "demand" ? <Demand leads={leads} /> : null}
          {screen === "countries" ? (
            <Countries thresholds={thresholds} onChange={setThreshold} />
          ) : null}
        </div>

        <aside>
          <p className="tr-eyebrow">Журнал действий</p>
          <ul className="mt-4 grid gap-2.5">
            {entries.slice(0, 8).map((entry) => (
              <li
                key={entry.id}
                className="rounded-[var(--w-radius)] border border-[var(--w-line)] bg-[var(--w-surface)] p-3.5"
              >
                <p className="text-[0.84rem] leading-snug text-[var(--w-ink)]">{entry.text}</p>
                <p className="tr-figure mt-1.5 text-[0.74rem] text-[var(--w-muted)]">
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

function Leads({ leads, onState }: { leads: Lead[]; onState: (id: string, s: LeadState) => void }) {
  return (
    <div>
      <h2 className="font-[family-name:var(--w-display)] text-[1.3rem] font-semibold">
        Заявки с сайта
      </h2>
      <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">
        Каждая приходит с составом: цель, бюджет, выбранные направления и стратегия.
        Первый звонок начинается не с «расскажите, что вы хотите».
      </p>

      <ul className="mt-6 grid gap-4">
        {leads.map((lead) => {
          const purpose = purposes.find((item) => item.id === lead.purpose);
          return (
            <li
              key={lead.id}
              className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[1rem] font-medium">
                    {lead.name}{" "}
                    <span className="tr-figure text-[0.82rem] font-normal text-[var(--w-muted)]">
                      {lead.contact}
                    </span>
                  </p>
                  <p className="tr-figure mt-1 text-[0.76rem] text-[var(--w-muted)]">
                    {lead.id} · {lead.at} · менеджер {lead.manager} ·{" "}
                    <span className="text-[var(--w-accent)]">{lead.source}</span>
                  </p>
                </div>
                <p className="tr-figure text-right text-[1.05rem] text-[var(--w-ink)]">
                  {eur(lead.budget)}
                </p>
              </div>

              <ul className="mt-4 flex flex-wrap gap-2 border-t border-[var(--w-line)] pt-4">
                {purpose ? <Tag>{purpose.label}</Tag> : null}
                {lead.strategy ? <Tag>{lead.strategy}</Tag> : null}
                {lead.countries.map((id) => {
                  const country = countries.find((item) => item.id === id);
                  return country ? (
                    <Tag key={id}>
                      <Image
                        src={`/images/tr/flags/${country.flag}.svg`}
                        alt=""
                        width={16}
                        height={12}
                        className="mr-1.5 inline h-2.5 w-auto align-baseline"
                      />
                      {country.name}
                    </Tag>
                  ) : null;
                })}
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
                        ? "border-[var(--w-accent)] bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
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

/** Спрос: какие направления и цели реально спрашивают. */
function Demand({ leads }: { leads: Lead[] }) {
  const counts = new Map<string, number>();
  for (const lead of leads) {
    for (const id of lead.countries) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const rows = [...counts.entries()]
    .map(([id, count]) => ({ country: countries.find((c) => c.id === id)!, count }))
    .filter((row) => row.country)
    .sort((a, b) => b.count - a.count);
  const top = rows[0]?.count ?? 1;

  const budgets = leads.map((lead) => lead.budget).sort((a, b) => a - b);
  const median = budgets[Math.floor(budgets.length / 2)] ?? 0;

  return (
    <div>
      <h2 className="font-[family-name:var(--w-display)] text-[1.3rem] font-semibold">
        Спрос по заявкам
      </h2>
      <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">
        Считается по тем направлениям, которые люди сами выбрали в подборе. Это
        не аналитика рынка — это то, что спросили у вас.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Figure label="Заявок" value={String(leads.length)} />
        <Figure label="Медианный бюджет" value={eur(median)} />
        <Figure label="Направлений в выдаче" value={String(rows.length)} />
      </div>

      <ul className="mt-8 grid gap-3">
        {rows.map((row) => (
          <li key={row.country.id} className="flex items-center gap-4">
            <Image
              src={`/images/tr/flags/${row.country.flag}.svg`}
              alt=""
              width={22}
              height={16}
              className="h-3.5 w-auto shrink-0"
            />
            <span className="w-32 shrink-0 text-[0.88rem]">{row.country.name}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--w-line)]">
              <span
                className="block h-full rounded-full bg-[var(--w-accent)]"
                style={{ width: `${(row.count / top) * 100}%` }}
              />
            </span>
            <span className="tr-figure w-8 shrink-0 text-right text-[0.86rem]">{row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Пороги входа: правка меняет выдачу подбора на сайте. */
function Countries({
  thresholds,
  onChange,
}: {
  thresholds: Record<string, number>;
  onChange: (country: string, value: number) => void;
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--w-display)] text-[1.3rem] font-semibold">
        Направления и пороги входа
      </h2>
      <p className="mt-2 text-[0.86rem] text-[var(--w-muted)]">
        Та самая таблица, по которой подбор на сайте решает, что показать при
        заданном бюджете. Меняете здесь — меняется выдача там.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-[0.88rem]">
          <thead>
            <tr className="border-b border-[var(--w-line)] text-left text-[0.72rem] uppercase tracking-[0.14em] text-[var(--w-muted)]">
              <th className="py-3 pr-4 font-medium">Направление</th>
              <th className="py-3 pr-4 font-medium">Порог входа, тыс. €</th>
              <th className="py-3 pr-4 font-medium">Доходность</th>
              <th className="py-3 font-medium">Городов</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => {
              const value = thresholds[country.id] ?? country.entry;
              const changed = thresholds[country.id] !== undefined;
              return (
                <tr key={country.id} className="border-b border-[var(--w-line)]">
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2.5">
                      <Image
                        src={`/images/tr/flags/${country.flag}.svg`}
                        alt=""
                        width={20}
                        height={14}
                        className="h-3 w-auto"
                      />
                      {country.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      type="number"
                      min={20}
                      max={2000}
                      step={10}
                      value={value}
                      onChange={(event) => onChange(country.id, Number(event.target.value))}
                      aria-label={`Порог входа: ${country.name}`}
                      className={cn(
                        "tr-figure w-24 rounded-[var(--w-radius)] border bg-transparent px-2.5 py-1.5 outline-none transition-colors",
                        changed
                          ? "border-[var(--w-accent)] text-[var(--w-accent)]"
                          : "border-[var(--w-line)] focus:border-[var(--w-accent)]",
                      )}
                    />
                  </td>
                  <td className="tr-figure tr-yield py-3 pr-4">
                    {country.yield[0]}—{country.yield[1]}%
                  </td>
                  <td className="tr-figure py-3">{country.cities.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full border border-[var(--w-line)] px-3 py-1.5 text-[0.78rem] text-[var(--w-muted)]">
      {children}
    </li>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--w-radius-lg)] border border-[var(--w-line)] bg-[var(--w-surface)] p-5">
      <p className="tr-eyebrow">{label}</p>
      <p className="tr-figure mt-3 text-[1.5rem] leading-none text-[var(--w-ink)]">{value}</p>
    </div>
  );
}

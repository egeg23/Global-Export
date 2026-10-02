"use client";

import NumberFlow from "@number-flow/react";
import { useState } from "react";

import { Addon } from "@/components/configurator/context";
import { Icon } from "@/components/webname/icons";
import { In } from "@/components/webname/motion";
import { plans, plansTotal, tgHref, type Plan } from "@/content/webname/facts";
import { cn } from "@/lib/cn";

const FAMILIES: { id: Plan["family"]; note: string }[] = [
  { id: "Silver", note: "визитка или лендинг" },
  { id: "Gold", note: "сайт компании" },
  { id: "Platin", note: "несколько сайтов" },
  { id: "Diamant", note: "магазин и CMS" },
  { id: "Brillant", note: "крупные проекты" },
];

const disk = (mb: number) => (mb >= 1024 ? `${mb / 1024} Гб` : `${mb} Мб`);
const count = (value: number | "∞") => (value === "∞" ? "без лимита" : String(value));

/**
 * Тарифы хостинга. Названия, диск, сайты, базы и почта — с их страницы
 * «Хостинг»; цены в сумах. Переключатель «месяц / год» крутит цифры
 * (@number-flow/react), семейства — вкладки.
 */
export function Hosting() {
  const [family, setFamily] = useState<Plan["family"]>("Gold");
  const [yearly, setYearly] = useState(false);
  const list = plans.filter((plan) => plan.family === family);

  return (
    <section id="hosting" className="scroll-mt-20 bg-wn-paper-2">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <In variant="slide">
            <h2 className="wn-display max-w-3xl text-4xl sm:text-5xl">Хостинг в сумах — от 3 000 в месяц</h2>
            <p className="wn-muted mt-4 max-w-xl">
              {plansTotal} тарифа от Silver 50M до Brillant Unlimited. Почта на своём домене, базы MySQL и FTP входят в каждый.
            </p>
          </In>
          <div role="group" aria-label="Период" className="inline-flex shrink-0 self-start rounded-xl bg-wn-card p-1 ring-1 ring-wn-line lg:self-auto">
            {[
              [false, "Месяц"],
              [true, "Год"],
            ].map(([value, label]) => (
              <button
                key={String(label)}
                type="button"
                aria-pressed={yearly === value}
                onClick={() => setYearly(value as boolean)}
                className={cn("min-h-11 rounded-lg px-5 text-sm font-bold", yearly === value ? "bg-wn-ink text-wn-paper" : "text-wn-ink-2")}
              >
                {label as string}
              </button>
            ))}
          </div>
        </div>

        <div role="tablist" aria-label="Семейство тарифов" className="mt-8 flex gap-2 overflow-x-auto pb-1">
          {FAMILIES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={family === entry.id}
              onClick={() => setFamily(entry.id)}
              className="wn-chip shrink-0 flex-col items-start gap-0 py-1.5 text-left"
            >
              <span className="font-bold">{entry.id}</span>
              <span className="text-xs opacity-80">{entry.note}</span>
            </button>
          ))}
        </div>

        <ul key={family} role="tabpanel" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((plan, index) => (
            <li key={plan.name} className="wn-pop" style={{ animationDelay: `${index * 60}ms` }}>
              <div className={cn("wn-card flex h-full flex-col p-6", index === 0 && list.length > 1 && "ring-2 ring-wn-stamp")}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="wn-display text-2xl">{plan.name}</h3>
                  <span className="wn-mono rounded-md bg-wn-paper-2 px-2 py-1 text-xs">{disk(plan.disk)}</span>
                </div>
                <p className="mt-5 flex items-baseline gap-2">
                  <span className="wn-display wn-num text-4xl">
                    <NumberFlow value={yearly ? plan.month * 12 : plan.month} locales="ru-RU" />
                  </span>
                  <span className="wn-muted text-sm">сум / {yearly ? "год" : "мес"}</span>
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {[
                    ["layout-dashboard", "Сайтов", count(plan.sites)],
                    ["database", "Баз MySQL", count(plan.dbs)],
                    ["mail", "Ящиков почты", count(plan.mail)],
                  ].map(([icon, label, value]) => (
                    <li key={label} className="flex items-center justify-between gap-3 border-b border-dashed border-wn-line pb-2">
                      <span className="flex items-center gap-2 text-wn-ink-2">
                        <Icon name={icon as "mail"} className="h-4 w-4" />
                        {label}
                      </span>
                      <b className="wn-mono">{value}</b>
                    </li>
                  ))}
                </ul>
                <a
                  href={tgHref(`Здравствуйте! Хочу хостинг ${plan.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("wn-btn mt-6", index !== 0 && "wn-btn-ink")}
                >
                  Выбрать {plan.name}
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Addon id="compare">
            <Compare />
          </Addon>
        </div>
      </div>
    </section>
  );
}

/** Доп «Сравнение тарифов»: три тарифа рядом, лучшее в строке подсвечено. */
function Compare() {
  const [picked, setPicked] = useState(["Gold 100M", "Platin 300M", "Brillant 1G"]);
  const chosen = picked.map((name) => plans.find((plan) => plan.name === name)!);
  const rows: { label: string; value: (plan: Plan) => number; show: (plan: Plan) => string; better: "low" | "high" }[] = [
    { label: "В месяц", value: (plan) => plan.month, show: (plan) => `${plan.month.toLocaleString("ru-RU")} сум`, better: "low" },
    { label: "Диск", value: (plan) => plan.disk, show: (plan) => disk(plan.disk), better: "high" },
    { label: "Сайтов", value: (plan) => (plan.sites === "∞" ? 1e9 : plan.sites), show: (plan) => count(plan.sites), better: "high" },
    { label: "Баз MySQL", value: (plan) => (plan.dbs === "∞" ? 1e9 : plan.dbs), show: (plan) => count(plan.dbs), better: "high" },
    { label: "Почта", value: (plan) => (plan.mail === "∞" ? 1e9 : plan.mail), show: (plan) => count(plan.mail), better: "high" },
    { label: "Сум за 1 Мб", value: (plan) => plan.month / plan.disk, show: (plan) => (plan.month / plan.disk).toFixed(0), better: "low" },
  ];

  return (
    <div className="wn-card p-5 sm:p-8">
      <h3 className="wn-display text-2xl sm:text-3xl">Сравнить три тарифа</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {picked.map((name, slot) => (
          <label key={slot} className="block text-sm">
            <span className="wn-muted">Тариф {slot + 1}</span>
            <select
              value={name}
              onChange={(event) => setPicked(picked.map((value, at) => (at === slot ? event.target.value : value)))}
              className="wn-field mt-1"
            >
              {plans.map((plan) => (
                <option key={plan.name}>{plan.name}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <thead>
            <tr className="border-b border-wn-line">
              <th className="py-3 pr-3 font-normal text-wn-muted">Параметр</th>
              {chosen.map((plan, index) => (
                <th key={index} className="wn-display py-3 pr-3 text-base">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const values = chosen.map(row.value);
              const best = row.better === "low" ? Math.min(...values) : Math.max(...values);
              return (
                <tr key={row.label} className="border-b border-dashed border-wn-line">
                  <td className="py-3 pr-3 text-wn-ink-2">{row.label}</td>
                  {chosen.map((plan, index) => (
                    <td key={index} className="py-3 pr-3">
                      <span className={cn("wn-mono rounded-md px-1.5 py-0.5", values[index] === best && "bg-wn-mint-bg font-bold")}>{row.show(plan)}</span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

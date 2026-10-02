"use client";

import NumberFlow from "@number-flow/react";
import { useState } from "react";

import { clean, useSearch } from "@/components/webname/hero";
import { Icon } from "@/components/webname/icons";
import { plans, ssl, sum, tgHref, zones } from "@/content/webname/facts";
import { cn } from "@/lib/cn";

const SITES = [
  { id: "none", label: "Сайт уже есть", note: "только домен и хостинг", price: 0 },
  { id: "sitepad", label: "Конструктор SitePad", note: "270+ шаблонов, бесплатно", price: 0 },
  { id: "turnkey", label: "Сайт под ключ", note: "студия Arsenal D, по смете", price: null },
] as const;

/**
 * Калькулятор «домен + хостинг + сайт». Цены зон, хостинга и SSL — из их
 * прайса в сумах; сайт под ключ в сумму не входит: его цену называет
 * менеджер, и калькулятор так и пишет. Итог крутится (@number-flow/react),
 * расчёт уходит в их Telegram готовым текстом.
 */
export function Calculator() {
  const search = useSearch();
  const [zone, setZone] = useState(".uz");
  const [years, setYears] = useState(1);
  const [plan, setPlan] = useState("Gold 100M");
  const [months, setMonths] = useState(12);
  const [cert, setCert] = useState("none");
  const [site, setSite] = useState<(typeof SITES)[number]["id"]>("sitepad");

  const name = clean(search.name) || "ваше-имя";
  const zonePrice = zones.find((entry) => entry.zone === zone)?.price ?? 0;
  const hosting = plans.find((entry) => entry.name === plan);
  const certificate = ssl.find((entry) => entry.name === cert);
  const siteSpec = SITES.find((entry) => entry.id === site)!;

  const lines = [
    { label: `Домен ${name}${zone} · ${years} ${years === 1 ? "год" : years < 5 ? "года" : "лет"}`, value: zonePrice * years },
    { label: hosting ? `Хостинг ${hosting.name} · ${months} мес.` : "Без хостинга", value: (hosting?.month ?? 0) * months },
    { label: certificate ? `SSL ${certificate.name} · 1 год` : "SSL не нужен", value: certificate?.price ?? 0 },
    { label: siteSpec.label, value: siteSpec.price },
  ];
  const total = lines.reduce((acc, line) => acc + (line.value ?? 0), 0);
  const message = [
    "Здравствуйте! Посчитал на сайте:",
    ...lines.map((line) => `• ${line.label}: ${line.value === null ? "по смете" : sum(line.value)}`),
    `Итого: ${sum(total)}${site === "turnkey" ? " + сайт по смете" : ""}`,
  ].join("\n");

  return (
    <div className="wn-dark grid overflow-hidden rounded-[1.5rem] lg:grid-cols-12">
      <div className="space-y-6 p-5 sm:p-8 lg:col-span-7">
        <div>
          <p className="text-sm font-bold">Домен</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {zones.slice(0, 6).map((entry) => (
              <button key={entry.zone} type="button" aria-pressed={zone === entry.zone} onClick={() => setZone(entry.zone)} className="wn-chip wn-mono">
                {entry.zone}
              </button>
            ))}
          </div>
          <label className="mt-4 block text-sm">
            <span className="flex justify-between">
              <span className="wn-muted">Срок регистрации</span>
              <b className="wn-num">{years} г.</b>
            </span>
            <input type="range" min={1} max={10} value={years} onChange={(event) => setYears(Number(event.target.value))} className="mt-2 w-full accent-[#ffc94d]" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="wn-muted">Хостинг</span>
            <select value={plan} onChange={(event) => setPlan(event.target.value)} className="wn-field mt-1">
              <option value="none">Без хостинга</option>
              {plans.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {entry.name} — {entry.month.toLocaleString("ru-RU")} сум/мес
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="wn-muted">Оплатить на</span>
            <select value={months} onChange={(event) => setMonths(Number(event.target.value))} className="wn-field mt-1">
              {[3, 6, 12, 24].map((value) => (
                <option key={value} value={value}>
                  {value} мес.
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="wn-muted">SSL-сертификат</span>
            <select value={cert} onChange={(event) => setCert(event.target.value)} className="wn-field mt-1">
              <option value="none">Не нужен</option>
              {ssl.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {entry.name} — {entry.kind}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <p className="text-sm font-bold">Сайт</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {SITES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={site === entry.id}
                onClick={() => setSite(entry.id)}
                className="wn-chip min-h-16 flex-col items-start gap-0 py-2 text-left"
              >
                <span className="font-bold">{entry.label}</span>
                <span className="text-xs opacity-80">{entry.note}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-wn-card p-5 text-wn-ink sm:p-8 lg:col-span-5">
        <p className="wn-display text-lg">Расчёт</p>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((line) => (
            <li key={line.label} className="flex items-start justify-between gap-4 border-b border-dashed border-wn-line pb-3">
              <span className="text-wn-ink-2">{line.label}</span>
              <b className={cn("wn-mono shrink-0", line.value === null && "text-wn-stamp")}>{line.value === null ? "по смете" : sum(line.value)}</b>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-wn-muted">Итого</p>
        <p className="wn-display wn-num text-4xl sm:text-5xl">
          <NumberFlow value={total} locales="ru-RU" /> <span className="text-2xl">сум</span>
        </p>
        {site === "turnkey" ? <p className="mt-1 text-sm text-wn-stamp">+ сайт под ключ — смету пришлёт менеджер</p> : null}
        <a href={tgHref(message)} target="_blank" rel="noopener noreferrer" className="wn-btn mt-6">
          <Icon name="brand-telegram" className="h-5 w-5" />
          Отправить расчёт в Telegram
        </a>
        <p className="mt-3 text-xs text-wn-muted">Цены — прайс webname.uz в сумах; .UZ — по каталогу registrars.uz. Окончательную сумму подтвердит менеджер.</p>
      </div>
    </div>
  );
}

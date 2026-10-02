"use client";

import { useState } from "react";

import { useAddon } from "@/components/configurator/context";
import { clean, useSearch } from "@/components/webname/hero";
import { Icon, type IconName } from "@/components/webname/icons";
import { forms, plans, sum, tgHref } from "@/content/webname/facts";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Перенос в три шага                                                  */
/* ------------------------------------------------------------------ */

const STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "file-text",
    title: "Заявление",
    text: "Скачайте бланк «Смена регистратора», подпишите и пришлите скан. Для компании — с печатью.",
  },
  {
    icon: "mail",
    title: "Подтверждение",
    text: "Текущий регистратор спрашивает владельца по почте. Мы следим за статусом и пишем, если нужно ответить.",
  },
  {
    icon: "server-2",
    title: "DNS и сайт",
    text: "Домен у нас — меняем NS. Если сайт тоже переезжает, переносим файлы и базу из резервной копии, сайт не гаснет.",
  },
];

/** Доп «Перенос»: мастер на три шага с настоящими бланками с их сайта. */
export function Transfer() {
  const search = useSearch();
  const [step, setStep] = useState(0);
  const [person, setPerson] = useState<"person" | "company">("person");
  const name = clean(search.name) || "ваш-домен";
  const done = step >= STEPS.length;

  return (
    <div className="wn-card overflow-hidden">
      <ol className="grid grid-cols-3 border-b border-wn-line">
        {STEPS.map((item, index) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => setStep(index)}
              aria-current={step === index ? "step" : undefined}
              className={cn(
                "relative flex min-h-16 w-full flex-col items-center justify-center gap-1 px-1 py-2 text-center text-xs sm:flex-row sm:justify-start sm:gap-3 sm:px-5 sm:text-left sm:text-sm",
                step === index ? "bg-wn-paper-2" : "",
              )}
            >
              <span
                className={cn(
                  "wn-mono flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  index < step || done ? "bg-wn-mint text-white" : step === index ? "bg-wn-ink text-wn-paper" : "ring-1 ring-wn-line",
                )}
              >
                {index < step || done ? "✓" : index + 1}
              </span>
              <span className="font-bold">{item.title}</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-wn-stamp transition-transform duration-500" style={{ transform: `scaleX(${step === index ? 1 : 0})` }} />
            </button>
          </li>
        ))}
      </ol>
      <div className="p-5 sm:p-8">
        {done ? (
          <div className="wn-pop flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span className="wn-display rotate-[-6deg] rounded-lg border-4 border-wn-mint px-4 py-1 text-2xl uppercase text-wn-mint">Перенесён</span>
            <p className="text-wn-ink-2">
              <b className="wn-mono text-wn-ink">{name}.uz</b> обслуживается в Arsenal D: продление, DNS и счета — в одном кабинете.
            </p>
          </div>
        ) : (
          <div key={step} className="wn-pop grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Icon name={STEPS[step].icon} className="h-9 w-9 text-wn-stamp" />
              <h3 className="wn-display mt-4 text-2xl">
                Шаг {step + 1}. {STEPS[step].title}
              </h3>
              <p className="mt-3 max-w-xl text-wn-ink-2">{STEPS[step].text}</p>
            </div>
            <div className="lg:col-span-5">
              {step === 0 ? (
                <div className="space-y-3">
                  <div role="group" aria-label="Владелец" className="flex gap-2">
                    {[
                      ["person", "Физлицо"],
                      ["company", "Юрлицо"],
                    ].map(([id, label]) => (
                      <button key={id} type="button" aria-pressed={person === id} onClick={() => setPerson(id as "person")} className="wn-chip flex-1">
                        {label}
                      </button>
                    ))}
                  </div>
                  <a
                    href={person === "person" ? forms.registrarChangePerson : forms.registrarChangeCompany}
                    className="wn-btn wn-btn-ink w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="file-text" className="h-5 w-5" />
                    Бланк «Смена регистратора»
                  </a>
                  <p className="wn-muted text-xs">Бланки — с webname.uz, раздел «Заявления».</p>
                </div>
              ) : step === 1 ? (
                <ul className="space-y-2 text-sm">
                  {["Заявление получено", "Запрос владельцу отправлен", "Ждём подтверждения"].map((line, index) => (
                    <li key={line} className="flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full", index < 2 ? "bg-wn-mint" : "bg-wn-stamp")} />
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="wn-mono rounded-xl bg-wn-paper-2 p-4 text-sm">
                  <p>
                    NS1 → <b>ns1.webname.uz</b>
                  </p>
                  <p>
                    NS2 → <b>ns2.webname.uz</b>
                  </p>
                  <p className="wn-muted mt-2 text-xs">Имена NS — пример для макета.</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          {done ? (
            <button type="button" onClick={() => setStep(0)} className="wn-btn wn-btn-ghost">
              Сначала
            </button>
          ) : (
            <button type="button" onClick={() => setStep(step + 1)} className="wn-btn">
              {step === STEPS.length - 1 ? "Завершить перенос" : "Дальше"}
            </button>
          )}
          <a href={tgHref(`Здравствуйте! Хочу перенести домен ${name}.uz к вам.`)} target="_blank" rel="noopener noreferrer" className="wn-btn wn-btn-ghost">
            <Icon name="brand-telegram" className="h-5 w-5" />
            Перенести с менеджером
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DNS-панель                                                          */
/* ------------------------------------------------------------------ */

type Rec = { type: "A" | "CNAME" | "MX" | "TXT"; host: string; value: string; prio?: number; fresh?: boolean };

const PRESETS: { id: string; label: string; records: Rec[] }[] = [
  {
    id: "site",
    label: "Сайт на хостинге",
    records: [
      { type: "A", host: "@", value: "203.0.113.10" },
      { type: "CNAME", host: "www", value: "@" },
    ],
  },
  {
    id: "google",
    label: "Почта Google Workspace",
    records: [
      { type: "MX", host: "@", value: "smtp.google.com", prio: 1 },
      { type: "TXT", host: "@", value: "v=spf1 include:_spf.google.com ~all" },
    ],
  },
  {
    id: "yandex",
    label: "Почта Яндекс 360",
    records: [
      { type: "MX", host: "@", value: "mx.yandex.net", prio: 10 },
      { type: "TXT", host: "@", value: "v=spf1 redirect=_spf.yandex.net" },
    ],
  },
];

/** Доп «DNS-панель»: записи, готовые наборы, DNSSEC одним тумблером. */
export function Dns() {
  const search = useSearch();
  const name = clean(search.name) || "ваш-домен";
  const [records, setRecords] = useState<Rec[]>(PRESETS[0].records);
  const [type, setType] = useState<Rec["type"]>("A");
  const [host, setHost] = useState("");
  const [value, setValue] = useState("");
  const [dnssec, setDnssec] = useState(false);

  const apply = (preset: Rec[]) =>
    setRecords((current) => {
      const types = new Set(preset.map((record) => `${record.type}${record.host}`));
      return [...current.filter((record) => !types.has(`${record.type}${record.host}`)).map((record) => ({ ...record, fresh: false })), ...preset.map((record) => ({ ...record, fresh: true }))];
    });

  return (
    <div className="wn-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-wn-line px-5 py-4">
        <p className="wn-mono text-sm">
          DNS-зона <b>{name}.uz</b>
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={dnssec}
          onClick={() => setDnssec(!dnssec)}
          className="flex min-h-11 items-center gap-3 text-sm font-bold"
        >
          DNSSEC
          <span className={cn("relative h-6 w-11 rounded-full transition-colors", dnssec ? "bg-wn-mint" : "bg-wn-paper-2 ring-1 ring-wn-line")}>
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" style={{ transform: `translateX(${dnssec ? 20 : 0}px)` }} />
          </span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2 px-5 pt-4">
        {PRESETS.map((preset) => (
          <button key={preset.id} type="button" onClick={() => apply(preset.records)} className="wn-chip">
            <Icon name="plus" className="h-4 w-4" />
            {preset.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto px-5 py-4">
        <table className="wn-mono w-full min-w-[19rem] text-left text-xs sm:text-sm">
          <thead>
            <tr className="text-xs text-wn-muted">
              <th className="py-2 pr-3 font-normal">Тип</th>
              <th className="py-2 pr-3 font-normal">Имя</th>
              <th className="py-2 pr-3 font-normal">Значение</th>
              <th className="py-2 font-normal">
                <span className="sr-only">Удалить</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={`${record.type}-${record.host}-${record.value}`} className={cn("border-t border-dashed border-wn-line", record.fresh && "wn-pop bg-wn-mint-bg/60")}>
                <td className="py-2.5 pr-3">
                  <b className="rounded bg-wn-ink px-1.5 py-0.5 text-xs text-wn-paper">{record.type}</b>
                </td>
                <td className="py-2.5 pr-3">{record.host}</td>
                <td className="break-all py-2.5 pr-3">
                  {record.prio ? <span className="text-wn-muted">{record.prio} </span> : null}
                  {record.value}
                </td>
                <td className="py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => setRecords(records.filter((_, at) => at !== index))}
                    aria-label={`Удалить запись ${record.type} ${record.host}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-wn-muted hover:bg-wn-paper-2 hover:text-wn-stamp"
                  >
                    <Icon name="x" className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {dnssec ? (
              <tr className="wn-pop border-t border-dashed border-wn-line bg-wn-mint-bg/60">
                <td className="py-2.5 pr-3">
                  <b className="rounded bg-wn-mint px-1.5 py-0.5 text-xs text-white">DS</b>
                </td>
                <td className="py-2.5 pr-3">@</td>
                <td className="py-2.5 pr-3" colSpan={2}>
                  13 2 … подпись опубликована в зоне .UZ
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <form
        className="grid gap-2 border-t border-wn-line px-5 py-4 sm:grid-cols-[7rem_8rem_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          if (!value.trim()) return;
          setRecords([...records.map((record) => ({ ...record, fresh: false })), { type, host: host.trim() || "@", value: value.trim(), prio: type === "MX" ? 10 : undefined, fresh: true }]);
          setHost("");
          setValue("");
        }}
      >
        <label className="sr-only" htmlFor="wn-dns-type">
          Тип записи
        </label>
        <select id="wn-dns-type" value={type} onChange={(event) => setType(event.target.value as Rec["type"])} className="wn-field wn-mono">
          {["A", "CNAME", "MX", "TXT"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="wn-dns-host">
          Имя
        </label>
        <input id="wn-dns-host" value={host} onChange={(event) => setHost(event.target.value)} placeholder="@" className="wn-field wn-mono" />
        <label className="sr-only" htmlFor="wn-dns-value">
          Значение
        </label>
        <input id="wn-dns-value" value={value} onChange={(event) => setValue(event.target.value)} placeholder="значение записи" className="wn-field wn-mono" />
        <button type="submit" className="wn-btn wn-btn-ink">
          Добавить
        </button>
      </form>
      <p className="wn-muted px-5 pb-4 text-xs">Демо: записи живут только на этой странице. IP 203.0.113.10 — адрес для примеров.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Кабинет и оплата                                                    */
/* ------------------------------------------------------------------ */

const PAY = [
  { id: "payme", label: "Payme", tone: "bg-[#007a80]" },
  { id: "click", label: "Click", tone: "bg-[#0866cc]" },
  { id: "uzum", label: "Uzum", tone: "bg-[#7000ff]" },
];

/**
 * Доп «Личный кабинет»: домены и сроки карточками, с телефона. Если включена
 * и оплата — «Продлить» открывает выбор Payme / Click / Uzum.
 */
export function Cabinet() {
  const search = useSearch();
  const pay = useAddon("pay");
  const [open, setOpen] = useState<string | null>(null);
  const name = clean(search.name) || "mening-biznesim";
  const items = [
    { domain: `${name}.uz`, until: "14.03.2027", left: 0.72, kind: "Домен" },
    { domain: "Gold 100M", until: "02.11.2026", left: 0.09, kind: "Хостинг" },
    { domain: "PositiveSSL", until: "20.04.2027", left: 0.55, kind: "SSL" },
  ];

  return (
    <div className="grid items-center gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <ul className="space-y-3 text-wn-ink-2">
          {[
            ["bell", "Напоминания о сроке — по почте, SMS и в Telegram"],
            ["file-text", "Договоры и счета-фактуры — скачать в один тап"],
            ["key", "Дополнительный доступ к одному домену — для подрядчика"],
            ["refresh", "Продление сразу на 1–10 лет"],
          ].map(([icon, text]) => (
            <li key={text} className="flex gap-3">
              <Icon name={icon as IconName} className="mt-0.5 h-5 w-5 shrink-0 text-wn-stamp" />
              {text}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-7">
        <div className="mx-auto w-full max-w-sm rounded-[2.5rem] bg-wn-ink p-3 shadow-[0_30px_60px_-30px_rgb(17_27_59/0.7)]">
          <div className="relative overflow-hidden rounded-[2rem] bg-wn-paper p-4">
            <div className="flex items-center justify-between">
              <p className="wn-display text-lg">Мои услуги</p>
              <Icon name="bell" className="h-5 w-5 text-wn-stamp" />
            </div>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.domain} className="rounded-2xl bg-wn-card p-4 ring-1 ring-wn-line">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="wn-muted text-xs">{item.kind}</p>
                      <p className="wn-mono truncate font-bold">{item.domain}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(item.domain)}
                      className={cn("min-h-11 shrink-0 rounded-lg px-3 text-sm font-bold", item.left < 0.2 ? "bg-wn-stamp text-white" : "bg-wn-paper-2")}
                    >
                      Продлить
                    </button>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-wn-paper-2">
                    <div className={cn("h-full origin-left rounded-full", item.left < 0.2 ? "bg-wn-stamp" : "bg-wn-mint")} style={{ transform: `scaleX(${item.left})` }} />
                  </div>
                  <p className={cn("mt-2 text-xs", item.left < 0.2 ? "font-bold text-wn-stamp" : "text-wn-muted")}>до {item.until}</p>
                </li>
              ))}
            </ul>
            {open ? (
              <div className="wn-pop absolute inset-x-0 bottom-0 rounded-t-3xl bg-wn-card p-5 shadow-[0_-20px_40px_-20px_rgb(17_27_59/0.5)] ring-1 ring-wn-line">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold">
                    Продлить <span className="wn-mono">{open}</span>
                  </p>
                  <button type="button" onClick={() => setOpen(null)} aria-label="Закрыть" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-wn-paper-2">
                    <Icon name="x" className="h-5 w-5" />
                  </button>
                </div>
                {pay ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {PAY.map((method) => (
                      <a
                        key={method.id}
                        href={tgHref(`Здравствуйте! Хочу продлить ${open} и оплатить через ${method.label}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn("flex min-h-12 items-center justify-center rounded-xl text-sm font-bold text-white", method.tone)}
                      >
                        {method.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="wn-muted mt-3 text-sm">Счёт придёт на почту. С допом «Онлайн-оплата» здесь будут Payme, Click и Uzum.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Доп «Онлайн-оплата»: продлить без входа — домен, сумма, способ. */
export function Pay() {
  const search = useSearch();
  const [domain, setDomain] = useState("");
  const [years, setYears] = useState(1);
  const name = clean(domain || search.name);
  const hosting = plans[1];

  return (
    <div className="wn-card grid gap-6 p-5 sm:p-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h3 className="wn-display text-2xl">Продлить без входа в кабинет</h3>
        <p className="wn-muted mt-2 text-sm">Домен и срок — сумма считается сразу. Оплата в сумах, чек на почту.</p>
      </div>
      <form className="grid gap-3 sm:grid-cols-[1fr_8rem] lg:col-span-7" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-sm">
          <span className="wn-muted">Домен</span>
          <span className="mt-1 flex items-center rounded-xl bg-wn-card pr-3 ring-1 ring-wn-line">
            <input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder={search.name ? clean(search.name) : "ваш-домен"} className="wn-mono min-h-12 w-full bg-transparent px-3 outline-none" />
            <span className="wn-mono text-wn-stamp">.uz</span>
          </span>
        </label>
        <label className="block text-sm">
          <span className="wn-muted">Срок</span>
          <select value={years} onChange={(event) => setYears(Number(event.target.value))} className="wn-field mt-1">
            {[1, 2, 3, 5, 10].map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? "год" : value < 5 ? "года" : "лет"}
              </option>
            ))}
          </select>
        </label>
        <p className="wn-mono text-lg sm:col-span-2">
          К оплате: <b>{sum(35_000 * years)}</b>
          <span className="wn-muted ml-2 text-xs">хостинг {hosting.name} — {sum(hosting.month)}/мес</span>
        </p>
        <div className="grid grid-cols-3 gap-2 sm:col-span-2">
          {PAY.map((method) => (
            <a
              key={method.id}
              href={tgHref(`Здравствуйте! Хочу продлить ${name || "домен"}.uz на ${years} г. и оплатить через ${method.label}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("flex min-h-12 items-center justify-center rounded-xl text-sm font-bold text-white transition-transform hover:-translate-y-0.5 motion-reduce:transform-none", method.tone)}
            >
              {method.label}
            </a>
          ))}
        </div>
        <p className="wn-muted text-xs sm:col-span-2">Демо: кнопки ведут в их Telegram с готовым текстом. Платёжные шлюзы подключаются в работе над сайтом.</p>
      </form>
    </div>
  );
}

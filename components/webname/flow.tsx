"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { clean, isFree } from "@/components/webname/hero";
import { Icon, type IconName } from "@/components/webname/icons";
import { plans, ssl, sum, tgHref, zones, type Plan } from "@/content/webname/facts";
import { cn } from "@/lib/cn";

/**
 * Пошаговые страницы макета: «Домены» и «Хостинг» из меню.
 *
 * Заказчик видит, что идёт после первого экрана: выбор, данные владельца,
 * настройка, оплата и подтверждение. Ничего никуда не отправляется — на
 * последнем шаге кнопки способов оплаты открывают их Telegram с готовым
 * текстом заказа, а экран «готово» честно подписан как демо.
 */

/* ------------------------------------------------------------------ */
/* Общие детали                                                        */
/* ------------------------------------------------------------------ */

type Line = { label: string; value: number | null };

const total = (lines: Line[]) => lines.reduce((acc, line) => acc + (line.value ?? 0), 0);
const years = (n: number) => `${n} ${n === 1 ? "год" : n < 5 ? "года" : "лет"}`;

function Steps({ steps, at, go }: { steps: string[]; at: number; go: (index: number) => void }) {
  return (
    <ol className="grid gap-1" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label="Шаги">
      {steps.map((step, index) => {
        const done = index < at;
        const current = index === at;
        return (
          <li key={step}>
            <button
              type="button"
              disabled={index > at}
              onClick={() => go(index)}
              aria-current={current ? "step" : undefined}
              className="group flex w-full flex-col items-start gap-2 text-left disabled:cursor-default"
            >
              <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-wn-paper-2">
                <span
                  className="absolute inset-0 origin-left rounded-full bg-wn-stamp transition-transform duration-500"
                  style={{ transform: `scaleX(${done || current ? 1 : 0})`, opacity: current ? 1 : 0.55 }}
                />
              </span>
              <span className={cn("flex items-center gap-1.5 text-xs sm:text-sm", current ? "font-bold text-wn-ink" : done ? "text-wn-ink-2 group-hover:text-wn-stamp" : "text-wn-muted")}>
                <span className="wn-mono">{done ? "✓" : index + 1}</span>
                <span className="hidden sm:inline">{step}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function Summary({ title, lines, note }: { title: string; lines: Line[]; note?: string }) {
  return (
    <aside className="wn-card p-5 sm:p-6 lg:sticky lg:top-24">
      <p className="wn-display text-lg">{title}</p>
      <ul className="mt-4 space-y-3 text-sm">
        {lines.map((line) => (
          <li key={line.label} className="flex items-start justify-between gap-4 border-b border-dashed border-wn-line pb-3">
            <span className="text-wn-ink-2">{line.label}</span>
            <b className={cn("wn-mono shrink-0", line.value === null && "text-wn-stamp")}>{line.value === null ? "уточнит менеджер" : sum(line.value)}</b>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-wn-muted">Итого</p>
      <p className="wn-display wn-num text-3xl">{sum(total(lines))}</p>
      {note ? <p className="mt-3 text-xs text-wn-muted">{note}</p> : null}
    </aside>
  );
}

function Nav({ back, next, nextLabel = "Дальше", disabled }: { back?: () => void; next: () => void; nextLabel?: string; disabled?: boolean }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {back ? (
        <button type="button" onClick={back} className="wn-btn wn-btn-ghost">
          Назад
        </button>
      ) : null}
      <button type="button" onClick={next} disabled={disabled} className="wn-btn disabled:cursor-not-allowed disabled:opacity-50">
        {nextLabel}
        <Icon name="arrow-right" className="h-5 w-5" />
      </button>
    </div>
  );
}

function Choice({
  on,
  onClick,
  icon,
  title,
  text,
  aside,
}: {
  on: boolean;
  onClick: () => void;
  icon?: IconName;
  title: string;
  text?: string;
  aside?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl p-4 text-left ring-1 transition-colors",
        on ? "bg-wn-mint-bg ring-2 ring-wn-mint" : "bg-wn-card ring-wn-line hover:ring-wn-ink-2",
      )}
    >
      {icon ? <Icon name={icon} className={cn("mt-0.5 h-5 w-5 shrink-0", on ? "text-wn-mint" : "text-wn-ink-2")} /> : null}
      <span className="min-w-0 flex-1">
        <b className="block">{title}</b>
        {text ? <span className="mt-0.5 block text-sm text-wn-ink-2">{text}</span> : null}
      </span>
      {aside ? <span className="wn-mono shrink-0 text-sm font-bold">{aside}</span> : null}
    </button>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-wn-ink-2">{label}</span>
      <span className="mt-1 block">{children}</span>
      {hint ? <span className="mt-1 block text-xs text-wn-muted">{hint}</span> : null}
    </label>
  );
}

const PAY = [
  { id: "payme", label: "Payme", tone: "bg-[#007a80]" },
  { id: "click", label: "Click", tone: "bg-[#0866cc]" },
  { id: "uzum", label: "Uzum", tone: "bg-[#7000ff]" },
];

function Payment({ order, onPaid }: { order: string; onPaid: () => void }) {
  const [method, setMethod] = useState("payme");
  const label = method === "invoice" ? "счёт для юрлица" : PAY.find((entry) => entry.id === method)?.label;
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {PAY.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={method === entry.id}
            onClick={() => setMethod(entry.id)}
            className={cn(
              "flex min-h-14 items-center justify-between gap-3 rounded-xl px-4 font-bold text-white transition-transform",
              entry.tone,
              method === entry.id ? "ring-4 ring-wn-amber" : "hover:-translate-y-0.5 motion-reduce:transform-none",
            )}
          >
            {entry.label}
            {method === entry.id ? <Icon name="check" className="h-5 w-5" /> : null}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={method === "invoice"}
          onClick={() => setMethod("invoice")}
          className={cn("flex min-h-14 items-center justify-between gap-3 rounded-xl bg-wn-card px-4 font-bold ring-1 ring-wn-line", method === "invoice" && "ring-4 ring-wn-amber")}
        >
          Счёт для юрлица
          <Icon name="file-text" className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-3 text-xs text-wn-muted">Договор и счёт-фактура приходят в кабинет — как и сейчас на webname.uz.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={onPaid} className="wn-btn">
          Оплатить — {label}
        </button>
        <a href={tgHref(`${order}\nОплата: ${label}.`)} target="_blank" rel="noopener noreferrer" className="wn-btn wn-btn-ghost">
          <Icon name="brand-telegram" className="h-5 w-5" />
          Оформить с менеджером
        </a>
      </div>
    </div>
  );
}

function Done({ stamp, title, next, order, base }: { stamp: string; title: string; next: string[]; order: string; base: string }) {
  return (
    <div className="wn-pop">
      <div className="relative overflow-hidden rounded-2xl bg-wn-card p-6 ring-1 ring-wn-line sm:p-10">
        <span className="wn-stamp inline-block rounded-lg border-4 border-wn-stamp px-4 py-2 text-wn-stamp" style={{ filter: "url(#wn-ink-done)", transform: "rotate(-6deg)" }}>
          <span className="block rounded border-2 border-current px-3 py-1">
            <span className="wn-display block text-3xl uppercase sm:text-4xl">{stamp}</span>
            <span className="wn-mono block text-center text-xs">ARSENAL D · ДЕМО</span>
          </span>
        </span>
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <filter id="wn-ink-done">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.6" />
            <feComposite in="SourceGraphic" operator="in" />
          </filter>
        </svg>
        <h2 className="wn-display mt-8 text-3xl sm:text-4xl">{title}</h2>
        <p className="mt-3 text-sm text-wn-muted">Это демо: оплата и заказ на макете не проводятся.</p>
        <ol className="mt-6 space-y-3">
          {next.map((line, index) => (
            <li key={line} className="flex gap-3">
              <span className="wn-mono flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wn-ink text-xs font-bold text-wn-paper">{index + 1}</span>
              <span className="pt-0.5 text-wn-ink-2">{line}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={tgHref(order)} target="_blank" rel="noopener noreferrer" className="wn-btn">
            <Icon name="brand-telegram" className="h-5 w-5" />
            Отправить заказ в Telegram
          </a>
          <Link href={base} className="wn-btn wn-btn-ghost">
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Новый шаг начинается сверху: на телефоне кнопка «Дальше» внизу длинного
 * шага, и без этого человек оказывался в середине следующего.
 */
function useStepScroll(at: number) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const node = ref.current;
    if (node && node.getBoundingClientRect().top < 0) {
      node.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }, [at]);
  return ref;
}

function Frame({ crumb, title, lead, base, children }: { crumb: string; title: string; lead: string; base: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:pt-12">
      <nav aria-label="Хлебные крошки" className="text-sm text-wn-muted">
        <Link href={base} className="hover:text-wn-stamp">
          Главная
        </Link>{" "}
        / <span className="text-wn-ink-2">{crumb}</span>
      </nav>
      <h1 className="wn-display mt-4 text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-wn-ink-2">{lead}</p>
      <div className="mt-8">{children}</div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Регистрация домена                                                  */
/* ------------------------------------------------------------------ */

const DOMAIN_STEPS = ["Имя и зоны", "Владелец", "Настройка", "Оплата"];

/** `base` — главная версии макета: «/webname» или «/webname/premium». */
export function DomainFlow({ base = "/webname" }: { base?: string }) {
  const params = useSearchParams();
  const [at, setAt] = useState(0);
  const top = useStepScroll(at);
  const [raw, setRaw] = useState(params.get("name") ?? "");
  const name = clean(raw);
  const [picked, setPicked] = useState<string[]>([".uz"]);
  const [term, setTerm] = useState(1);
  const [kind, setKind] = useState<"person" | "company">("person");
  const [owner, setOwner] = useState({ name: "", id: "", phone: "", email: "" });
  const [ns, setNs] = useState<"hosting" | "own" | "park">("hosting");
  const [own, setOwn] = useState({ ns1: "", ns2: "" });
  const [dnssec, setDnssec] = useState(false);
  const [withHosting, setWithHosting] = useState(true);
  const [withSsl, setWithSsl] = useState(false);

  const free = picked.filter((zone) => isFree(name, zone));
  const lines: Line[] = [
    ...free.map((zone) => ({ label: `${name || "имя"}${zone} · ${years(term)}`, value: (zones.find((entry) => entry.zone === zone)?.price ?? 0) * term })),
    ...(ns === "hosting" && withHosting ? [{ label: "Хостинг Gold 100M · 12 мес.", value: 6_000 * 12 }] : []),
    ...(withSsl ? [{ label: `SSL ${ssl[0].name} · 1 год`, value: ssl[0].price }] : []),
    ...(dnssec ? [{ label: "DNSSEC", value: null }] : []),
  ];
  const order = [
    "Здравствуйте! Заказ с сайта:",
    ...lines.map((line) => `• ${line.label}: ${line.value === null ? "уточнить" : sum(line.value)}`),
    `Владелец: ${kind === "person" ? "физлицо" : "юрлицо"} ${owner.name}`.trim(),
    `Итого: ${sum(total(lines))}`,
  ].join("\n");
  const ownerOk = owner.name.trim().length > 1 && owner.phone.replace(/\D/g, "").length >= 9;

  return (
    <Frame base={base} crumb="Регистрация домена" title="Регистрация домена" lead="Четыре шага до своего адреса: имя, владелец, настройка и оплата. Домен в .UZ — от 1 до 10 лет.">
      <div ref={top} className="scroll-mt-32">{at < DOMAIN_STEPS.length ? <Steps steps={DOMAIN_STEPS} at={at} go={setAt} /> : null}</div>
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          {at === 0 ? (
            <section key="s0" className="wn-pop">
              <h2 className="wn-display text-2xl">Имя и зоны</h2>
              <div className="wn-card mt-4 flex items-center gap-2 p-2 pl-4 focus-within:ring-2 focus-within:ring-wn-sky">
                <Icon name="world-www" className="h-5 w-5 shrink-0 text-wn-sky" />
                <label htmlFor="wn-flow-name" className="sr-only">
                  Имя домена
                </label>
                <input
                  id="wn-flow-name"
                  value={raw}
                  onChange={(event) => setRaw(event.target.value)}
                  placeholder="ваше-имя"
                  autoComplete="off"
                  spellCheck={false}
                  className="wn-mono min-h-12 w-full min-w-0 bg-transparent text-xl wn-bare outline-none"
                />
              </div>
              {name && name !== raw.trim().toLowerCase() ? <p className="mt-2 text-sm text-wn-muted">В адресе будет: <b className="wn-mono text-wn-ink">{name}</b></p> : null}
              <p className="mt-6 text-sm font-bold">Где зарегистрировать</p>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {zones.map((zone) => {
                  const ok = name ? isFree(name, zone.zone) : true;
                  const on = picked.includes(zone.zone);
                  return (
                    <li key={zone.zone}>
                      <button
                        type="button"
                        disabled={!ok}
                        aria-pressed={on && ok}
                        onClick={() => setPicked(on ? picked.filter((value) => value !== zone.zone) : [...picked, zone.zone])}
                        className={cn(
                          "flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-4 text-left ring-1 transition-colors",
                          !ok ? "cursor-not-allowed bg-wn-paper-2 text-wn-muted ring-wn-line" : on ? "bg-wn-mint-bg ring-2 ring-wn-mint" : "bg-wn-card ring-wn-line hover:ring-wn-ink-2",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span className={cn("flex h-5 w-5 items-center justify-center rounded border-2", on && ok ? "border-wn-mint bg-wn-mint text-white" : "border-wn-line")}>
                            {on && ok ? <Icon name="check" className="h-3.5 w-3.5" /> : null}
                          </span>
                          <span className={cn("wn-mono break-all text-sm font-bold sm:text-base", !ok && "line-through")}>
                            {name || "имя"}
                            {zone.zone}
                          </span>
                        </span>
                        <span className="wn-mono shrink-0 text-xs">{ok ? `${(zone.price ?? 0).toLocaleString("ru-RU")} сум/год` : "занят"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 max-w-xs">
                <Field label="Срок регистрации">
                  <select value={term} onChange={(event) => setTerm(Number(event.target.value))} className="wn-field">
                    {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                      <option key={value} value={value}>
                        {years(value)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <p className="mt-4 text-xs text-wn-muted">Демо: свободно ли имя, считается на странице. Цены — прайс webname.uz, .UZ — по каталогу registrars.uz.</p>
              <Nav next={() => setAt(1)} disabled={!name || free.length === 0} />
            </section>
          ) : null}

          {at === 1 ? (
            <section key="s1" className="wn-pop">
              <h2 className="wn-display text-2xl">Владелец домена</h2>
              <p className="mt-2 text-sm text-wn-ink-2">Эти данные реестр .UZ записывает в карточку домена. По ним же потом подтверждают перенос и смену владельца.</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Choice on={kind === "person"} onClick={() => setKind("person")} icon="users" title="Физическое лицо" text="Паспорт или ПИНФЛ" />
                <Choice on={kind === "company"} onClick={() => setKind("company")} icon="building-bank" title="Юридическое лицо" text="ИНН, договор и счёт-фактура" />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label={kind === "person" ? "Фамилия и имя" : "Название компании"}>
                  <input value={owner.name} onChange={(event) => setOwner({ ...owner, name: event.target.value })} className="wn-field" autoComplete={kind === "person" ? "name" : "organization"} />
                </Field>
                <Field label={kind === "person" ? "ПИНФЛ" : "ИНН"} hint="В демо можно не заполнять">
                  <input value={owner.id} onChange={(event) => setOwner({ ...owner, id: event.target.value })} className="wn-field wn-mono" inputMode="numeric" />
                </Field>
                <Field label="Телефон">
                  <input value={owner.phone} onChange={(event) => setOwner({ ...owner, phone: event.target.value })} className="wn-field wn-mono" inputMode="tel" placeholder="+998" autoComplete="tel" />
                </Field>
                <Field label="Почта" hint="Сюда придут напоминания о сроке">
                  <input value={owner.email} onChange={(event) => setOwner({ ...owner, email: event.target.value })} className="wn-field" type="email" autoComplete="email" />
                </Field>
              </div>
              <p className="mt-4 text-xs text-wn-muted">Демо: данные остаются на этой странице и никуда не отправляются.</p>
              <Nav back={() => setAt(0)} next={() => setAt(2)} disabled={!ownerOk} />
            </section>
          ) : null}

          {at === 2 ? (
            <section key="s2" className="wn-pop">
              <h2 className="wn-display text-2xl">Куда смотрит домен</h2>
              <div className="mt-5 grid gap-2">
                <Choice on={ns === "hosting"} onClick={() => setNs("hosting")} icon="server-2" title="На хостинг Arsenal D" text="NS пропишем сами — сайт и почта заработают сразу" />
                <Choice on={ns === "own"} onClick={() => setNs("own")} icon="network" title="На свои NS-серверы" text="Если сайт уже живёт у другого хостера" />
                <Choice on={ns === "park"} onClick={() => setNs("park")} icon="clock" title="Пока припарковать" text="Домен ваш, а сайт подключите позже" />
              </div>
              {ns === "own" ? (
                <div className="wn-pop mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="NS1">
                    <input value={own.ns1} onChange={(event) => setOwn({ ...own, ns1: event.target.value })} className="wn-field wn-mono" placeholder="ns1.example.uz" />
                  </Field>
                  <Field label="NS2">
                    <input value={own.ns2} onChange={(event) => setOwn({ ...own, ns2: event.target.value })} className="wn-field wn-mono" placeholder="ns2.example.uz" />
                  </Field>
                </div>
              ) : null}
              <p className="mt-8 text-sm font-bold">Добавить к домену</p>
              <div className="mt-2 grid gap-2">
                {ns === "hosting" ? (
                  <Choice on={withHosting} onClick={() => setWithHosting(!withHosting)} icon="server-2" title="Хостинг Gold 100M" text="2 сайта, 5 баз, 10 ящиков почты" aside={`${sum(6_000)}/мес`} />
                ) : null}
                <Choice on={withSsl} onClick={() => setWithSsl(!withSsl)} icon="lock" title={`SSL ${ssl[0].name}`} text="Замок в браузере и https" aside={sum(ssl[0].price)} />
                <Choice on={dnssec} onClick={() => setDnssec(!dnssec)} icon="shield-check" title="DNSSEC" text="Подпись зоны — защита от подмены адреса" aside="по прайсу" />
              </div>
              <Nav back={() => setAt(1)} next={() => setAt(3)} />
            </section>
          ) : null}

          {at === 3 ? (
            <section key="s3" className="wn-pop">
              <h2 className="wn-display text-2xl">Оплата</h2>
              <p className="mt-2 text-sm text-wn-ink-2">Сумма в сумах, без привязки к курсу. Выберите способ:</p>
              <div className="mt-5">
                <Payment order={order} onPaid={() => setAt(4)} />
              </div>
              <button type="button" onClick={() => setAt(2)} className="mt-4 text-sm text-wn-muted underline-offset-4 hover:underline">
                ← Назад к настройке
              </button>
            </section>
          ) : null}

          {at === 4 ? (
            <Done
              base={base}
              stamp="Зарегистрирован"
              title={`${free.map((zone) => `${name}${zone}`).join(", ")} — ваш`}
              order={order}
              next={[
                "Реестр .UZ подтверждает регистрацию, домен появляется в кабинете.",
                ns === "hosting" ? "NS хостинга уже прописаны — сайт и почта начнут открываться в течение нескольких часов." : ns === "own" ? "Прописываем ваши NS — домен начнёт смотреть на ваш сервер." : "Домен припаркован — подключить сайт можно в любой момент из кабинета.",
                "Договор и счёт-фактура — в кабинете, напоминание о продлении придёт заранее.",
              ]}
            />
          ) : null}
        </div>
        {at < 4 ? (
          <div className="lg:col-span-4">
            <Summary title="Ваш заказ" lines={lines} note="Окончательную сумму подтвердит менеджер." />
          </div>
        ) : null}
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Заказ хостинга                                                      */
/* ------------------------------------------------------------------ */

const HOSTING_STEPS = ["Тариф", "Домен", "Срок и допы", "Оплата"];
const FAMILIES: Plan["family"][] = ["Silver", "Gold", "Platin", "Diamant", "Brillant"];

export function HostingFlow({ base = "/webname" }: { base?: string }) {
  const params = useSearchParams();
  const fromUrl = plans.find((plan) => plan.name === params.get("plan"));
  const [at, setAt] = useState(0);
  const top = useStepScroll(at);
  const [family, setFamily] = useState<Plan["family"]>(fromUrl?.family ?? "Gold");
  const [planName, setPlanName] = useState(fromUrl?.name ?? "Gold 100M");
  const [domainMode, setDomainMode] = useState<"own" | "new" | "later">("own");
  const [domain, setDomain] = useState("");
  const [months, setMonths] = useState(12);
  const [sitepad, setSitepad] = useState(true);
  const [withSsl, setWithSsl] = useState(false);
  const [move, setMove] = useState(false);

  const plan = plans.find((entry) => entry.name === planName) ?? plans[1];
  const name = clean(domain);
  const lines: Line[] = [
    { label: `${plan.name} · ${months} мес.`, value: plan.month * months },
    ...(domainMode === "new" ? [{ label: `Домен ${name || "имя"}.uz · 1 год`, value: 35_000 }] : []),
    ...(sitepad ? [{ label: "Конструктор SitePad", value: 0 }] : []),
    ...(withSsl ? [{ label: `SSL ${ssl[0].name} · 1 год`, value: ssl[0].price }] : []),
    ...(move ? [{ label: "Перенос сайта с другого хостинга", value: null }] : []),
  ];
  const order = [
    "Здравствуйте! Заказ хостинга с сайта:",
    ...lines.map((line) => `• ${line.label}: ${line.value === null ? "уточнить" : sum(line.value)}`),
    domainMode === "own" && name ? `Домен: ${name}.uz (уже есть)` : "",
    `Итого: ${sum(total(lines))}`,
  ]
    .filter(Boolean)
    .join("\n");
  const count = (value: number | "∞") => (value === "∞" ? "без лимита" : String(value));
  const disk = (mb: number) => (mb >= 1024 ? `${mb / 1024} Гб` : `${mb} Мб`);

  return (
    <Frame base={base} crumb="Заказ хостинга" title="Заказ хостинга" lead="Тариф, домен, срок — и сайт на хостинге в сумах. Почта на своём домене, MySQL и FTP — в каждом тарифе.">
      <div ref={top} className="scroll-mt-32">{at < HOSTING_STEPS.length ? <Steps steps={HOSTING_STEPS} at={at} go={setAt} /> : null}</div>
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          {at === 0 ? (
            <section key="h0" className="wn-pop">
              <h2 className="wn-display text-2xl">Выберите тариф</h2>
              <div role="tablist" aria-label="Семейство тарифов" className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {FAMILIES.map((entry) => (
                  <button key={entry} type="button" role="tab" aria-selected={family === entry} onClick={() => setFamily(entry)} className="wn-chip shrink-0 font-bold">
                    {entry}
                  </button>
                ))}
              </div>
              <ul key={family} className="mt-4 grid gap-2">
                {plans
                  .filter((entry) => entry.family === family)
                  .map((entry) => (
                    <li key={entry.name} className="wn-pop">
                      <Choice
                        on={planName === entry.name}
                        onClick={() => setPlanName(entry.name)}
                        icon="server-2"
                        title={entry.name}
                        text={`${disk(entry.disk)} · сайтов: ${count(entry.sites)} · баз: ${count(entry.dbs)} · почты: ${count(entry.mail)}`}
                        aside={`${sum(entry.month)}/мес`}
                      />
                    </li>
                  ))}
              </ul>
              <Nav next={() => setAt(1)} />
            </section>
          ) : null}

          {at === 1 ? (
            <section key="h1" className="wn-pop">
              <h2 className="wn-display text-2xl">Домен для сайта</h2>
              <div className="mt-5 grid gap-2">
                <Choice on={domainMode === "own"} onClick={() => setDomainMode("own")} icon="world" title="У меня уже есть домен" text="Пропишем NS хостинга сами, если домен у нас; если у другого регистратора — подскажем, что поменять" />
                <Choice on={domainMode === "new"} onClick={() => setDomainMode("new")} icon="world-www" title="Зарегистрировать новый .uz" text="Домен и хостинг — одним счётом" aside={sum(35_000)} />
                <Choice on={domainMode === "later"} onClick={() => setDomainMode("later")} icon="clock" title="Решу позже" text="Хостинг включится, домен подключите из кабинета" />
              </div>
              {domainMode !== "later" ? (
                <div className="wn-pop mt-4">
                  <Field label={domainMode === "own" ? "Ваш домен" : "Желаемое имя"}>
                    <span className="flex items-center rounded-xl bg-wn-card pr-3 ring-1 ring-wn-line focus-within:ring-2 focus-within:ring-wn-sky">
                      <input
                        value={domain}
                        onChange={(event) => setDomain(event.target.value)}
                        placeholder="ваше-имя"
                        spellCheck={false}
                        className="wn-mono min-h-12 w-full min-w-0 bg-transparent px-3 wn-bare outline-none"
                      />
                      <span className="wn-mono text-wn-stamp">.uz</span>
                    </span>
                  </Field>
                  {domainMode === "new" && name ? (
                    <p className={cn("mt-2 text-sm font-bold", isFree(name, ".uz") ? "text-wn-mint" : "text-wn-stamp")}>
                      {name}.uz — {isFree(name, ".uz") ? "свободен" : "занят, попробуйте другое имя"} <span className="font-normal text-wn-muted">(демо)</span>
                    </p>
                  ) : null}
                </div>
              ) : null}
              <Nav back={() => setAt(0)} next={() => setAt(2)} disabled={domainMode === "new" && (!name || !isFree(name, ".uz"))} />
            </section>
          ) : null}

          {at === 2 ? (
            <section key="h2" className="wn-pop">
              <h2 className="wn-display text-2xl">Срок и допы</h2>
              <p className="mt-4 text-sm font-bold">Оплатить на</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[3, 6, 12, 24].map((value) => (
                  <button key={value} type="button" aria-pressed={months === value} onClick={() => setMonths(value)} className="wn-chip wn-mono">
                    {value} мес.
                  </button>
                ))}
              </div>
              <p className="mt-8 text-sm font-bold">Добавить</p>
              <div className="mt-2 grid gap-2">
                <Choice on={sitepad} onClick={() => setSitepad(!sitepad)} icon="palette" title="Конструктор SitePad" text="270+ шаблонов — сайт без программиста" aside="бесплатно" />
                <Choice on={withSsl} onClick={() => setWithSsl(!withSsl)} icon="lock" title={`SSL ${ssl[0].name}`} text="Замок в браузере и https" aside={sum(ssl[0].price)} />
                <Choice on={move} onClick={() => setMove(!move)} icon="arrows-exchange" title="Перенести сайт с другого хостинга" text="Файлы и базу переносим из резервной копии" aside="по запросу" />
              </div>
              <Nav back={() => setAt(1)} next={() => setAt(3)} />
            </section>
          ) : null}

          {at === 3 ? (
            <section key="h3" className="wn-pop">
              <h2 className="wn-display text-2xl">Оплата</h2>
              <p className="mt-2 text-sm text-wn-ink-2">Сумма в сумах, без привязки к курсу. Выберите способ:</p>
              <div className="mt-5">
                <Payment order={order} onPaid={() => setAt(4)} />
              </div>
              <button type="button" onClick={() => setAt(2)} className="mt-4 text-sm text-wn-muted underline-offset-4 hover:underline">
                ← Назад к допам
              </button>
            </section>
          ) : null}

          {at === 4 ? (
            <Done
              base={base}
              stamp="Активирован"
              title={`Хостинг ${plan.name} включён`}
              order={order}
              next={[
                "Доступы к панели хостинга и FTP приходят на почту.",
                domainMode === "new" ? `${name || "Новый домен"}.uz регистрируется и сразу смотрит на хостинг.` : domainMode === "own" ? "Остаётся прописать NS хостинга у домена — подскажем в чате." : "Домен подключите из кабинета, когда будете готовы.",
                sitepad ? "SitePad уже в панели: выберите шаблон и опубликуйте сайт." : "Загрузите сайт по FTP или через файловый менеджер.",
              ]}
            />
          ) : null}
        </div>
        {at < 4 ? (
          <div className="lg:col-span-4">
            <Summary title="Ваш заказ" lines={lines} note="Окончательную сумму подтвердит менеджер." />
          </div>
        ) : null}
      </div>
    </Frame>
  );
}

"use client";
/* eslint-disable @next/next/no-img-element -- логотипы туроператоров и фото направлений — готовые файлы макета */

import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useAddon } from "@/components/configurator/context";
import { destinations, fares, fmtSum, fmtUsd, operators, type Destination } from "@/content/apollo/site";
import { useCalmMotion } from "@/lib/calm-motion";
import { cn } from "@/lib/cn";

type Tab = "tours" | "flights" | "hotels";

const NIGHTS = ["3–5", "6–8", "7–10", "10–14"] as const;
const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

/** Повторяемая «цена дня»: одинакова на сервере и в браузере. */
export function dayIndex(destId: string, day: number): number {
  let h = 0;
  for (const c of destId) h = (h * 31 + c.charCodeAt(0)) % 9973;
  const v = Math.sin(h * 0.37 + day * 1.91) * 0.5 + Math.sin(day * 0.53 + h) * 0.5;
  const weekend = day % 7 === 4 || day % 7 === 5 ? 0.12 : 0;
  return Math.max(0, Math.min(1, 0.5 + v * 0.45 + weekend));
}

const fmtDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
const plusDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/* ------------------------------------------------------------------ */
/* Форма                                                               */
/* ------------------------------------------------------------------ */

export function SearchPanel({ onDestination }: { onDestination?: (d: Destination) => void }) {
  const [tab, setTab] = useState<Tab>("tours");
  const [dest, setDest] = useState<Destination>(destinations[0]);
  const [open, setOpen] = useState<null | "dest" | "date" | "people">(null);
  const [offset, setOffset] = useState(14);
  const [nights, setNights] = useState<(typeof NIGHTS)[number]>("7–10");
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [run, setRun] = useState<null | { tab: Tab; dest: Destination; date: Date; nights: string; people: number }>(null);
  const [today, setToday] = useState<Date | null>(null);
  const priced = useAddon("calendar");
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    // Дата нужна только в браузере: на сервере её нет, и разметка не расходится.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const date = today ? plusDays(today, offset) : null;
  const pick = (d: Destination) => {
    setDest(d);
    setOpen("date");
    onDestination?.(d);
  };

  const fields = (
    <>
      <Field label={tab === "flights" ? "Откуда" : "Вылет из"} value="Ташкент" note="TAS" />
      <Field
        label="Куда"
        value={tab === "flights" ? `${dest.place}` : `${dest.country}, ${dest.place}`}
        note={tab === "flights" ? undefined : `от ${fmtUsd(dest.from)}`}
        active={open === "dest"}
        onClick={() => setOpen(open === "dest" ? null : "dest")}
      />
      <Field
        label={tab === "flights" ? "Туда" : "Дата вылета"}
        value={date ? fmtDate(date) : "—"}
        note={tab === "flights" ? "в одну сторону" : `${nights} ночей`}
        active={open === "date"}
        onClick={() => setOpen(open === "date" ? null : "date")}
      />
      <Field
        label="Туристы"
        value={`${adults} взр.${kids ? ` + ${kids} реб.` : ""}`}
        active={open === "people"}
        onClick={() => setOpen(open === "people" ? null : "people")}
      />
    </>
  );

  return (
    <div ref={root} className="relative">
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["tours", "Туры"],
            ["flights", "Авиабилеты"],
            ["hotels", "Отели"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn("ap-chip", tab === id ? "bg-ap-gold text-ap-ink" : "bg-white/10 text-white hover:bg-white/20")}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto hidden text-xs text-white/60 sm:block">70+ туроператоров · онлайн 24/7</span>
      </div>

      <div className="ap-beam mt-3 rounded-[1.75rem]">
        <form
          className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-ap-line lg:grid-cols-[1fr_1.4fr_1.1fr_1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            if (!date) return;
            setOpen(null);
            setRun({ tab, dest, date, nights, people: adults + kids });
          }}
        >
          {fields}
          <div className="col-span-2 bg-ap-paper p-2 lg:col-span-1">
            <button type="submit" className="ap-btn h-full min-h-14 w-full px-8 text-base">
              <PlaneIcon className="h-5 w-5" />
              Найти
            </button>
          </div>
        </form>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {["Без визы", "До $800", "Всё включено", "На выходные"].map((chip) => (
          <span key={chip} className="ap-chip h-8 bg-white/8 text-xs font-medium text-white/80 ring-1 ring-white/15">
            {chip}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {open === "dest" && (
          <Popover key="dest">
            <p className="ap-eyebrow px-2 text-ap-muted">Популярное из Ташкента</p>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {destinations.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => pick(d)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-ap-sand",
                      d.id === dest.id && "bg-ap-sand",
                    )}
                  >
                    <img src={`/apollo/dest/${d.id}.webp`} alt="" className="h-12 w-16 rounded-xl object-cover" />
                    <span className="min-w-0 flex-1">
                      <b className="block truncate text-sm">
                        {d.country} · {d.place}
                      </b>
                      <span className="block truncate text-xs text-ap-muted">
                        {d.hours} · {d.visa}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-ap-green">от {fmtUsd(d.from)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Popover>
        )}
        {open === "date" && today && (
          <Popover key="date">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <p className="ap-eyebrow text-ap-muted">
                {dest.country}: вылеты на 5 недель {priced ? "· цена по дням" : ""}
              </p>
              <div className="flex gap-1">
                {NIGHTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNights(n)}
                    className={cn("ap-chip h-8 text-xs", nights === n ? "bg-ap-green text-white" : "bg-ap-sand")}
                  >
                    {n} н.
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[0.7rem] text-ap-muted">
              {WEEK.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {Array.from({ length: (today.getDay() + 6) % 7 }, (_, i) => (
                <span key={`e${i}`} />
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const d = plusDays(today, i + 1);
                const k = dayIndex(dest.id, i + 1);
                const price = Math.round((dest.from * (0.88 + k * 0.5)) / 10) * 10;
                const selected = offset === i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setOffset(i + 1);
                      setOpen("people");
                    }}
                    className={cn(
                      "flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-transform hover:scale-105",
                      selected ? "bg-ap-green text-white" : priced ? heat(k) : "bg-ap-sand",
                    )}
                  >
                    <b className="leading-none">{d.getDate()}</b>
                    {priced && <span className="mt-0.5 text-[0.6rem] leading-none opacity-80">${price}</span>}
                  </button>
                );
              })}
            </div>
            {priced && (
              <p className="mt-3 flex items-center gap-3 px-1 text-xs text-ap-muted">
                <span className="h-2 w-6 rounded-full bg-[#bfe5c6]" /> дешевле
                <span className="h-2 w-6 rounded-full bg-[#f8d9a8]" /> дороже · цена за человека, пример
              </p>
            )}
          </Popover>
        )}
        {open === "people" && (
          <Popover key="people" narrow>
            <Stepper label="Взрослые" value={adults} min={1} max={6} onChange={setAdults} />
            <Stepper label="Дети до 14 лет" value={kids} min={0} max={4} onChange={setKids} />
            <button type="button" onClick={() => setOpen(null)} className="ap-btn mt-3 h-11 w-full text-sm">
              Готово
            </button>
          </Popover>
        )}
      </AnimatePresence>

      {/* Окно поиска — поверх всей страницы, вне контекста первого экрана. */}
      {today && createPortal(<AnimatePresence>{run && <SearchRun key="run" {...run} onClose={() => setRun(null)} />}</AnimatePresence>, document.body)}
    </div>
  );
}

function heat(k: number) {
  if (k < 0.35) return "bg-[#bfe5c6]";
  if (k < 0.6) return "bg-[#e6efd9]";
  if (k < 0.8) return "bg-[#f6ead0]";
  return "bg-[#f8d9a8]";
}

function Field({
  label,
  value,
  note,
  active,
  onClick,
}: {
  label: string;
  value: string;
  note?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "min-w-0 bg-ap-paper px-5 py-3.5 text-left transition-colors",
        onClick && "hover:bg-white",
        active && "bg-white shadow-[inset_0_-3px_0_var(--color-ap-gold)]",
      )}
    >
      <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ap-muted">{label}</span>
      <span className="mt-0.5 block truncate text-base font-bold text-ap-ink">{value}</span>
      {note && <span className="block truncate text-xs text-ap-muted">{note}</span>}
    </Tag>
  );
}

function Popover({ children, narrow }: { children: React.ReactNode; narrow?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "ap-card absolute left-0 z-30 mt-2 max-h-[70vh] overflow-auto p-3 text-ap-ink sm:p-4",
        narrow ? "right-0 sm:left-auto sm:w-80" : "right-0 lg:right-auto lg:w-[44rem]",
      )}
    >
      {children}
    </motion.div>
  );
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-semibold">{label}</span>
      <span className="flex items-center gap-3">
        <button type="button" aria-label="меньше" disabled={value <= min} onClick={() => onChange(value - 1)} className="h-9 w-9 rounded-full bg-ap-sand text-lg disabled:opacity-40">
          −
        </button>
        <b className="w-4 text-center">{value}</b>
        <button type="button" aria-label="больше" disabled={value >= max} onClick={() => onChange(value + 1)} className="h-9 w-9 rounded-full bg-ap-sand text-lg disabled:opacity-40">
          +
        </button>
      </span>
    </div>
  );
}

export function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Поиск: самолёт по дуге, опрос туроператоров, выдача                 */
/* ------------------------------------------------------------------ */

const STAGES = ["Ищем рейсы из Ташкента", "Опрашиваем туроператоров", "Сравниваем цены в отелях", "Проверяем свободные места"];

const IATA: Record<string, string> = {
  turkey: "AYT",
  dubai: "DXB",
  egypt: "SSH",
  thailand: "HKT",
  maldives: "MLE",
  georgia: "BUS",
  vietnam: "CXR",
  srilanka: "CMB",
  istanbul: "IST",
};

function SearchRun({
  tab,
  dest,
  date,
  nights,
  people,
  onClose,
}: {
  tab: Tab;
  dest: Destination;
  date: Date;
  nights: string;
  people: number;
  onClose: () => void;
}) {
  const calm = useCalmMotion();
  const [checked, setChecked] = useState(0);
  const [found, setFound] = useState(0);
  const [done, setDone] = useState(false);
  const plane = useRef<SVGGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const installment = useAddon("installment");
  const total = 70;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, [onClose]);

  // Ход поиска: 4,2 секунды — столько обычно отвечает модуль туроператоров.
  useEffect(() => {
    const ms = calm ? 600 : 4200;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - k, 2);
      setChecked(Math.round(eased * total));
      setFound(Math.round(eased * (tab === "flights" ? 38 : 1840 + dest.from)));
      const p = path.current;
      const g = plane.current;
      if (p && g) {
        const len = p.getTotalLength();
        const at = p.getPointAtLength(len * eased);
        const ahead = p.getPointAtLength(Math.min(len, len * eased + 1));
        const angle = (Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180) / Math.PI;
        g.setAttribute("transform", `translate(${at.x} ${at.y}) rotate(${angle + 90})`);
        p.style.strokeDashoffset = String(len * (1 - eased));
        p.style.strokeDasharray = String(len);
      }
      if (k < 1) raf = requestAnimationFrame(step);
      else setDone(true);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [calm, dest.from, tab]);

  const stage = Math.min(STAGES.length - 1, Math.floor((checked / total) * STAGES.length));
  const query = `?ts_dosearch=1&s_flyfrom=TAS&s_country=${dest.id}&s_j_date_from=${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}&s_nights_from=${nights.split("–")[0]}&s_nights_to=${nights.split("–")[1]}&s_adults=${people}`;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Поиск тура"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="ap-stars fixed inset-0 z-[70] overflow-y-auto bg-ap-night/95 text-white backdrop-blur-sm"
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="ap-eyebrow text-ap-gold">{tab === "flights" ? "Авиабилеты" : tab === "hotels" ? "Отели" : "Туры"}</p>
            <h2 className="ap-display mt-2 text-2xl sm:text-4xl">
              Ташкент → {dest.place}
            </h2>
            <p className="mt-1 text-sm text-white/60">
              {fmtDate(date)} · {tab === "flights" ? "в одну сторону" : `${nights} ночей`} · {people} {people === 1 ? "турист" : "туриста"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="ap-chip bg-white/10 hover:bg-white/20" aria-label="Закрыть">
            ✕ <span className="hidden sm:inline">Закрыть</span>
          </button>
        </div>

        {/* Дуга полёта */}
        <div className="relative mt-6 rounded-3xl bg-white/[0.04] p-4 ring-1 ring-white/10 sm:p-6">
          <svg viewBox="0 0 800 200" className="h-32 w-full sm:h-44" aria-hidden="true">
            <path d="M60 170 C 250 -20, 550 -20, 740 170" fill="none" stroke="rgb(255 255 255 / 0.15)" strokeWidth="2" strokeDasharray="4 8" />
            <path ref={path} d="M60 170 C 250 -20, 550 -20, 740 170" fill="none" stroke="var(--color-ap-gold)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="60" cy="170" r="7" fill="var(--color-ap-gold)" />
            <circle cx="740" cy="170" r="7" fill={done ? "var(--color-ap-gold)" : "rgb(255 255 255 / 0.3)"} />
            <text x="60" y="198" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">
              TAS
            </text>
            <text x="740" y="198" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">
              {IATA[dest.id] ?? "—"}
            </text>
            <g ref={plane} transform="translate(60 170)">
              <g transform="translate(-14 -14)">
                <PlaneSvg />
              </g>
            </g>
          </svg>
          <div className="mt-2 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={done ? "done" : stage}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-sm font-semibold text-white/80"
                >
                  {done ? "Готово — лучшие варианты ниже" : `${STAGES[stage]}…`}
                </motion.p>
              </AnimatePresence>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-ap-gold transition-[width] duration-150" style={{ width: `${(checked / total) * 100}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/50">
                Опрошено <NumberFlow value={checked} locales="ru-RU" /> из {total} туроператоров
              </p>
            </div>
            <p className="ap-display text-3xl text-ap-gold sm:text-5xl">
              <NumberFlow value={found} locales="ru-RU" /> <span className="text-base text-white/70 sm:text-lg">{tab === "flights" ? "рейсов" : "туров"}</span>
            </p>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {operators.map((op, i) => {
              const ok = checked >= ((i + 1) / operators.length) * total * 0.9;
              return (
                <li
                  key={op.id}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-xl bg-white px-3 transition-all duration-500",
                    ok ? "opacity-100" : "opacity-30 grayscale",
                  )}
                >
                  <img src={`/apollo/partners/${op.id}.png`} alt={op.name} className="h-6 w-auto" />
                  <span className={cn("text-xs font-bold text-ap-green transition-opacity", ok ? "opacity-100" : "opacity-0")}>✓</span>
                </li>
              );
            })}
          </ul>
        </div>

        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mt-8">
              {tab === "flights" ? <FlightResults dest={dest} date={date} /> : <TourResults dest={dest} nights={nights} people={people} hotelsOnly={tab === "hotels"} installment={installment} />}
              <p className="mt-6 rounded-2xl bg-white/5 p-4 text-xs leading-relaxed text-white/60 ring-1 ring-white/10">
                Выдача — пример оформления. На сайте поиск уходит в модуль Tourvisor агентства, и туры здесь — живые, от
                туроператоров. Так наша форма передаёт поиск модулю:{" "}
                <code className="break-all text-ap-gold-soft">/search{query}</code>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function PlaneSvg() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
}

const HOTELS = [
  { name: "Отель 5★ · первая линия", meal: "Всё включено", rating: 4.8, k: 1.35 },
  { name: "Отель 4★ · свой пляж", meal: "Всё включено", rating: 4.6, k: 1.08 },
  { name: "Бутик-отель 5★ · только для взрослых", meal: "Завтраки и ужины", rating: 4.9, k: 1.6 },
  { name: "Отель 4★ · семейный, аквапарк", meal: "Всё включено", rating: 4.5, k: 1.15 },
  { name: "Отель 3★ · у моря", meal: "Завтраки", rating: 4.3, k: 1 },
  { name: "Резорт 5★ · виллы с бассейном", meal: "Ультра всё включено", rating: 4.9, k: 2.1 },
];

function TourResults({
  dest,
  nights,
  people,
  hotelsOnly,
  installment,
}: {
  dest: Destination;
  nights: string;
  people: number;
  hotelsOnly: boolean;
  installment: boolean;
}) {
  const list = useMemo(() => HOTELS.map((h) => ({ ...h, price: Math.round((dest.from * h.k * people * (hotelsOnly ? 0.55 : 1)) / 10) * 10 })), [dest, people, hotelsOnly]);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((h, i) => (
        <motion.article
          key={h.name}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-3xl bg-ap-paper text-ap-ink"
        >
          <div className="relative h-40">
            <img src={`/apollo/dest/hotel-${i + 1}.webp`} alt="" className="h-full w-full object-cover" />
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold">★ {h.rating}</span>
          </div>
          <div className="p-4">
            <h3 className="font-bold leading-snug">{h.name}</h3>
            <p className="mt-1 text-xs text-ap-muted">
              {dest.place} · {hotelsOnly ? "только отель" : `перелёт + ${nights} ночей`} · {h.meal}
            </p>
            <div className="mt-4 flex items-end justify-between gap-2">
              <div>
                <p className="ap-display text-xl text-ap-green">{fmtUsd(h.price)}</p>
                <p className="text-[0.7rem] text-ap-muted">за {people} {people === 1 ? "туриста" : "туристов"}, пример</p>
                {installment && <p className="mt-1 text-xs font-bold text-ap-pine">или {fmtUsd(Math.round(h.price / 6))} × 6 мес · Uzum Nasiya</p>}
              </div>
              <span className="ap-chip bg-ap-green text-white">Смотреть</span>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function FlightResults({ dest, date }: { dest: Destination; date: Date }) {
  const rows = fares.flatMap((a) => a.fares.filter((f) => dest.place.includes(f.to) || f.to.includes(dest.place)).map((f) => ({ ...f, airline: a.airline, code: a.code })));
  const list = rows.length ? rows : fares[0].fares.slice(0, 4).map((f) => ({ ...f, airline: fares[0].airline, code: fares[0].code }));
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {!rows.length && <p className="text-sm text-white/60 lg:col-span-2">Прямых тарифов в {dest.place} в их списке нет — вот популярные рейсы Uzbekistan Airways:</p>}
      {list.map((f, i) => (
        <BoardingPass key={`${f.code}-${f.to}`} airline={f.airline} code={f.code} to={f.to} price={fmtSum(f.price)} date={fmtDate(date)} index={i} />
      ))}
    </div>
  );
}

export function BoardingPass({ airline, code, to, price, date, index = 0, light }: { airline: string; code: string; to: string; price: string; date?: string; index?: number; light?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex overflow-hidden rounded-3xl", light ? "bg-ap-paper text-ap-ink ring-1 ring-ap-line" : "bg-ap-paper text-ap-ink")}
    >
      <div className="min-w-0 flex-1 p-4 sm:p-5">
        <p className="truncate text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ap-muted">
          {airline} · {code}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <b className="ap-display text-xl sm:text-2xl">TAS</b>
          <span className="relative h-px min-w-6 flex-1 bg-ap-line">
            <PlaneIcon className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-90 text-ap-green" />
          </span>
          <b className="ap-display min-w-0 truncate text-right text-base sm:text-xl xl:text-2xl">{to}</b>
        </div>
        <p className="mt-2 text-xs text-ap-muted">Ташкент → {to}{date ? ` · ${date}` : ""}</p>
      </div>
      <div className="ap-tear w-4 shrink-0 bg-ap-paper" />
      <div className="flex w-28 shrink-0 flex-col items-center justify-center gap-1 bg-ap-green p-3 text-center text-white sm:w-40">
        <span className="text-[0.65rem] uppercase tracking-[0.16em] text-white/60">от</span>
        <b className="text-[0.8rem] font-extrabold leading-tight sm:text-base">{price}</b>
        <span className="mt-1 h-6 w-full bg-[repeating-linear-gradient(90deg,#fff_0_2px,transparent_2px_4px,#fff_4px_5px,transparent_5px_8px)] opacity-70" />
      </div>
    </motion.article>
  );
}

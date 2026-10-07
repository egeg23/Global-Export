"use client";
/* eslint-disable @next/next/no-img-element -- фото направлений и логотипы — готовые файлы макета */

import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { Globe } from "@/components/apollo/globe";
import {
  BoardingPass,
  PlaneIcon,
  SearchPanel,
} from "@/components/apollo/search";
import { useAddon } from "@/components/configurator/context";
import {
  articles,
  company,
  destinations,
  fares,
  fmtSum,
  fmtUsd,
  nav,
  operators,
  promises,
  values,
  type Destination,
} from "@/content/apollo/site";
import { cn } from "@/lib/cn";

const rise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

/* ------------------------------------------------------------------ */
/* Шапка                                                               */
/* ------------------------------------------------------------------ */

export function Header() {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const uz = useAddon("uz");
  const en = useAddon("en");
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        solid ? "bg-ap-deep/90 py-2 shadow-lg backdrop-blur-md" : "py-4",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-6">
        <a href="#top" aria-label="Apollo Travel" className="shrink-0">
          <img
            src="/apollo/logo-white.png"
            alt="Apollo Travel"
            className={cn(
              "w-auto transition-all duration-500",
              solid ? "h-8" : "h-10",
            )}
          />
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-semibold text-white/80 lg:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          {(uz || en) && (
            <span className="hidden items-center gap-1 rounded-full bg-white/10 p-1 text-xs font-bold text-white sm:flex">
              <span className="rounded-full bg-white px-2 py-1 text-ap-ink">
                RU
              </span>
              {uz && <span className="px-2 py-1">UZ</span>}
              {en && <span className="px-2 py-1">EN</span>}
            </span>
          )}
          <a
            href={company.phoneHref}
            className="hidden text-sm font-bold text-white sm:block"
          >
            {company.phone}
          </a>
          <a
            href="#search"
            className="ap-btn hidden h-11 px-5 text-sm md:inline-flex"
          >
            Подобрать тур
          </a>
          <button
            type="button"
            aria-label="Меню"
            onClick={() => setMenu(!menu)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white lg:hidden"
          >
            {menu ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {menu && (
        <nav className="mx-4 mt-3 grid gap-1 rounded-3xl bg-ap-deep p-3 text-white shadow-xl lg:hidden">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenu(false)}
              className="rounded-2xl px-4 py-3 font-semibold hover:bg-white/10"
            >
              {item.label}
            </a>
          ))}
          <a
            href={company.phoneHref}
            className="px-4 py-3 font-bold text-ap-gold"
          >
            {company.phone}
          </a>
        </nav>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Первый экран                                                        */
/* ------------------------------------------------------------------ */

export function Hero() {
  const [focus, setFocus] = useState<Destination>(destinations[0]);
  return (
    <section id="top" className="relative isolate z-20 bg-ap-night text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/apollo/hero-2560.webp"
          srcSet="/apollo/hero-1280.webp 1280w, /apollo/hero-2560.webp 2560w"
          sizes="100vw"
          alt=""
          className="ap-hero-photo absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-ap-night)_0%,rgb(6_28_25/0.86)_42%,rgb(6_28_25/0.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ap-night" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 pt-28 sm:px-6 lg:grid-cols-12 lg:pb-20 lg:pt-36">
        <div className="lg:col-span-7">
          <motion.p {...rise} className="ap-eyebrow text-ap-gold">
            Apollo Travel · с {company.founded} года
          </motion.p>
          <motion.h1
            {...rise}
            transition={{ ...rise.transition, delay: 0.08 }}
            className="ap-display mt-4 text-4xl sm:text-6xl xl:text-7xl"
          >
            Ваш путеводитель
            <br />
            <span className="text-ap-gold">к звёздам</span>
          </motion.h1>
          <motion.p
            {...rise}
            transition={{ ...rise.transition, delay: 0.16 }}
            className="mt-5 max-w-xl text-base text-white/75 sm:text-lg"
          >
            Туры от 70+ туроператоров онлайн, горящие предложения и авиабилеты
            из Ташкента. Подберём сами — мы видели отели своими глазами.
          </motion.p>
        </div>
        <div className="relative hidden overflow-visible lg:col-span-5 lg:block">
          <Globe
            destinations={destinations}
            focus={focus.at}
            className="absolute -right-10 -top-16 h-[34rem] w-[34rem]"
          />
        </div>
        <div id="search" className="scroll-mt-28 lg:col-span-12">
          <SearchPanel onDestination={setFocus} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Туроператоры — бегущая строка                                       */
/* ------------------------------------------------------------------ */

export function Operators() {
  const row = [...operators, ...operators, ...operators];
  return (
    <section
      aria-label="Туроператоры"
      className="border-b border-ap-line bg-ap-paper py-6"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-6">
        <p className="hidden shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-ap-muted sm:block">
          Туры от 70+ операторов
        </p>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="ap-marquee gap-10">
            {[...row, ...row].map((op, i) => (
              <img
                key={i}
                src={`/apollo/partners/${op.id}.png`}
                alt={op.name}
                className="h-10 w-auto shrink-0 opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Горящие туры                                                        */
/* ------------------------------------------------------------------ */

const HOT = [
  {
    id: "turkey",
    nights: 7,
    meal: "Всё включено",
    stars: 5,
    off: 0.24,
    hours: 5,
  },
  {
    id: "egypt",
    nights: 8,
    meal: "Всё включено",
    stars: 4,
    off: 0.31,
    hours: 11,
  },
  { id: "dubai", nights: 6, meal: "Завтраки", stars: 4, off: 0.18, hours: 19 },
  {
    id: "thailand",
    nights: 10,
    meal: "Завтраки",
    stars: 4,
    off: 0.22,
    hours: 27,
  },
  {
    id: "georgia",
    nights: 7,
    meal: "Завтраки и ужины",
    stars: 4,
    off: 0.15,
    hours: 33,
  },
  {
    id: "maldives",
    nights: 7,
    meal: "Полупансион",
    stars: 5,
    off: 0.2,
    hours: 46,
  },
];

function useClock() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // Время — только в браузере: сервер отдаёт разметку без отсчёта.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

export function Hot() {
  const now = useClock();
  const [start] = useState(() => Date.now());
  const installment = useAddon("installment");
  return (
    <section id="hot" className="scroll-mt-20 bg-ap-sand py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          {...rise}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="ap-eyebrow text-ap-pine">Горящие туры</p>
            <h2 className="ap-display mt-3 text-3xl sm:text-5xl">
              Улетают на этой неделе
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ap-muted">
            Сюда встаёт модуль горящих туров Tourvisor в нашем оформлении. Цены
            и отсчёт ниже — пример.
          </p>
        </motion.div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HOT.map((h, i) => {
            const d = destinations.find((x) => x.id === h.id)!;
            const price = Math.round(d.from * (1 + h.nights / 30));
            const old = Math.round(price / (1 - h.off));
            const left = now
              ? Math.max(0, start + h.hours * 3600_000 - now)
              : null;
            return (
              <motion.article
                key={h.id}
                {...rise}
                transition={{ ...rise.transition, delay: i * 0.06 }}
                className="ap-card ap-spot group overflow-hidden"
                onPointerMove={spot}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={`/apollo/dest/${d.id}.webp`}
                    alt={`${d.country}, ${d.place}`}
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-ap)] group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-ap-coral px-3 py-1 text-xs font-extrabold text-white">
                    −{Math.round(h.off * 100)}%
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-ap-night/70 px-3 py-1 font-mono text-xs font-bold text-white backdrop-blur">
                    {left === null ? "—:—:—" : clock(left)}
                  </span>
                </div>
                <div className="flex">
                  <div className="flex-1 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-ap-muted">
                      {d.country} · {"★".repeat(h.stars)}
                    </p>
                    <h3 className="ap-display mt-2 text-xl">{d.place}</h3>
                    <p className="mt-1 text-sm text-ap-muted">
                      {h.nights} ночей · {h.meal} · вылет из TAS
                    </p>
                  </div>
                  <div className="ap-tear w-4" />
                  <div className="flex w-32 flex-col justify-center p-4 text-right">
                    <s className="text-xs text-ap-muted">{fmtUsd(old)}</s>
                    <b className="ap-display text-2xl text-ap-green">
                      {fmtUsd(price)}
                    </b>
                    <span className="text-[0.65rem] text-ap-muted">
                      за человека
                    </span>
                    {installment && (
                      <span className="mt-1 text-[0.7rem] font-bold text-ap-pine">
                        {fmtUsd(Math.round(price / 6))}/мес
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function clock(ms: number) {
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function spot(event: React.PointerEvent<HTMLElement>) {
  const r = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--x", `${event.clientX - r.left}px`);
  event.currentTarget.style.setProperty("--y", `${event.clientY - r.top}px`);
}

/* ------------------------------------------------------------------ */
/* Страны                                                              */
/* ------------------------------------------------------------------ */

export function Countries() {
  return (
    <section id="countries" className="scroll-mt-20 bg-ap-paper py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div {...rise}>
          <p className="ap-eyebrow text-ap-pine">Страны и отели</p>
          <h2 className="ap-display mt-3 max-w-3xl text-3xl sm:text-5xl">
            Куда летают из Ташкента
          </h2>
        </motion.div>
        <div className="mt-10 grid auto-rows-[15rem] grid-flow-row-dense gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <motion.a
              key={d.id}
              href="#search"
              {...rise}
              transition={{ ...rise.transition, delay: (i % 4) * 0.05 }}
              onPointerMove={spot}
              className={cn(
                "ap-spot group relative overflow-hidden rounded-3xl text-white",
                i === 0 && "sm:col-span-2 sm:row-span-2",
              )}
            >
              <img
                src={`/apollo/dest/${d.id}.webp`}
                alt={`${d.country}, ${d.place}`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-ap)] group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ap-night/85 via-ap-night/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-5">
                <span className="flex flex-wrap gap-1.5 text-[0.7rem] font-bold">
                  <span className="rounded-full bg-white/15 px-2 py-0.5 backdrop-blur">
                    ✈ {d.hours}
                  </span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 backdrop-blur">
                    {d.visa}
                  </span>
                </span>
                <span className="mt-2 flex items-end justify-between gap-2">
                  <span>
                    <b className="ap-display block text-2xl">{d.place}</b>
                    <span className="text-sm text-white/70">
                      {d.country} · {d.season}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[0.65rem] uppercase tracking-[0.14em] text-white/60">
                      от
                    </span>
                    <b className="text-lg text-ap-gold">{fmtUsd(d.from)}</b>
                  </span>
                </span>
              </span>
            </motion.a>
          ))}
        </div>
        <p className="mt-4 text-xs text-ap-muted">
          Цена «от» — за человека, ~7 ночей с перелётом, ориентир рынка
          Ташкента. На сайте её подставит модуль Tourvisor.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Доп: куда полететь на мой бюджет                                   */
/* ------------------------------------------------------------------ */

export function Budget() {
  const [budget, setBudget] = useState(900);
  const lit = useMemo(
    () =>
      new Set(destinations.filter((d) => d.from <= budget).map((d) => d.id)),
    [budget],
  );
  const list = destinations
    .filter((d) => lit.has(d.id))
    .sort((a, b) => a.from - b.from);
  return (
    <section className="ap-stars overflow-hidden bg-ap-night py-16 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="ap-eyebrow text-ap-gold">Не знаете, куда поехать?</p>
          <h2 className="ap-display mt-3 text-3xl sm:text-5xl">
            Куда полететь на мой бюджет
          </h2>
          <div className="mt-8 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="flex items-end justify-between">
              <span className="text-sm text-white/60">Бюджет на человека</span>
              <b className="ap-display text-3xl text-ap-gold">
                $<NumberFlow value={budget} locales="en-US" />
              </b>
            </div>
            <input
              type="range"
              min={400}
              max={1500}
              step={50}
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
              aria-label="Бюджет"
              className="mt-4 w-full accent-[var(--color-ap-gold)]"
            />
            <ul className="mt-5 flex min-h-24 flex-wrap content-start gap-2">
              {list.map((d) => (
                <motion.li
                  key={d.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-sm"
                >
                  {d.place} <b className="text-ap-gold">{fmtUsd(d.from)}</b>
                </motion.li>
              ))}
              {!list.length && (
                <li className="text-sm text-white/50">
                  Добавьте бюджета — или напишите нам, подберём акцию.
                </li>
              )}
            </ul>
          </div>
        </div>
        <Globe
          destinations={destinations}
          lit={lit}
          className="mx-auto aspect-square w-full max-w-[32rem]"
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Авиабилеты                                                          */
/* ------------------------------------------------------------------ */

export function Flights() {
  const [airline, setAirline] = useState(0);
  const search = useAddon("flight-search");
  const a = fares[airline];
  return (
    <section id="flights" className="scroll-mt-20 bg-ap-sand py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          {...rise}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="ap-eyebrow text-ap-pine">Авиабилеты</p>
            <h2 className="ap-display mt-3 text-3xl sm:text-5xl">
              Тарифы из Ташкента
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {fares.map((f, i) => (
              <button
                key={f.code}
                type="button"
                onClick={() => setAirline(i)}
                className={cn(
                  "ap-chip",
                  airline === i
                    ? "bg-ap-green text-white"
                    : "bg-ap-paper ring-1 ring-ap-line",
                )}
              >
                {f.airline}
              </button>
            ))}
          </div>
        </motion.div>
        {search && (
          <div className="mt-8 rounded-3xl bg-ap-green p-4 text-white sm:p-5">
            <p className="text-sm font-bold">
              Поиск авиабилетов по всем авиакомпаниям
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
              {["Ташкент, TAS", "Куда", "Даты"].map((p) => (
                <span
                  key={p}
                  className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80"
                >
                  {p}
                </span>
              ))}
              <span className="ap-btn h-12 text-sm">Найти билеты</span>
            </div>
            <p className="mt-2 text-xs text-white/60">
              Белая метка Aviasales в цветах Apollo: выдача — на их странице, в
              их оформлении.
            </p>
          </div>
        )}
        <div key={a.code} className="mt-8 grid gap-4 lg:grid-cols-2">
          {a.fares.map((f, i) => (
            <BoardingPass
              key={f.to}
              airline={a.airline}
              code={a.code}
              to={f.to}
              price={fmtSum(f.price)}
              index={i}
              light
            />
          ))}
        </div>
        <p className="mt-4 text-xs text-ap-muted">
          Тарифы — со страницы «Авиабилеты» goapollo.uz, в сумах, в одну
          сторону.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* О компании                                                          */
/* ------------------------------------------------------------------ */

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 bg-ap-green py-16 text-white sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <motion.div {...rise} className="lg:col-span-5">
          <p className="ap-eyebrow text-ap-gold">О компании</p>
          <h2 className="ap-display mt-3 text-3xl sm:text-4xl xl:text-[2.75rem]">
            Доверьте подбор тура профессионалам
          </h2>
          <p className="mt-5 text-white/75">
            Apollo Travel основана в {company.founded} году в Ташкенте.{" "}
            {company.mission}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Stat
              value={new Date().getFullYear() - company.founded}
              label="лет в туризме"
            />
            <Stat value={70} label="туроператоров онлайн" plus />
          </div>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {promises.map((p, i) => (
            <motion.div
              key={p.title}
              {...rise}
              transition={{ ...rise.transition, delay: i * 0.07 }}
              className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ap-gold text-ap-ink">
                <PlaneIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-white/70">{p.text}</p>
            </motion.div>
          ))}
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-3xl p-6 ring-1 ring-white/10 sm:col-span-1"
            >
              <p className="ap-eyebrow text-ap-gold-soft">{v.title}</p>
              <p className="mt-2 text-sm text-white/70">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  plus,
}: {
  value: number;
  label: string;
  plus?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
      <b className="ap-display text-4xl text-ap-gold">
        <NumberFlow value={value} />
        {plus ? "+" : ""}
      </b>
      <p className="mt-1 text-sm text-white/70">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Блог                                                                */
/* ------------------------------------------------------------------ */

export function Blog() {
  const journal = useAddon("journal");
  return (
    <section className="bg-ap-paper py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div {...rise}>
          <p className="ap-eyebrow text-ap-pine">Блог</p>
          <h2 className="ap-display mt-3 text-3xl sm:text-5xl">
            Советы туристу
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {articles.map((a, i) => (
            <motion.article
              key={a.title}
              {...rise}
              transition={{ ...rise.transition, delay: i * 0.07 }}
              className="rounded-3xl bg-ap-sand p-6"
            >
              <span className="ap-chip h-7 bg-ap-paper text-xs">{a.tag}</span>
              <h3 className="ap-display mt-4 text-xl">{a.title}</h3>
              <p className="mt-3 text-sm text-ap-muted">{a.text}</p>
              <span className="mt-5 inline-block text-sm font-bold text-ap-green">
                Читать →
              </span>
            </motion.article>
          ))}
        </div>
        {journal && (
          <div className="mt-6 grid gap-3 rounded-3xl bg-ap-green p-6 text-white sm:grid-cols-4">
            <p className="font-bold sm:col-span-1">Журнал туриста</p>
            {[
              "Нужна ли виза в Таиланд в 2026 году",
              "Анталья или Шарм: где теплее в ноябре",
              "Как оформить тур в рассрочку",
            ].map((t) => (
              <p key={t} className="text-sm text-white/80">
                {t} <span className="text-ap-gold">→</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Допы                                                               */
/* ------------------------------------------------------------------ */

const VISA: Record<Destination["visa"], string> = {
  "без визы":
    "Паспорт гражданина Узбекистана — без визы. Нужен загранпаспорт, действующий 6 месяцев после поездки.",
  "виза по прилёту":
    "Визу ставят по прилёту в аэропорту. Нужны загранпаспорт, обратный билет и бронь отеля.",
  "e-visa":
    "Электронная виза онлайн до вылета — оформляем вместе с туром за 3–5 рабочих дней.",
  "нужна виза": "Виза оформляется заранее — подскажем документы и сроки.",
};

export function Visa() {
  const [id, setId] = useState(destinations[0].id);
  const d = destinations.find((x) => x.id === id)!;
  return (
    <section className="bg-ap-sand py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="ap-eyebrow text-ap-pine">Визовый помощник</p>
          <h2 className="ap-display mt-3 text-3xl">
            Нужна ли виза по паспорту Узбекистана
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {destinations.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setId(x.id)}
                className={cn(
                  "ap-chip",
                  x.id === id
                    ? "bg-ap-green text-white"
                    : "bg-ap-paper ring-1 ring-ap-line",
                )}
              >
                {x.place}
              </button>
            ))}
          </div>
        </div>
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="ap-card p-6"
        >
          <p className="text-sm text-ap-muted">{d.country}</p>
          <p className="ap-display mt-1 text-2xl text-ap-green">{d.visa}</p>
          <p className="mt-3 text-sm">{VISA[d.visa]}</p>
          <p className="mt-4 text-xs text-ap-muted">
            Ориентир; правила въезда менеджер сверяет на дату поездки.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function Pay() {
  return (
    <section className="bg-ap-paper py-12">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
        <div>
          <p className="ap-eyebrow text-ap-pine">Онлайн-оплата</p>
          <h2 className="ap-display mt-2 text-2xl sm:text-3xl">
            Предоплата за тур — с телефона
          </h2>
          <p className="mt-2 text-sm text-ap-muted">
            Без поездки в офис. Ваучер, билеты и страховка придут на почту.
          </p>
        </div>
        <div className="flex gap-3">
          {["Payme", "Click", "Uzum"].map((p) => (
            <span
              key={p}
              className="grid h-14 w-28 place-items-center rounded-2xl bg-ap-sand text-lg font-extrabold text-ap-green ring-1 ring-ap-line"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TgHot() {
  return (
    <section className="bg-ap-sand py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="ap-eyebrow text-ap-pine">Telegram</p>
          <h2 className="ap-display mt-3 text-3xl sm:text-4xl">
            Горящие туры сами уходят в канал
          </h2>
          <p className="mt-4 text-ap-muted">
            Модуль нашёл горящий тур — пост с фото, ценой и кнопкой
            «Забронировать» сам появляется в {company.telegram[1].handle}.
            Менеджеру не нужно копировать вручную.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm rounded-[2rem] bg-[#0e1621] p-4 text-white shadow-2xl">
          <p className="text-sm font-bold">Apollo Travel · Горящие</p>
          {HOT.slice(0, 2).map((h, i) => {
            const d = destinations.find((x) => x.id === h.id)!;
            return (
              <motion.div
                key={h.id}
                {...rise}
                transition={{ ...rise.transition, delay: i * 0.3 }}
                className="mt-3 overflow-hidden rounded-2xl bg-[#182533]"
              >
                <img
                  src={`/apollo/dest/${d.id}.webp`}
                  alt=""
                  className="h-32 w-full object-cover"
                />
                <p className="p-3 text-sm">
                  🔥 {d.country}, {d.place} · {h.nights} ночей · {h.meal}
                  <br />
                  <b>от {fmtUsd(Math.round(d.from * (1 + h.nights / 30)))}</b> ·
                  вылет из Ташкента
                </p>
                <p className="border-t border-white/10 p-2 text-center text-sm font-bold text-[#64b5ef]">
                  Забронировать
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="bg-ap-paper py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="ap-eyebrow text-ap-pine">Отзывы</p>
          <h2 className="ap-display mt-3 text-3xl sm:text-4xl">
            Что говорят туристы на Яндекс Картах
          </h2>
          <a
            href={company.yandexMaps}
            target="_blank"
            rel="noreferrer"
            className="ap-btn mt-6 h-12 text-sm"
          >
            Все отзывы
          </a>
        </div>
        <iframe
          title="Отзывы Apollo Travel на Яндекс Картах"
          src={company.yandexReviewsWidget}
          className="h-[30rem] w-full rounded-3xl border border-ap-line bg-white"
          loading="lazy"
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Контакты и подвал                                                   */
/* ------------------------------------------------------------------ */

export function Contacts() {
  const [sent, setSent] = useState(false);
  return (
    <section
      id="contacts"
      className="scroll-mt-20 bg-ap-deep py-16 text-white sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <motion.div {...rise}>
          <p className="ap-eyebrow text-ap-gold">Контакты</p>
          <h2 className="ap-display mt-3 text-3xl sm:text-5xl">
            Приходите в офис на Лабзаке
          </h2>
          <p className="mt-4 text-white/70">{company.address}</p>
          <a
            href={company.phoneHref}
            className="ap-display mt-6 block text-3xl text-ap-gold"
          >
            {company.phone}
          </a>
          <a
            href={`mailto:${company.email}`}
            className="mt-2 block text-white/80"
          >
            {company.email}
          </a>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {company.telegram.map((t) => (
              <li key={t.handle}>
                <a
                  href={t.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 hover:bg-white/10"
                >
                  <b>{t.handle}</b>
                  <span className="block text-xs text-white/60">{t.note}</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={company.instagram}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 hover:bg-white/10"
              >
                <b>apollotravel_uz</b>
                <span className="block text-xs text-white/60">Instagram</span>
              </a>
            </li>
          </ul>
        </motion.div>
        <motion.div
          {...rise}
          className="rounded-[2rem] bg-ap-paper p-6 text-ap-ink sm:p-8"
        >
          {sent ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="ap-display text-2xl text-ap-green">Спасибо!</p>
                <p className="mt-2 text-ap-muted">
                  Менеджер свяжется с вами и подберёт тур. В макете заявка
                  никуда не уходит.
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
              className="grid gap-4"
            >
              <p className="ap-display text-2xl">Подберём тур за вас</p>
              <input
                required
                placeholder="Имя"
                className="h-14 rounded-2xl bg-ap-sand px-4 outline-none ring-ap-gold focus:ring-2"
              />
              <input
                required
                type="tel"
                placeholder="+998 __ ___-__-__"
                className="h-14 rounded-2xl bg-ap-sand px-4 outline-none ring-ap-gold focus:ring-2"
              />
              <textarea
                rows={3}
                placeholder="Куда хотите, когда и на сколько человек"
                className="rounded-2xl bg-ap-sand p-4 outline-none ring-ap-gold focus:ring-2"
              />
              <label className="flex items-center gap-2 text-xs text-ap-muted">
                <input type="checkbox" required /> Согласен на обработку
                персональных данных
              </label>
              <button type="submit" className="ap-btn">
                Отправить заявку
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-ap-night py-10 text-sm text-white/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
        <img
          src="/apollo/logo-white.png"
          alt="Apollo Travel"
          className="h-9 w-auto opacity-90"
        />
        <p>
          © {new Date().getFullYear()} Apollo Travel · туристическая компания ·{" "}
          {company.address}
        </p>
        <p className="max-w-md text-xs">
          Предложения на сайте не являются публичной офертой и носят
          информационный характер.
        </p>
      </div>
    </footer>
  );
}

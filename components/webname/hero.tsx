"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { Addon, useAddon } from "@/components/configurator/context";
import { Icon } from "@/components/webname/icons";
import { useT } from "@/components/webname/lang";
import { Parallax, reducedMotion } from "@/components/webname/motion";
import { clientSites, sum, zones, type Zone } from "@/content/webname/facts";
import { whenDevuzIntroDone } from "@/lib/brand/intro";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Состояние поиска — одно на страницу: табло и калькулятор тоже в него  */
/* пишут, и первый экран сразу показывает ответ.                       */
/* ------------------------------------------------------------------ */

type Search = { name: string; set: (name: string, from?: "user" | "board") => void; touched: boolean };

const SearchCtx = createContext<Search>({ name: "", set: () => {}, touched: false });

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const value = useMemo<Search>(
    () => ({
      name,
      touched,
      set: (next, from = "user") => {
        setName(next);
        setTouched(true);
        if (from === "board") document.getElementById("top")?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
      },
    }),
    [name, touched],
  );
  return <SearchCtx.Provider value={value}>{children}</SearchCtx.Provider>;
}

export function useSearch() {
  return useContext(SearchCtx);
}

/* ------------------------------------------------------------------ */
/* Демо-ответ «свободно / занято»                                       */
/* ------------------------------------------------------------------ */

const LAT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "x", ц: "ts", ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "yu", я: "ya", ў: "o", қ: "q", ғ: "g", ҳ: "h",
};

/** Имя домена из того, что набрали: без протокола, www и зоны, латиницей. */
export function clean(raw: string): string {
  const base = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .replace(/\.[a-zа-я.]+$/i, "");
  return [...base]
    .map((char) => LAT[char] ?? char)
    .join("")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 63);
}

const TAKEN = new Set(["webname", "arsenal-d", "arsenal", "google", "uzum", "click", "payme", "gov", "mail", "yandex", "sud", "bank", "test", ...clientSites.map((site) => site.replace(/\.uz$/, ""))]);

function hash(text: string): number {
  let h = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    h ^= text.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Демо: ответ считается на странице и не спрашивает реестр. Известные
 * имена и короткие (до трёх букв) — заняты, остальное — по хэшу, чтобы одно
 * и то же имя всегда давало один и тот же ответ.
 */
export function isFree(name: string, zone: string): boolean {
  if (!name) return false;
  if (TAKEN.has(name)) return zone !== ".uz" && hash(name + zone) % 3 === 0;
  if (name.length <= 3) return false;
  return hash(name + zone) % 5 !== 0;
}

/* ------------------------------------------------------------------ */
/* Первый экран                                                        */
/* ------------------------------------------------------------------ */

const DEMO = ["osh-markazi", "samarkand-tour", "toshkent-dental", "mening-biznesim"];

/**
 * Поиск первого экрана — общий для обеих версий макета («Реестр» и
 * «Премиум»): автонабор демо-имён, пока человек не тронул поле, и ответ
 * через мгновение после последней буквы.
 */
export function useDemoSearch() {
  const search = useSearch();
  const [typed, setTyped] = useState("");
  const [autoWanted, setAuto] = useState(true);
  // Имя пришло извне — с табло — или человек набрал сам: автонабор молчит.
  const auto = autoWanted && !search.touched;
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // Пока человек не тронул поле, строка сама набирает имена узбекских
  // бизнесов: так с первого кадра видно, что делает страница. Начинаем,
  // когда заставка студии освободит кадр.
  useEffect(() => {
    if (!auto) return;
    let timer = 0;
    if (reducedMotion()) {
      timer = window.setTimeout(() => setTyped(DEMO[0]), 0);
      return () => window.clearTimeout(timer);
    }
    let word = 0;
    let index = 0;
    let deleting = false;
    const tick = () => {
      const target = DEMO[word % DEMO.length];
      if (!deleting) {
        index += 1;
        setTyped(target.slice(0, index));
        if (index >= target.length) {
          deleting = true;
          timer = window.setTimeout(tick, 3200);
          return;
        }
        timer = window.setTimeout(tick, 85 + (index % 3) * 30);
      } else {
        index -= 1;
        setTyped(target.slice(0, Math.max(index, 0)));
        if (index <= 0) {
          deleting = false;
          word += 1;
          timer = window.setTimeout(tick, 400);
          return;
        }
        timer = window.setTimeout(tick, 35);
      }
    };
    const stop = whenDevuzIntroDone(() => {
      timer = window.setTimeout(tick, 600);
    });
    return () => {
      stop();
      window.clearTimeout(timer);
    };
  }, [auto]);

  const value = auto ? typed : search.name;
  // Ответ — через мгновение после последней буквы, а не на каждую: иначе
  // печать падала бы на «t», «to», «tos»…
  const [name, setName] = useState("");
  useEffect(() => {
    const next = clean(value);
    const timer = window.setTimeout(() => setName(next), auto ? 0 : 380);
    return () => window.clearTimeout(timer);
  }, [value, auto]);
  const settled = auto ? DEMO.includes(name) && typed === name : name.length > 0;

  return { search, value, name, settled, auto, setAuto, focused, setFocused, input };
}

export function Hero() {
  const t = useT();
  const { search, value, name, settled, auto, setAuto, focused, setFocused, input } = useDemoSearch();
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <Guilloche />
      <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-8 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-12 lg:pb-20 lg:pt-16">
        <div className="min-w-0 lg:col-span-7">
          <p className="inline-flex items-center gap-2 rounded-lg bg-wn-card/80 px-3 py-1.5 text-sm text-wn-ink-2 ring-1 ring-wn-line">
            <Icon name="certificate" className="h-4 w-4 text-wn-stamp" />
            Аккредитованный регистратор .UZ
          </p>
          <h1 className="wn-display mt-5 text-5xl sm:text-6xl lg:text-7xl">{t("heroTitle")}</h1>
          <p className="mt-5 max-w-xl text-lg text-wn-ink-2">{t("heroSub")}</p>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              setAuto(false);
              search.set(input.current?.value ?? "");
            }}
          >
            <label htmlFor="wn-q" className="sr-only">
              Имя домена
            </label>
            <div className="wn-card flex items-center gap-2 p-2 pl-3 focus-within:ring-2 focus-within:ring-wn-sky sm:gap-3 sm:pl-4">
              <Icon name="lock" className="h-5 w-5 shrink-0 text-wn-mint" />
              <span className="wn-mono hidden text-base text-wn-muted sm:inline">https://</span>
              <div className="relative min-w-0 flex-1">
                <input
                  ref={input}
                  id="wn-q"
                  value={value}
                  onChange={(event) => {
                    setAuto(false);
                    search.set(event.target.value);
                  }}
                  onFocus={() => {
                    setFocused(true);
                    if (auto) {
                      setAuto(false);
                      search.set("");
                    }
                  }}
                  onBlur={() => setFocused(false)}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder={t("placeholder")}
                  className="wn-mono min-h-12 w-full bg-transparent text-lg text-wn-ink outline-none focus-visible:outline-none placeholder:text-wn-muted sm:text-2xl"
                  style={{ caretColor: "var(--wn-stamp)" }}
                />
                {!focused && auto ? (
                  <span aria-hidden="true" className="wn-mono pointer-events-none absolute inset-y-0 left-0 flex items-center text-lg sm:text-2xl">
                    <span className="invisible whitespace-pre">{value}</span>
                    <span className="wn-caret ml-0.5 h-7 w-0.5 bg-wn-stamp" />
                  </span>
                ) : null}
              </div>
              <span className="wn-mono text-lg text-wn-stamp sm:text-2xl">.uz</span>
              <button type="submit" className="wn-btn min-h-12 shrink-0 px-4 sm:px-6">
                <Icon name="search" className="h-5 w-5" />
                <span className="hidden sm:inline">{t("check")}</span>
                <span className="sr-only sm:hidden">{t("check")}</span>
              </button>
            </div>
          </form>
        </div>
        <div className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:self-center">
          <Certificate name={name} settled={settled} />
        </div>
        <div className="min-w-0 lg:col-span-7">
          <Zones name={name} settled={settled} />
          <p className="wn-muted mt-4 flex items-start gap-2 text-sm">
            <Icon name="sparkles" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <WhoisNote />
            </span>
          </p>
        </div>
      </div>
      <Addon id="whois" className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <Whois name={name || "ваше-имя"} />
      </Addon>
    </section>
  );
}

function WhoisNote() {
  const live = useAddon("whois");
  return live
    ? "С допом «Живая проверка» поиск спрашивает реестр .UZ и WHOIS. На макете ниже — пример ответа."
    : "Демо: ответ считается на странице, без запроса к реестру. Цены — из прайса webname.uz, .UZ — по каталогу registrars.uz.";
}

/** Марки зон: какая свободна, какая занята и сколько стоит год. */
function Zones({ name, settled }: { name: string; settled: boolean }) {
  return (
    <ul key={settled ? name : "idle"} className="grid grid-cols-3 gap-2 lg:grid-cols-5" aria-live="polite" aria-label="Зоны">
      {zones.map((zone, index) => (
        <ZoneTile key={zone.zone} zone={zone} name={name} settled={settled} index={index} />
      ))}
    </ul>
  );
}

function ZoneTile({ zone, name, settled, index }: { zone: Zone; name: string; settled: boolean; index: number }) {
  const free = settled && isFree(name, zone.zone);
  const taken = settled && !free;
  return (
    <li
      className={cn(
        "flex min-h-20 flex-col justify-between rounded-md p-3 pt-2.5 outline-2 -outline-offset-[5px] outline-dashed outline-wn-line sm:min-h-24",
        index >= 6 && "hidden sm:flex",
        settled && "wn-tick",
        free ? "bg-wn-mint-bg" : taken ? "bg-wn-paper-2" : "bg-wn-card",
      )}
      style={{ "--i": index } as React.CSSProperties}
    >
      <span className={cn("wn-display text-xl sm:text-2xl", taken && "text-wn-muted line-through decoration-2")}>{zone.zone}</span>
      <span className="text-xs">
        <span className={cn("block font-bold", free ? "text-wn-ink" : "text-wn-muted")}>{!settled ? "—" : free ? "Свободен" : "Занят"}</span>
        <span className="wn-mono wn-num text-wn-ink-2">{zone.price ? (zone.price >= 1_000_000 ? `${(zone.price / 1_000_000).toLocaleString("ru-RU")} млн/год` : `${zone.price / 1000} тыс./год`) : "по прайсу"}</span>
      </span>
    </li>
  );
}

/**
 * Свидетельство с печатью — фирменный приём. Имя ложится в бланк, и сверху
 * падает печать: «СВОБОДЕН» красным или «ЗАНЯТ» чернилами. Печать
 * перерисовывается по ключу имени — поэтому и падает заново.
 */
function Certificate({ name, settled }: { name: string; settled: boolean }) {
  const free = settled && isFree(name, ".uz");
  const shown = name || "ваше-имя";
  const alternatives = useMemo(() => {
    if (!settled || free) return [];
    return [`${name}-uz`, `${name}group`, `my${name}`].filter((alt) => isFree(alt, ".uz")).slice(0, 2);
  }, [settled, free, name]);

  return (
    <div key={settled ? `${name}-${free}` : "idle"} className={cn("relative", settled && "wn-thud")}>
      <div className="wn-card relative overflow-hidden p-5 sm:p-7">
        <MicroText />
        <div className="flex items-center justify-between gap-3 border-b border-dashed border-wn-line pb-4">
          <span className="wn-display text-sm">Свидетельство о проверке имени</span>
          <Icon name="world-www" className="h-6 w-6 shrink-0 text-wn-sky" />
        </div>
        <p className="wn-mono mt-6 break-all text-3xl sm:text-4xl">
          {shown}
          <span className="text-wn-stamp">.uz</span>
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="wn-muted">Зона</dt>
            <dd className="font-bold">.UZ, второй уровень</dd>
          </div>
          <div>
            <dt className="wn-muted">Регистратор</dt>
            <dd className="font-bold">Arsenal D</dd>
          </div>
          <div>
            <dt className="wn-muted">Срок</dt>
            <dd className="font-bold">от 1 до 10 лет</dd>
          </div>
          <div>
            <dt className="wn-muted">Цена года</dt>
            <dd className="wn-mono font-bold">{sum(35_000)}</dd>
          </div>
        </dl>
        <div className="mt-7 flex min-h-12 flex-wrap items-center gap-3">
          {free ? (
            <Link href={`/webname/registry/domains?name=${encodeURIComponent(name)}`} className="wn-btn">
              Занять {name}.uz
              <Icon name="arrow-right" className="h-5 w-5" />
            </Link>
          ) : settled ? (
            <p className="text-sm">
              {alternatives.length ? (
                <>
                  Свободны рядом:{" "}
                  {alternatives.map((alt, index) => (
                    <b key={alt} className="wn-mono">
                      {index ? ", " : ""}
                      {alt}.uz
                    </b>
                  ))}
                </>
              ) : (
                "Попробуйте другое имя или зону .com"
              )}
            </p>
          ) : (
            <p className="wn-muted text-sm">Наберите имя — печать встанет здесь.</p>
          )}
        </div>
      </div>
      {settled ? <Stamp free={free} /> : null}
    </div>
  );
}

function Stamp({ free }: { free: boolean }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "wn-stamp pointer-events-none absolute bottom-24 right-3 select-none rounded-lg border-4 px-4 py-2 sm:bottom-28 sm:right-6",
        free ? "border-wn-stamp text-wn-stamp" : "border-wn-ink text-wn-ink",
      )}
      style={{ filter: "url(#wn-ink)", transform: "rotate(-8deg)" }}
    >
      <span className="block rounded border-2 border-current px-3 py-1">
        <span className="wn-display block text-3xl uppercase sm:text-4xl">{free ? "Свободен" : "Занят"}</span>
        <span className="wn-mono block text-center text-xs">ARSENAL D · .UZ</span>
      </span>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="wn-ink">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.6" />
          <feComposite in="SourceGraphic" operator="in" />
        </filter>
      </svg>
    </div>
  );
}

/** Микротекст по краю бланка — как на защищённой бумаге. */
function MicroText() {
  const line = "WEBNAME.UZ · ARSENAL D · .UZ · ".repeat(12);
  return (
    <span aria-hidden="true" className="wn-mono pointer-events-none absolute inset-x-0 bottom-1.5 overflow-hidden whitespace-nowrap text-center text-xs text-wn-sky/30">
      {line}
    </span>
  );
}

/** Пример ответа реестра — блок допа «Живая проверка». */
export function Whois({ name }: { name: string }) {
  const free = isFree(name, ".uz");
  const rows = free
    ? [
        ["Domain", `${name}.uz`],
        ["Status", "AVAILABLE"],
        ["Price", "35 000 UZS / 1 year"],
        ["Registrar", "Arsenal D — webname.uz"],
      ]
    : [
        ["Domain", `${name}.uz`],
        ["Status", "REGISTERED · clientTransferProhibited"],
        ["Name servers", "ns1.example.uz, ns2.example.uz"],
        ["Expires", "скрыто в демо"],
      ];
  return (
    <div className="wn-dark overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-3 text-sm">
        <span className="wn-mono">whois {name}.uz</span>
        <span className="wn-muted">пример ответа реестра cctld.uz · после подключения API — живой</span>
      </div>
      <dl className="wn-mono grid gap-1 px-5 py-4 text-sm sm:grid-cols-[12rem_1fr]">
        {rows.map(([key, value]) => (
          <div key={key} className="contents">
            <dt className="text-wn-muted-cobalt">{key}:</dt>
            <dd className={cn("break-all", key === "Status" && (free ? "text-wn-amber" : "text-wn-sky-bright"))}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Гильош — тонкие линии, как на банкнотах и свидетельствах             */
/* ------------------------------------------------------------------ */

function rosette(R: number, r: number, d: number, turns: number, steps: number, cx: number, cy: number, phase = 0): string {
  let path = "";
  for (let step = 0; step <= steps; step += 1) {
    const t = (step / steps) * Math.PI * 2 * turns + phase;
    const x = cx + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
    const y = cy + (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
    path += `${step ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return path;
}

/**
 * Две розетки гильоша на разных слоях параллакса: дальняя отстаёт от
 * прокрутки, ближняя её обгоняет. Слои не ловят нажатий и не читаются
 * вслух; при «уменьшить движение» стоят на месте.
 */
function Guilloche() {
  // Кривые считаются в браузере: в разметке сервера они весили бы сотню
  // килобайт, а нужны только для глаза.
  const [paths, setPaths] = useState<{ far: string[]; near: string[] } | null>(null);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() =>
      setPaths({
        far: [0, 1, 2, 3].map((k) => rosette(300, 66 + k * 3, 118 - k * 6, 11, 1100, 400, 400, k * 0.06)),
        near: [0, 1, 2].map((k) => rosette(210, 52 + k * 2, 70 + k * 4, 13, 900, 300, 300, k * 0.05)),
      }),
    );
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const far = paths?.far ?? [];
  const near = paths?.near ?? [];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Parallax speed={0.12} className="absolute -right-48 -top-40 h-[52rem] w-[52rem] opacity-60 sm:-right-24">
        <svg viewBox="0 0 800 800" className="h-full w-full" fill="none" strokeWidth="0.7">
          {far.map((d, index) => (
            <path key={index} d={d} stroke={index % 2 ? "#13689f" : "#6c5fd0"} strokeOpacity={0.32} />
          ))}
        </svg>
      </Parallax>
      <Parallax speed={-0.08} className="absolute -bottom-56 -left-56 h-[38rem] w-[38rem] opacity-50">
        <svg viewBox="0 0 600 600" className="h-full w-full" fill="none" strokeWidth="0.7">
          {near.map((d, index) => (
            <path key={index} d={d} stroke={index % 2 ? "#0b7a52" : "#c4221a"} strokeOpacity={0.28} />
          ))}
        </svg>
      </Parallax>
    </div>
  );
}

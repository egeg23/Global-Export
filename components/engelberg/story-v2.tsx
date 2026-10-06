"use client";
/* eslint-disable @next/next/no-img-element -- кадры истории подгружает движок по ходу прокрутки (data-src), next/image здесь не подходит */

import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

import { benefits, bkh65, brand, chambers, finishes, fs50, handles, portfolio, thermo90 } from "@/content/engelberg/site";

import { Wordmark } from "./art";
import { PhotoAirflow, Snow, type Live } from "./effects";
import { Stage } from "./engine";
import { Hotspot, Specs } from "./story";
import { clamp, inOut, keys, lerp, seg, window01 } from "./timeline";

/**
 * Engelberg, вторая версия — та же непрерывная история, но каждый кадр —
 * фотореалистичный рендер (GPT Image, docs/engelberg-assets.md).
 *
 * Кадры сделаны парами из одного снимка: пустой дом → дом с окнами, вечер
 * → метель в той же комнате, раздвижные двери закрыты → открыты, каркас
 * фасада → стекло. Пары совпадают попиксельно, поэтому переход между ними
 * выглядит не склейкой, а тем, что меняется сам мир в кадре. Между
 * разными снимками камера «пролетает»: приближается к точке, в которой
 * следующий кадр начинается.
 */

const IMG = "/images/engelberg/v2";
const OLD = "/images/engelberg";

export const CHAPTERS_V2 = [
  { t: 0, label: "Engelberg" },
  { t: 4.6, label: "Окна в пол" },
  { t: 16.4, label: "Три контура" },
  { t: 24.4, label: "Сквозь профиль" },
  { t: 30.2, label: "Внутри" },
  { t: 37.6, label: "Ручка Engelberg" },
  { t: 44.4, label: "Тишина" },
  { t: 50, label: "Раздвижные системы" },
  { t: 56.4, label: "Фасадные системы" },
  { t: 62.4, label: "Отделка" },
  { t: 66, label: "Портфолио" },
] as const;

const END = 71;
const LIGHT = [62.8, END + 1] as const;

/** Остекление на снимке villa (доли кадра): сначала первый этаж от центра, потом второй. */
const WINDOWS = [
  { at: 6.0, box: [0.365, 0.583, 0.508, 0.755] },
  { at: 6.4, box: [0.508, 0.583, 0.641, 0.755] },
  { at: 6.9, box: [0.213, 0.583, 0.365, 0.755] },
  { at: 7.2, box: [0.641, 0.583, 0.789, 0.755] },
  { at: 7.7, box: [0.383, 0.385, 0.479, 0.535] },
  { at: 7.9, box: [0.528, 0.385, 0.625, 0.535] },
  { at: 8.2, box: [0.227, 0.385, 0.341, 0.535] },
  { at: 8.4, box: [0.666, 0.385, 0.779, 0.535] },
] as const;

const clip = ([l, t, r, b]: readonly number[]) =>
  `inset(${(t * 100).toFixed(2)}% ${((1 - r) * 100).toFixed(2)}% ${((1 - b) * 100).toFixed(2)}% ${(l * 100).toFixed(2)}%)`;

type Ctx = { S: Stage; air: Live; snow: Live; row: { w: number } };

function frame({ S, air, snow, row }: Ctx, t: number) {
  const portrait = S.W < S.H;

  /* 0 · Альпы на рассвете ------------------------------------------- */
  S.fade("alps", 1 - seg(t, 4.4, 5.4));
  S.cam("alps", 0.5, keys(t, [[0, 0.42], [5.4, 0.7]]), keys(t, [[0, 1.05], [5.4, 1.6]]));
  const b = seg(t, 1.1, 3.0);
  S.pose("brand", { o: 1 - b, y: -0.07 * inOut(b), s: 1 - 0.05 * b });
  S.fade("hint", 1 - seg(t, 0, 0.5));
  S.fade("mist", keys(t, [[3.3, 0], [4.7, 0.92], [5.8, 0]]));

  /* 1 · Пустой дом, окна встают на место, подлёт к раме -------------- */
  const villaO = Math.min(seg(t, 4.6, 5.6), 1 - seg(t, 14.2, 15));
  S.fade("villa", villaO);
  S.cam(
    "villa",
    keys(t, [[4.6, 0.5], [8.6, 0.5], [11.4, 0.47], [15, 0.44]]),
    keys(t, [[4.6, 0.62], [8.6, 0.56], [11.4, 0.64], [15, 0.67]]),
    keys(t, [[4.6, 1.5], [8.6, portrait ? 1.0 : 1.08], [11.4, 1.3], [15, 2.9]]),
  );
  WINDOWS.forEach(({ at }, i) => S.fade(`vw${i}`, seg(t, at, at + 0.9)));
  S.fade("villa-lit", seg(t, 8.8, 9.8));

  S.fade("close", Math.min(seg(t, 14.2, 15), 1 - seg(t, 16.3, 17)));
  S.cam("close", 0.5, keys(t, [[14.2, 0.45], [17, 0.5]]), keys(t, [[14.2, 1.05], [15.6, 1.25], [17, 4.2]], inOut));

  /* 2 · Разрез профиля: три контура и воздух ------------------------- */
  S.fade("profile", Math.min(seg(t, 16.3, 17.1), 1 - seg(t, 25, 25.8)));
  // На телефоне разрез — в нижней половине кадра, карточки контуров —
  // сверху, под заголовком.
  const pu = portrait ? 0.56 : 0.66;
  const pv = portrait ? 0.65 : 0.6;
  const pz = portrait ? 1.15 : 1.25;
  S.cam(
    "profile",
    keys(t, [[16.3, 0.5], [17.8, pu], [24, pu], [25.8, 0.555]]),
    keys(t, [[16.3, 0.55], [17.8, pv], [24, pv], [25.8, 0.8]]),
    keys(t, [[16.3, 2.4], [17.8, pz], [24, pz * 1.04], [25.8, 7]], inOut),
  );
  S.fade("mk1", window01(t, 18, 24.2, 0.5));
  S.fade("mk2", window01(t, 18.8, 24.2, 0.5));
  S.fade("mk3", window01(t, 19.6, 24.2, 0.5));
  air.level = window01(t, 21.4, 24.8, 0.6);

  /* 3 · Пролёт сквозь термомост ------------------------------------- */
  S.fade("tunnel", Math.min(seg(t, 25.2, 26), 1 - seg(t, 30, 30.6)));
  S.cam("tunnel", 0.5, 0.5, keys(t, [[25.2, 1], [30.6, 2.6]]));
  S.fade("glow", keys(t, [[29.6, 0], [30.6, 1], [31.4, 0]]));

  /* 4 · Комната: облёт, подлёт к ручке двери ------------------------- */
  S.pose("room", {
    o: Math.min(seg(t, 30.3, 30.7), 1 - seg(t, 34.8, 35.8)),
    s: 1.06,
    ry: keys(t, [[30.3, -4], [35.8, 3]]),
  });
  S.cam("room", keys(t, [[30.3, 0.62], [35.8, 0.4]]), keys(t, [[30.3, 0.5], [35.8, 0.46]]), keys(t, [[30.3, 1.4], [35.8, 1.12]]));
  S.fade("hs-room", window01(t, 31.6, 34.6, 0.5));
  S.fade("door", Math.min(seg(t, 34.8, 35.8), 1 - seg(t, 37.4, 38.2)));
  S.cam("door", keys(t, [[34.8, 0.45], [38.2, 0.58]]), keys(t, [[34.8, 0.5], [38.2, 0.45]]), keys(t, [[34.8, 1.05], [38.2, 2.1]], inOut));
  S.fade("hs-handle", window01(t, 36, 37.6, 0.4));

  /* 5 · Ручка: снимок, герб крупно, серебро -------------------------- */
  S.fade("handle", Math.min(seg(t, 37.4, 38.2), 1 - seg(t, 40.4, 41.2)));
  S.cam("handle", keys(t, [[37.4, 0.6], [41.2, 0.56]]), keys(t, [[37.4, 0.4], [41.2, 0.36]]), keys(t, [[37.4, 1.6], [39, 1.12], [41.2, 1.6]], inOut));
  S.fade("macro", Math.min(seg(t, 40.4, 41.2), 1 - seg(t, 43, 43.8)));
  S.cam("macro", keys(t, [[40.4, 0.42], [43.8, 0.5]]), keys(t, [[40.4, 0.5], [43.8, 0.44]]), keys(t, [[40.4, 1.25], [43.8, 1.05]]));
  S.fade("silver", Math.min(seg(t, 43, 43.8), 1 - seg(t, 45.4, 46.2)));
  S.cam("silver", 0.55, 0.5, keys(t, [[43, 1.3], [46.2, 1.08]]));

  /* 6 · Тишина: та же комната, наступает метель --------------------- */
  S.fade("room2", Math.min(seg(t, 45.4, 46.2), 1 - seg(t, 50, 50.8)));
  S.fade("winter", Math.min(seg(t, 46.4, 47.8), 1 - seg(t, 50, 50.8)));
  const wz = keys(t, [[45.4, 1.3], [50.8, 1.05]]);
  S.cam("room2", 0.5, 0.42, wz);
  S.cam("winter", 0.5, 0.42, wz);
  snow.level = window01(t, 46.8, 50.6, 0.8) * 0.7;
  S.fade("snow-wrap", snow.level);
  S.vars({ "eb-quiet": seg(t, 47.2, 49) });

  /* 7 · BKH 65: двери отъезжают -------------------------------------- */
  S.fade("bkh", Math.min(seg(t, 50, 50.8), 1 - seg(t, 56.2, 57)));
  S.fade("bkh-open", Math.min(seg(t, 50, 50.8), 1 - seg(t, 56.2, 57)));
  const bu = keys(t, [[50, 0.5], [57, 0.52]]);
  const bv = keys(t, [[50, 0.5], [57, 0.46]]);
  const bz = keys(t, [[50, 1.3], [53, 1.04], [57, 1.3]]);
  S.cam("bkh", bu, bv, bz);
  S.cam("bkh-open", bu, bv, bz);
  S.vars({ "eb-open": inOut(seg(t, 51.8, 54.2)) });

  /* 8 · FS 50: стекло встаёт по этажам ------------------------------ */
  S.fade("fs", Math.min(seg(t, 56.2, 57), 1 - seg(t, 62.2, 63)));
  S.cam("fs", 0.5, keys(t, [[56.2, 0.82], [63, 0.3]]), keys(t, [[56.2, 1.5], [63, 1.1]]));
  S.vars({ "eb-build": seg(t, 57, 60.6) });

  /* 9 · Отделка ------------------------------------------------------ */
  S.fade("finish", Math.min(seg(t, 62.2, 63), 1 - seg(t, 65.6, 66.2)));
  finishes.forEach((_, i) => {
    const p = inOut(seg(t, 62.7 + i * 0.22, 63.9 + i * 0.22));
    const away = inOut(seg(t, 65.2, 66.2));
    S.pose(`sw${i}`, { y: (1 - p) * 0.7 - away * 0.15 * (i % 2 ? 1 : 0.6), o: p });
  });

  /* 10 · Портфолио --------------------------------------------------- */
  S.fade("port", seg(t, 65.8, 66.6));
  const pp = seg(t, 66.2, END - 0.4);
  const x0 = 0.06 * S.W;
  const x1 = Math.min(x0, S.W - row.w - 0.06 * S.W);
  S.pose("port-row", { x: lerp(x0, x1, pp) / S.W });

  S.runBeats(t);
}

/* ------------------------------------------------------------------ */

function Frame({
  k,
  name,
  from,
  eager,
  className,
  style,
  children,
}: {
  k: string;
  name: string;
  from: number;
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div className={`eb-layer${eager ? " eb-first" : ""}`} data-k={k}>
      <div className="eb-cam" data-cam={k} data-iw={3840} data-ih={2160}>
        {eager ? (
          <img
            alt=""
            className={className}
            style={style}
            src={`${IMG}/${name}-3200.webp`}
            srcSet={`${IMG}/${name}-1440.webp 1440w, ${IMG}/${name}-3200.webp 3200w`}
            sizes="100vw"
            fetchPriority="high"
          />
        ) : (
          <img
            alt=""
            className={className}
            style={style}
            data-src={`${IMG}/${name}-3200.webp`}
            data-src-m={`${IMG}/${name}-1440.webp`}
            data-from={from}
          />
        )}
        {children}
      </div>
    </div>
  );
}

/** Ещё одна копия кадра поверх основной — для окон, что загораются по одному. */
function Overlay({ k, name, from, style, className }: { k: string; name: string; from: number; style?: React.CSSProperties; className?: string }) {
  return (
    <img
      alt=""
      data-k={k}
      className={`eb-lit${className ? ` ${className}` : ""}`}
      style={style}
      data-src={`${IMG}/${name}-3200.webp`}
      data-src-m={`${IMG}/${name}-1440.webp`}
      data-from={from}
    />
  );
}

function Mark({
  k,
  u,
  v,
  n,
  label,
  accent,
  side = "right",
}: {
  k: string;
  u: number;
  v: number;
  n: string;
  label: string;
  accent?: boolean;
  side?: "right" | "left" | "up";
}) {
  return (
    <div className={`eb-mark-dot eb-mark-${side}${accent ? " eb-mark-accent" : ""}`} data-k={k} style={{ left: `${u * 100}%`, top: `${v * 100}%` }}>
      <i>{n}</i>
      <span>{label}</span>
    </div>
  );
}

export function StoryV2() {
  const root = useRef<HTMLDivElement>(null);
  const [air] = useState<Live>(() => ({ level: 0 }));
  const [snow] = useState<Live>(() => ({ level: 0 }));

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const S = new Stage(el);
    const row = { w: 0 };
    const hud = el.querySelector<HTMLElement>("[data-hud]");
    const bar = el.querySelector<HTMLElement>("[data-bar]");
    const track = el.querySelector<HTMLElement>(".eb-track");
    let vh = 0;
    let vw = 0;
    let chapter = -1;
    let light: boolean | null = null;

    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === vw && Math.abs(h - vh) < 140) return;
      vw = w;
      vh = h;
      if (track) track.style.height = `${Math.round((END + 1) * vh)}px`;
      S.resize(w, h);
      row.w = S.el("port-row")?.scrollWidth ?? 0;
    };

    const render = () => {
      const start = track ? track.getBoundingClientRect().top + window.scrollY : 0;
      const t = clamp((window.scrollY - start) / vh, 0, END);
      S.load(t);
      frame({ S, air, snow, row }, t);
      let c = 0;
      while (c + 1 < CHAPTERS_V2.length && t >= CHAPTERS_V2[c + 1].t) c += 1;
      if (c !== chapter && hud) {
        chapter = c;
        hud.textContent = `${String(c + 1).padStart(2, "0")} — ${CHAPTERS_V2[c].label}`;
      }
      if (bar) bar.style.transform = `scaleX(${(t / END).toFixed(4)})`;
      const isLight = t >= LIGHT[0] && t < LIGHT[1];
      if (isLight !== light) {
        light = isLight;
        document.documentElement.dataset.ebTone = isLight ? "light" : "dark";
      }
    };

    measure();
    render();

    const lenis = new Lenis({ duration: 1.6, wheelMultiplier: 0.8, touchMultiplier: 1.2 });
    let raf = 0;
    let lastY = -1;
    const loop = (now: number) => {
      lenis.raf(now);
      if (window.scrollY !== lastY) {
        lastY = window.scrollY;
        render();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => {
      measure();
      render();
    };
    window.addEventListener("resize", onResize);

    const rest = () => S.loadRest();
    if (document.readyState === "complete") setTimeout(rest, 1200);
    else window.addEventListener("load", () => setTimeout(rest, 1200), { once: true });

    const onClick = (event: MouseEvent) => {
      const a = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
      if (!a) return;
      const target = document.querySelector(a.getAttribute("href")!);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 2.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
      delete document.documentElement.dataset.ebTone;
    };
  }, [air, snow]);

  return (
    <div ref={root} className="eb-story eb-v2">
      <div className="eb-track">
        <div className="eb-stage">
          {/* 0 · Альпы */}
          <Frame k="alps" name="alps" from={0} eager />
          <div className="eb-layer eb-first eb-veil" />

          {/* 1 · Дом: пустой, окна встают по одному, затем весь свет */}
          <Frame k="villa" name="villa-empty" from={4}>
            {WINDOWS.map(({ box }, i) => (
              <Overlay key={i} k={`vw${i}`} name="villa" from={4} style={{ clipPath: clip(box) }} />
            ))}
            <Overlay k="villa-lit" name="villa" from={4} />
          </Frame>
          <Frame k="close" name="villa-close" from={12} />

          {/* 2 · Разрез */}
          <Frame k="profile" name="profile" from={14}>
            <PhotoAirflow live={air} />
            <Mark k="mk1" u={0.627} v={0.9} n="01" label="Наружный контур" />
            <Mark k="mk2" u={0.56} v={0.79} n="02" label="Термомост 39 мм" accent side="up" />
            <Mark k="mk3" u={0.478} v={0.81} n="03" label="Внутренний контур" side="left" />
          </Frame>

          {/* 3 · Туннель */}
          <Frame k="tunnel" name="tunnel" from={22} />
          <div className="eb-layer eb-glow" data-k="glow" />

          {/* 4 · Комната и дверь */}
          <Frame k="room" name="room" from={27}>
            <Hotspot k="hs-room" u={0.52} v={0.3} label="Thermo 90 · окна в пол" />
          </Frame>
          <Frame k="door" name="room-door" from={31}>
            <Hotspot k="hs-handle" u={0.6} v={0.32} label="Ручка Engelberg" />
          </Frame>

          {/* 5 · Ручка */}
          <Frame k="handle" name="handle" from={34} />
          <Frame k="macro" name="handle-macro" from={36} />
          <Frame k="silver" name="handle-silver" from={38} />

          {/* 6 · Тишина */}
          <Frame k="room2" name="room" from={40} />
          <Frame k="winter" name="winter" from={40} />
          <div className="eb-layer eb-snow" data-k="snow-wrap">
            <Snow live={snow} />
          </div>

          {/* 7 · BKH 65: открытые двери проявляются справа налево */}
          <Frame k="bkh" name="bkh-closed" from={45} />
          <Frame k="bkh-open" name="bkh-open" from={45} className="eb-opening" />

          {/* 8 · FS 50 */}
          <Frame k="fs" name="fs-frame" from={51}>
            <Overlay k="fs-glass" name="fs-glass" from={51} className="eb-built eb-on" />
            <span className="eb-scan" />
          </Frame>

          {/* 9 · Отделка */}
          <div className="eb-layer eb-finish" data-k="finish">
            <div className="eb-swatches">
              {finishes.map((f, i) => (
                <div key={f.name} className="eb-swatch" data-k={`sw${i}`} style={{ "--tone": f.tone } as React.CSSProperties}>
                  <span className={f.wood ? "eb-wood" : undefined} />
                  <b>{f.name}</b>
                  <small>{f.code}</small>
                </div>
              ))}
            </div>
          </div>

          {/* 10 · Портфолио — их настоящие объекты */}
          <div className="eb-layer eb-port" data-k="port">
            <div className="eb-port-row" data-k="port-row">
              {portfolio.map((p) => (
                <figure key={p.name}>
                  <img alt={p.name} data-src={`${OLD}/${p.image}.webp`} data-from={62} />
                  <figcaption>
                    <b>{p.name}</b>
                    <span>{p.kind}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="eb-layer eb-first eb-mist" data-k="mist" />

          {/* ---------------- Подписи ---------------- */}

          <div className="eb-brand eb-first" data-k="brand">
            <img className="eb-crest" src={`${OLD}/crest.svg`} alt="" />
            <Wordmark className="eb-wordmark" />
            <p className="eb-slogan">{brand.slogan}</p>
          </div>
          <div className="eb-hint eb-first" data-k="hint">
            <span>Листайте</span>
            <i />
          </div>

          <div className="eb-beat eb-at-center" data-beat="2.6 4.9">
            <p className="eb-display" data-line>
              {brand.motto}
            </p>
            <p className="eb-sub" data-line>
              Инженерная точность, премиальные материалы и внимание к деталям.
            </p>
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="5.6 9.4">
            <p className="eb-eyebrow" data-line>
              01 · На объекте
            </p>
            <h2 className="eb-h" data-line>
              Дом получает окна — и оживает
            </h2>
            <p className="eb-p" data-line>
              {brand.lead}
            </p>
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="9.8 12.8">
            <p className="eb-eyebrow" data-line>
              Окна в пол · {thermo90.series}
            </p>
            <h2 className="eb-h eb-h-xl" data-line>
              {thermo90.name}
            </h2>
            <p className="eb-p" data-line>
              {thermo90.lead}
            </p>
          </div>

          <div className="eb-beat eb-at-left eb-panel" data-beat="12.8 16.6">
            <p className="eb-eyebrow" data-line>
              {thermo90.name} · характеристики
            </p>
            <div className="eb-big" data-line>
              {thermo90.headline.map((h) => (
                <div key={h.label}>
                  <b>{h.value}</b>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
            <Specs items={thermo90.specs} />
          </div>

          <div className="eb-beat eb-at-top eb-narrow" data-beat="17.4 24.6">
            <p className="eb-eyebrow" data-line>
              02 · Внутри рамы
            </p>
            <h2 className="eb-h3" data-line>
              Три контура, которые держат тепло
            </h2>
          </div>

          {chambers.map((c, i) => (
            <div key={c.n} className={`eb-beat eb-chamber eb-chamber-${i}`} data-beat={`${18 + i * 0.8} 21.6`}>
              <p className="eb-chamber-n" data-line>
                {c.n}
              </p>
              <div data-line>
                <b>{c.title}</b>
                <p>{c.text}</p>
              </div>
            </div>
          ))}

          <div className="eb-beat eb-chamber-slot" data-beat="21.8 25">
            <p className="eb-eyebrow" data-line>
              Воздух у окна
            </p>
            <h3 className="eb-h3" data-line>
              Холод остаётся за стеклом
            </h3>
            <p className="eb-p" data-line>
              Холодный воздух улицы упирается в стекло и наружный контур. Тёплый воздух комнаты движется спокойно: у
              тёплого стекла не рождается сквозняк вниз и не оседает конденсат.
            </p>
            <p className="eb-legend" data-line>
              <span className="eb-cold-dot" /> улица <span className="eb-warm-dot" /> дом
            </p>
          </div>

          {benefits.map((item, i) => (
            <div key={item.title} className="eb-beat eb-at-center" data-beat={`${25.8 + i * 1.15} ${27 + i * 1.15}`}>
              <p className="eb-eyebrow" data-line>
                {String(i + 1).padStart(2, "0")} / 04
              </p>
              <p className="eb-display" data-line>
                {item.title}
              </p>
              <p className="eb-sub" data-line>
                {item.text}
              </p>
            </div>
          ))}

          <div className="eb-beat eb-at-left-bottom" data-beat="31.2 34.6">
            <p className="eb-eyebrow" data-line>
              03 · Внутри
            </p>
            <h2 className="eb-h" data-line>
              Окно, которое становится частью интерьера
            </h2>
            <p className="eb-p" data-line>
              Тонкие профили и большие форматы остекления работают вместе с фасадом, интерьером и видом.
            </p>
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="35.4 37.6">
            <p className="eb-eyebrow" data-line>
              Деталь
            </p>
            <h2 className="eb-h" data-line>
              Каждый день окно открывают рукой
            </h2>
          </div>

          <div className="eb-beat eb-at-left eb-handle-copy" data-beat="38.2 40.8">
            <p className="eb-eyebrow" data-line>
              04 · Аксессуары
            </p>
            <h2 className="eb-h eb-h-xl" data-line>
              {handles.name}
            </h2>
            <p className="eb-p" data-line>
              {handles.lead}
            </p>
            <p className="eb-badge" data-line>
              {handles.origin}
            </p>
          </div>

          <div className="eb-beat eb-at-right-bottom" data-beat="41.2 43.4">
            <p className="eb-eyebrow" data-line>
              Крупно
            </p>
            <h3 className="eb-h3" data-line>
              Герб на рычаге, имя на розетке
            </h3>
            <p className="eb-p" data-line>
              Деталь, определяющая характер окна.
            </p>
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="43.8 46">
            <p className="eb-eyebrow" data-line>
              Шесть финишей
            </p>
            <h3 className="eb-h3" data-line>
              Под раму, интерьер и руку
            </h3>
          </div>

          <div className="eb-beat eb-at-left-bottom eb-quiet" data-beat="46.8 49.2">
            <p className="eb-eyebrow" data-line>
              05 · Тишина
            </p>
            <div className="eb-db" data-line>
              <b>43 дБ</b>
              <svg viewBox="0 0 240 40" aria-hidden="true">
                <path className="eb-wave" d="M0 20 Q 10 2 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20 T 220 20 T 240 20" />
              </svg>
            </div>
            <h2 className="eb-h" data-line>
              За стеклом метель. В комнате тихо
            </h2>
            <p className="eb-p" data-line>
              Thermo 90 снижает уровень шума на 43 дБ: комфорт даже рядом с оживлённой трассой.
            </p>
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="49.2 50.6">
            <p className="eb-display eb-display-s" data-line>
              Тепло остаётся внутри даже в суровом климате
            </p>
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="50.8 53.8">
            <p className="eb-eyebrow" data-line>
              06 · {bkh65.series}
            </p>
            <h2 className="eb-h eb-h-xl" data-line>
              {bkh65.name}
            </h2>
            <p className="eb-p" data-line>
              {bkh65.lead}
            </p>
          </div>

          <div className="eb-beat eb-at-right eb-panel" data-beat="53.8 56.6">
            <p className="eb-eyebrow" data-line>
              {bkh65.name} · характеристики
            </p>
            <div className="eb-big" data-line>
              <div>
                <b>{bkh65.headline.value}</b>
                <span>{bkh65.headline.label}</span>
              </div>
            </div>
            <Specs items={bkh65.specs} />
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="57 59.8">
            <p className="eb-eyebrow" data-line>
              07 · {fs50.series}
            </p>
            <h2 className="eb-h eb-h-xl" data-line>
              {fs50.name}
            </h2>
            <p className="eb-p" data-line>
              {fs50.lead} {fs50.about}
            </p>
          </div>

          <div className="eb-beat eb-at-left eb-panel" data-beat="60 62.6">
            <p className="eb-eyebrow" data-line>
              {fs50.name} · характеристики
            </p>
            <div className="eb-big" data-line>
              <div>
                <b>{fs50.headline.value}</b>
                <span>{fs50.headline.label}</span>
              </div>
            </div>
            <Specs items={fs50.specs} />
          </div>

          <div className="eb-beat eb-at-top eb-ink" data-beat="63.2 66">
            <p className="eb-eyebrow" data-line>
              08 · Ламинация и отделка
            </p>
            <h2 className="eb-h" data-line>
              Премиальные ламинации
            </h2>
            <p className="eb-p" data-line>
              Десятки декоров: от натурального дерева до металлик и однотонных RAL — под фасад, интерьер и вид.
            </p>
          </div>

          <div className="eb-beat eb-at-top eb-ink" data-beat="66.4 72">
            <p className="eb-eyebrow" data-line>
              09 · Портфолио
            </p>
            <h2 className="eb-h" data-line>
              Окна с вашим характером
            </h2>
            <p className="eb-p" data-line>
              Резиденции, виллы, апартаменты и объекты, где окно работает вместе с фасадом, интерьером и видом.
            </p>
          </div>

          <div className="eb-hud" aria-hidden="true">
            <span data-hud>01 — Engelberg</span>
            <i>
              <b data-bar />
            </i>
          </div>
        </div>
      </div>
    </div>
  );
}

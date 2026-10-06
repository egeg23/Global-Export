"use client";
/* eslint-disable @next/next/no-img-element -- кадры истории подгружает движок по ходу прокрутки (data-src), next/image здесь не подходит */

import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

import { benefits, bkh65, brand, chambers, finishes, fs50, handles, portfolio, thermo90 } from "@/content/engelberg/site";

import { ProfileSection, Tunnel, Wordmark } from "./art";
import { Airflow, Snow, type Live } from "./effects";
import { Stage } from "./engine";
import { clamp, inOut, keys, lerp, seg, window01 } from "./timeline";

/**
 * Engelberg — одна непрерывная история на прокрутке.
 *
 * Сцена одна, приколотая к экрану, и всё в ней — функции времени t
 * (в экранах прокрутки). Стыков нет: следующий кадр всегда рождается внутри
 * предыдущего — горы уходят в облако, из облака выходит дом, камера
 * подлетает к раме и оказывается в разрезе профиля, пролетает сквозь
 * термомост и выходит светом в комнату. Порядок сцен — в CHAPTERS.
 */

const IMG = "/images/engelberg";

export const CHAPTERS = [
  { t: 0, label: "Engelberg" },
  { t: 4.6, label: "Окна в пол" },
  { t: 15.4, label: "Три контура" },
  { t: 23.6, label: "Сквозь профиль" },
  { t: 29.6, label: "Внутри" },
  { t: 37.2, label: "Ручка Engelberg" },
  { t: 43.6, label: "Тишина" },
  { t: 48.8, label: "Раздвижные системы" },
  { t: 55.2, label: "Фасадные системы" },
  { t: 61.4, label: "Отделка" },
  { t: 65, label: "Портфолио" },
] as const;

/** Длина истории в экранах; после неё — обычная страница с заявкой. */
const END = 70;

/** Светлые сцены: шапка на них тёмная. */
const LIGHT = [61.8, END + 1] as const;

/** Остекление дома на снимке villa: многоугольники в долях кадра. */
const VILLA_WINDOWS = [
  { at: 6.0, pts: "39% 57.7%, 63.3% 55.2%, 63.3% 73.5%, 39% 72.7%" },
  { at: 6.6, pts: "63.3% 55.2%, 81% 58.7%, 81% 72%, 63.3% 73.5%" },
  { at: 7.2, pts: "23.7% 43.3%, 37.5% 39.4%, 37.5% 52.7%, 23.7% 53.6%" },
  { at: 7.8, pts: "58.3% 31.9%, 69.8% 28.1%, 80.8% 34.5%, 80.8% 49.5%, 69.8% 47.2%, 58.3% 48.2%" },
];

/* ------------------------------------------------------------------ */
/* Кадры                                                              */
/* ------------------------------------------------------------------ */

type Ctx = { S: Stage; air: Live; snow: Live; row: { w: number } };

function frame({ S, air, snow, row }: Ctx, t: number) {
  /* 0 · Бренд над Альпами ------------------------------------------ */
  S.fade("alps", 1 - seg(t, 4.4, 5.4));
  S.cam("alps", 0.5, keys(t, [[0, 0.4], [5.4, 0.72]]), keys(t, [[0, 1.06], [5.4, 1.55]]));
  const b = seg(t, 1.1, 3.0);
  S.pose("brand", { o: 1 - b, y: -0.07 * inOut(b), s: 1 - 0.05 * b });
  S.fade("hint", 1 - seg(t, 0, 0.5));
  S.fade("mist", keys(t, [[3.3, 0], [4.7, 0.92], [5.8, 0]]));

  /* 1 · Дом, окна загораются, камера подлетает к раме ---------------- */
  S.fade("villa", Math.min(seg(t, 4.6, 5.6), 1 - seg(t, 15.4, 16.1)));
  S.cam(
    "villa",
    keys(t, [[4.6, 0.5], [8, 0.5], [11, 0.56], [13.6, 0.6], [16.1, 0.633]]),
    keys(t, [[4.6, 0.7], [8, 0.5], [11, 0.54], [13.6, 0.63], [16.1, 0.64]]),
    keys(t, [[4.6, 1.45], [8, 1.0], [11, 1.08], [13.6, 2.3], [16.1, 6.5]]),
  );
  VILLA_WINDOWS.forEach(({ at }, i) => {
    S.fade(`vw${i}`, seg(t, at, at + 1.1));
    S.vars({ [`eb-draw-${i}`]: seg(t, at - 0.5, at + 0.7) });
  });
  S.fade("villa-lit", seg(t, 8.8, 10.2));
  S.fade("villa-lines", 1 - seg(t, 10, 11));

  /* 2 · Разрез профиля: три контура и воздух ------------------------- */
  S.fade("lab", Math.min(seg(t, 15.3, 16), 1 - seg(t, 29.8, 30.3)));
  S.pose("section", {
    o: Math.min(seg(t, 15.6, 16.6), 1 - seg(t, 23.9, 24.5)),
    s: keys(t, [[15.6, 1.6], [17.2, 1], [23.2, 1.05], [24.5, 8]], inOut),
  });
  S.vars({
    "eb-sec": seg(t, 15.9, 17.3),
    "eb-m1": window01(t, 17, 23.2, 0.5),
    "eb-m2": window01(t, 17.8, 23.2, 0.5),
    "eb-m3": window01(t, 18.6, 23.2, 0.5),
    "eb-heat": seg(t, 19.6, 20.6) * (1 - seg(t, 23.2, 23.8)),
  });
  air.level = window01(t, 20.4, 24, 0.6);

  /* 3 · Пролёт сквозь термомост ------------------------------------- */
  S.fade("tunnel", Math.min(seg(t, 23.7, 24.5), 1 - seg(t, 29.6, 30.2)));
  if (t > 23 && t < 30.5) ribs(S, (t - 23.6) / 6);
  S.fade("glow", keys(t, [[29.2, 0], [30.2, 1], [31.1, 0]]));

  /* 4 · Комната: облёт и подлёт к ручке ----------------------------- */
  S.pose("room", {
    o: Math.min(seg(t, 29.9, 30.3), 1 - seg(t, 33.4, 34.4)),
    s: 1.08,
    ry: keys(t, [[29.5, -5], [34.4, 4]]),
  });
  S.cam("room", keys(t, [[29.5, 0.66], [34.4, 0.32]]), keys(t, [[29.5, 0.55], [34.4, 0.5]]), keys(t, [[29.5, 1.5], [34.4, 1.12]]));
  S.pose("garden", {
    o: Math.min(seg(t, 33.4, 34.4), 1 - seg(t, 37, 37.6)),
    s: 1.08,
    ry: keys(t, [[33.4, -4], [35.4, 0]]),
  });
  S.cam(
    "garden",
    keys(t, [[33.4, 0.7], [35.4, 0.52], [37.6, 0.43]]),
    keys(t, [[33.4, 0.5], [35.4, 0.45], [37.6, 0.5]]),
    keys(t, [[33.4, 1.15], [35.4, 1.1], [37.6, 4.6]], inOut),
  );
  S.fade("hs-room", window01(t, 31, 33.4, 0.5));
  S.fade("hs-quiet", window01(t, 34.4, 36.2, 0.5));
  S.fade("hs-handle", window01(t, 35.6, 37, 0.4));

  /* 5 · Ручка: обзор ------------------------------------------------- */
  S.fade("hstage", Math.min(seg(t, 36.9, 37.6), 1 - seg(t, 43.2, 44)));
  S.pose("handle", {
    o: Math.min(seg(t, 37.2, 38), 1 - seg(t, 42.4, 43.2)),
    s: keys(t, [[37.2, 1.5], [38.6, 1], [40.2, 1.02], [41, 1.9], [41.8, 1.9], [42.6, 1]], inOut),
    ry: keys(t, [[37.2, -22], [39.4, 16], [41, 0], [43.2, -12]]),
  });
  S.vars({ "eb-sweep": seg(t, 37.8, 40.6), "eb-sweep2": seg(t, 40.8, 42.2) });
  S.pose("handle-alt", { o: window01(t, 42, 44, 0.6), y: lerp(0.06, 0, inOut(seg(t, 42, 43))) });

  /* 6 · Тишина: зима за стеклом ------------------------------------- */
  S.fade("winter", Math.min(seg(t, 43.4, 44.2), 1 - seg(t, 48.4, 49.2)));
  S.cam("winter", 0.5, keys(t, [[43.4, 0.42], [49.2, 0.55]]), keys(t, [[43.4, 1.3], [49.2, 1.05]]));
  S.pose("wframe", {
    o: Math.min(seg(t, 43.4, 44.2), 1 - seg(t, 48.4, 49.2)),
    s: keys(t, [[43.4, 1.5], [45.2, 1], [49.2, 0.94]], inOut),
  });
  snow.level = window01(t, 43.6, 49, 0.6);
  S.fade("snow-wrap", snow.level);
  S.vars({ "eb-quiet": seg(t, 44.6, 46.8) });

  /* 7 · BKH 65 ------------------------------------------------------- */
  S.fade("sliding", Math.min(seg(t, 48.6, 49.4), 1 - seg(t, 54.8, 55.6)));
  S.cam(
    "sliding",
    keys(t, [[48.6, 0.56], [51, 0.55], [53.2, 0.44], [55.6, 0.5]]),
    keys(t, [[48.6, 0.5], [51, 0.45], [53.2, 0.46], [55.6, 0.44]]),
    keys(t, [[48.6, 1.35], [51, 1], [53.2, 1.2], [55.6, 1.5]]),
  );
  S.vars({ "eb-slide-draw": seg(t, 49.6, 50.8), "eb-slide": seg(t, 52.4, 54.4) });
  S.fade("slide-lines", window01(t, 49.6, 54.6, 0.6));
  S.pose("bkh-cards", { o: window01(t, 50.6, 54.8, 0.6), y: lerp(0.1, -0.06, seg(t, 50.6, 54.8)) });

  /* 8 · FS 50: фасад собирается этаж за этажом ----------------------- */
  S.fade("facade", Math.min(seg(t, 55, 55.8), 1 - seg(t, 61, 61.8)));
  S.cam("facade", 0.5, keys(t, [[55, 0.85], [61.8, 0.22]]), keys(t, [[55, 1.55], [61.8, 1.12]]));
  S.vars({ "eb-build": seg(t, 55.8, 59.6) });

  /* 9 · Отделка ------------------------------------------------------ */
  S.fade("finish", Math.min(seg(t, 61.2, 62), 1 - seg(t, 64.6, 65.2)));
  finishes.forEach((_, i) => {
    const p = inOut(seg(t, 61.7 + i * 0.22, 62.9 + i * 0.22));
    const away = inOut(seg(t, 64.2, 65.2));
    S.pose(`sw${i}`, { y: (1 - p) * 0.7 - away * 0.15 * (i % 2 ? 1 : 0.6), o: p });
  });

  /* 10 · Портфолио --------------------------------------------------- */
  S.fade("port", seg(t, 64.8, 65.6));
  const pp = seg(t, 65.2, END - 0.4);
  const x0 = 0.06 * S.W;
  const x1 = Math.min(x0, S.W - row.w - 0.06 * S.W);
  S.pose("port-row", { x: lerp(x0, x1, pp) / S.W });

  S.runBeats(t);
}

const RIBS = 9;

/** Рёбра туннеля: каждое идёт из глубины навстречу и гаснет у камеры. */
function ribs(S: Stage, fly: number) {
  for (let i = 0; i < RIBS; i += 1) {
    const el = S.el(`rib${i}`);
    if (!el) continue;
    const d = (((i / RIBS + fly * 2.4) % 1) + 1) % 1;
    // Ближе 0 ребро не подходит: крупнее экрана оно только нагружает кадр.
    const z = -2400 + d * 2400;
    const o = d < 0.15 ? d / 0.15 : d > 0.7 ? Math.max(0, (1 - d) / 0.3) : 1;
    el.style.transform = `translate3d(-50%,-50%,${z.toFixed(0)}px)`;
    el.style.opacity = o.toFixed(3);
  }
}

/* ------------------------------------------------------------------ */
/* Разметка                                                           */
/* ------------------------------------------------------------------ */

function Shot({
  k,
  name,
  iw,
  ih,
  from,
  eager,
  imgClass,
  children,
}: {
  k: string;
  name: string;
  iw: number;
  ih: number;
  from: number;
  eager?: boolean;
  imgClass?: string;
  children?: React.ReactNode;
}) {
  const wide = name === "villa" ? 2400 : 1920;
  return (
    <div className={`eb-layer${eager ? " eb-first" : ""}`} data-k={k}>
      <div className="eb-cam" data-cam={k} data-iw={iw} data-ih={ih}>
        {eager ? (
          <img
            alt=""
            src={`${IMG}/${name}-${wide}.webp`}
            srcSet={`${IMG}/${name}-1080.webp 1080w, ${IMG}/${name}-${wide}.webp ${wide}w`}
            sizes="100vw"
            fetchPriority="high"
          />
        ) : (
          <img
            alt=""
            className={imgClass}
            data-src={`${IMG}/${name}-${wide}.webp`}
            data-src-m={`${IMG}/${name}-1080.webp`}
            data-from={from}
          />
        )}
        {children}
      </div>
    </div>
  );
}

function Specs({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="eb-specs">
      {items.map((item) => (
        <div key={item.label} data-line>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Hotspot({ k, u, v, label }: { k: string; u: number; v: number; label: string }) {
  return (
    <div className="eb-hotspot" data-k={k} style={{ left: `${u * 100}%`, top: `${v * 100}%` }}>
      <i />
      <span>{label}</span>
    </div>
  );
}

export function Story() {
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
    const top = el.querySelector<HTMLElement>(".eb-track");
    let vh = 0;
    let vw = 0;
    let chapter = -1;
    let light: boolean | null = null;

    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Телефон меняет высоту окна, пряча адресную строку. Мелкие
      // изменения пропускаем, чтобы длина истории не прыгала под пальцем.
      if (w === vw && Math.abs(h - vh) < 140) return;
      vw = w;
      vh = h;
      if (top) top.style.height = `${Math.round((END + 1) * vh)}px`;
      S.resize(w, h);
      row.w = S.el("port-row")?.scrollWidth ?? 0;
    };

    const render = () => {
      const start = top ? top.getBoundingClientRect().top + window.scrollY : 0;
      const t = clamp((window.scrollY - start) / vh, 0, END);
      S.load(t);
      frame({ S, air, snow, row }, t);

      let c = 0;
      while (c + 1 < CHAPTERS.length && t >= CHAPTERS[c + 1].t) c += 1;
      if (c !== chapter && hud) {
        chapter = c;
        hud.textContent = `${String(c + 1).padStart(2, "0")} — ${CHAPTERS[c].label}`;
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
    // Один цикл кадров на всё: Lenis сглаживает прокрутку, а кадр истории
    // пересчитывается, только если страница действительно сдвинулась.
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

    // Ссылки на заявку — плавным ходом, а не прыжком через всю историю.
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
    <div ref={root} className="eb-story">
      <div className="eb-track">
        <div className="eb-stage">
          {/* 0 · Альпы */}
          <Shot k="alps" name="alps" iw={2400} ih={1603} from={0} eager />
          <div className="eb-layer eb-first eb-veil" />

          {/* 1 · Дом */}
          <Shot k="villa" name="villa" iw={2400} ih={1867} from={4.6} imgClass="eb-unlit">
            {VILLA_WINDOWS.map(({ pts }, i) => (
              <img
                key={i}
                alt=""
                data-k={`vw${i}`}
                className="eb-lit"
                style={{ clipPath: `polygon(${pts})` }}
                data-src={`${IMG}/villa-2400.webp`}
                data-src-m={`${IMG}/villa-1080.webp`}
                data-from={4.6}
              />
            ))}
            <img alt="" data-k="villa-lit" className="eb-lit" data-src={`${IMG}/villa-2400.webp`} data-src-m={`${IMG}/villa-1080.webp`} data-from={4.6} />
            <svg className="eb-frames" data-k="villa-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {VILLA_WINDOWS.map(({ pts }, i) => (
                <polygon
                  key={i}
                  points={pts.replaceAll("%", "").replaceAll(",", " ")}
                  pathLength={1}
                  style={{ strokeDashoffset: `calc(1 - var(--eb-draw-${i}, 0))` }}
                />
              ))}
            </svg>
          </Shot>

          {/* 2 · Разрез профиля */}
          <div className="eb-layer eb-lab" data-k="lab" />
          <div className="eb-layer eb-section-wrap" data-k="section">
            <div className="eb-section-box">
              <ProfileSection />
              <Airflow live={air} />
              <span className="eb-side eb-side-out">Улица</span>
              <span className="eb-side eb-side-in">Дом</span>
            </div>
          </div>

          {/* 3 · Туннель */}
          <div className="eb-layer eb-tunnel-wrap" data-k="tunnel">
            <Tunnel />
          </div>

          {/* 4 · Комнаты */}
          <Shot k="room" name="room" iw={2400} ih={1600} from={29.5}>
            <Hotspot k="hs-room" u={0.45} v={0.5} label="Панорамное остекление" />
          </Shot>
          <Shot k="garden" name="garden-room" iw={2400} ih={1600} from={33.4}>
            <Hotspot k="hs-quiet" u={0.62} v={0.32} label="Тишина: снижение шума до 43 дБ" />
            <Hotspot k="hs-handle" u={0.432} v={0.5} label="Ручка" />
          </Shot>
          <div className="eb-layer eb-glow" data-k="glow" />

          {/* 5 · Ручка */}
          <div className="eb-layer eb-hstage" data-k="hstage">
            <div className="eb-handle" data-k="handle">
              <img alt="Ручка Engelberg, чёрная" data-src={`${IMG}/handle-black.webp`} data-from={37} />
              <span className="eb-sweep" />
            </div>
            <div className="eb-handle-alt" data-k="handle-alt">
              <figure>
                <img alt="Ручка Engelberg, изогнутая" data-src={`${IMG}/handle-curve.webp`} data-from={37} />
              </figure>
              <figure>
                <img alt="Ручка Engelberg, серебро" data-src={`${IMG}/handle-silver.webp`} data-from={37} />
              </figure>
              <figure>
                <img alt="Ручки Engelberg на раме под дуб" data-src={`${IMG}/handle-pair.webp`} data-from={37} />
              </figure>
            </div>
          </div>

          {/* 6 · Зима за стеклом */}
          <Shot k="winter" name="winter" iw={2400} ih={1400} from={43.4} />
          <div className="eb-layer eb-snow" data-k="snow-wrap">
            <Snow live={snow} />
          </div>
          <div className="eb-layer eb-wframe" data-k="wframe" aria-hidden="true">
            <span className="eb-wf-mullion" />
            <span className="eb-wf-transom" />
          </div>

          {/* 7 · BKH 65 */}
          <Shot k="sliding" name="sliding" iw={2400} ih={1600} from={48.6}>
            <svg className="eb-frames eb-slide-lines" data-k="slide-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="30 19 81 19 81 72 30 72" pathLength={1} style={{ strokeDashoffset: "calc(1 - var(--eb-slide-draw, 0))" }} />
              <line x1="51" y1="19" x2="51" y2="72" pathLength={1} style={{ strokeDashoffset: "calc(1 - var(--eb-slide-draw, 0))" }} />
            </svg>
          </Shot>
          <div className="eb-layer eb-bkh-cards" data-k="bkh-cards">
            <figure>
              <img alt="Терраса с системой Engelberg" data-src={`${IMG}/terrace.webp`} data-from={48} />
            </figure>
            <figure>
              <img alt="Раздвижная система Engelberg в квартире" data-src={`${IMG}/apartment-sliding.webp`} data-from={48} />
            </figure>
          </div>

          {/* 8 · FS 50 */}
          <Shot k="facade" name="facade" iw={2400} ih={1600} from={55} imgClass="eb-blueprint">
            <img alt="" className="eb-built" data-src={`${IMG}/facade-1920.webp`} data-src-m={`${IMG}/facade-1080.webp`} data-from={55} />
            <span className="eb-scan" />
          </Shot>

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

          {/* 10 · Портфолио */}
          <div className="eb-layer eb-port" data-k="port">
            <div className="eb-port-row" data-k="port-row">
              {portfolio.map((p) => (
                <figure key={p.name}>
                  <img alt={p.name} data-src={`${IMG}/${p.image}.webp`} data-from={64} />
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
            <img className="eb-crest" src={`${IMG}/crest.svg`} alt="" />
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

          <div className="eb-beat eb-at-left-bottom" data-beat="5.5 9.0">
            <p className="eb-eyebrow" data-line>
              01 · На объекте
            </p>
            <h2 className="eb-h" data-line>
              Свет, вид и тишина — с первого взгляда на дом
            </h2>
            <p className="eb-p" data-line>
              {brand.lead}
            </p>
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="9.4 12.8">
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

          <div className="eb-beat eb-at-left eb-panel" data-beat="13 15.8">
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

          <div className="eb-beat eb-at-top eb-narrow" data-beat="16.2 23.4">
            <p className="eb-eyebrow" data-line>
              02 · Внутри рамы
            </p>
            <h2 className="eb-h3" data-line>
              Три контура, которые держат тепло
            </h2>
          </div>

          {chambers.map((c, i) => (
            <div key={c.n} className={`eb-beat eb-chamber eb-chamber-${i}`} data-beat={`${17 + i * 0.8} 20.6`}>
              <p className="eb-chamber-n" data-line>
                {c.n}
              </p>
              <div data-line>
                <b>{c.title}</b>
                <p>{c.text}</p>
              </div>
            </div>
          ))}

          <div className="eb-beat eb-chamber-slot" data-beat="20.8 23.6">
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
            <div key={item.title} className="eb-beat eb-at-center" data-beat={`${24.6 + i * 1.25} ${25.9 + i * 1.25}`}>
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

          <div className="eb-beat eb-at-left-bottom" data-beat="30.9 33.4">
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

          <div className="eb-beat eb-at-right-bottom" data-beat="34.4 36.6">
            <p className="eb-eyebrow" data-line>
              Деталь
            </p>
            <h2 className="eb-h" data-line>
              Каждый день окно открывают рукой
            </h2>
            <p className="eb-p" data-line>
              Поэтому ручке — отдельное внимание.
            </p>
          </div>

          <div className="eb-beat eb-at-left eb-handle-copy" data-beat="37.9 40.6">
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

          <div className="eb-beat eb-at-right eb-handle-copy" data-beat="40.8 42.4">
            <p className="eb-eyebrow" data-line>
              Крупно
            </p>
            <h3 className="eb-h3" data-line>
              Герб Engelberg на рычаге
            </h3>
            <p className="eb-p" data-line>
              Деталь, определяющая характер окна.
            </p>
          </div>

          <div className="eb-beat eb-at-top" data-beat="42.2 43.8">
            <p className="eb-eyebrow" data-line>
              Шесть финишей
            </p>
            <h3 className="eb-h3" data-line>
              Под раму, интерьер и руку
            </h3>
          </div>

          <div className="eb-beat eb-at-left-bottom eb-quiet" data-beat="44.4 47">
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
              Снаружи — зима. Внутри — тишина
            </h2>
            <p className="eb-p" data-line>
              Thermo 90 снижает уровень шума на 43 дБ: комфорт даже рядом с оживлённой трассой.
            </p>
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="47.2 49">
            <p className="eb-display eb-display-s" data-line>
              Тепло остаётся внутри даже в суровом климате
            </p>
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="49.4 52.2">
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

          <div className="eb-beat eb-at-right eb-panel" data-beat="52.2 55.2">
            <p className="eb-eyebrow" data-line>
              {bkh65.name} · характеристики
            </p>
            <div className="eb-slide-demo" data-line aria-hidden="true">
              <span className="eb-slide-fixed" />
              <span className="eb-slide-move" />
            </div>
            <div className="eb-big" data-line>
              <div>
                <b>{bkh65.headline.value}</b>
                <span>{bkh65.headline.label}</span>
              </div>
            </div>
            <Specs items={bkh65.specs} />
          </div>

          <div className="eb-beat eb-at-left-bottom" data-beat="55.8 58.8">
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

          <div className="eb-beat eb-at-left eb-panel" data-beat="59 61.6">
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

          <div className="eb-beat eb-at-top eb-ink" data-beat="62.2 65">
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

          <div className="eb-beat eb-at-top eb-ink" data-beat="65.4 71">
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

          {/* ---------------- Приборы ---------------- */}
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

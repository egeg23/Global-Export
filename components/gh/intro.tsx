"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Заставка Golden House: из темноты — в их квартал.
 *
 * Сценарий один кадр в кадр: знак проявляется из черноты, камера идёт в
 * просвет знака, за ним открывается настоящая Земля — мозаика NASA,
 * повёрнутая Узбекистаном к зрителю, — снижение к Ташкенту, и дальше их
 * собственная аэросъёмка района, из которой и вырастает первый экран.
 *
 * Почему не CSS-анимация. Ключевые кадры нельзя перемотать, остановить на
 * произвольном месте и согласовать между шестью слоями так, чтобы слой с
 * глобусом знал, что делает слой со знаком. Здесь один requestAnimationFrame
 * считает время и раскладывает его по переменным узла — React при этом не
 * перерисовывается ни разу за все семь секунд.
 *
 * Показывается один раз за вкладку: заказчик будет ходить по макету, и кино
 * на каждый переход быстро надоест. Кнопка «Заставка» на первом экране
 * заводит её заново.
 */

const TOTAL = 7000;

/** Сцены: от, до, и что в них происходит — для чтения, не для кода. */
const SCENES = [
  [0, 1150, "знак проявляется из черноты"],
  [1150, 2250, "камера трогается, проступают звёзды"],
  [2250, 3650, "знак проходит мимо, открывается планета"],
  [3650, 5050, "снижение, прицел и координаты"],
  [5050, 6250, "поверхность расплывается, открывается квартал"],
  [6250, 7000, "аэросъёмка уходит, остаётся первый экран"],
] as const;

/** Линейная доля внутри отрезка: 0 до начала, 1 после конца. */
const span = (t: number, from: number, to: number) =>
  Math.min(Math.max((t - from) / (to - from), 0), 1);

/** Плавный вход и выход — без него камера трогается рывком. */
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

/** Разгон: к концу сцены камера идёт быстрее, чем в начале. */
const accel = (x: number) => x * x;

/* ------------------------------------------------------------------ */
/* Общее состояние                                                     */
/* ------------------------------------------------------------------ */

/**
 * Идёт ли кино и отыграно ли оно — состояние не компонента, а страницы:
 * первый экран должен знать, когда ему выезжать, а кнопка «Смотреть
 * заставку» живёт в другом поддереве. Поэтому не useState, а внешнее
 * хранилище: подписка снаружи React, без каскада перерисовок из эффекта.
 */
let live = false;
let played = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function announce() {
  for (const listener of listeners) listener();
}

/** Заставка отыграна (или пропущена): первому экрану можно выезжать. */
export function useIntroDone(): boolean {
  return useSyncExternalStore(subscribe, () => played, () => false);
}

/** Сцена идёт прямо сейчас. */
function useIntroLive(): boolean {
  return useSyncExternalStore(subscribe, () => live, () => false);
}

function begin() {
  if (live) return;
  live = true;
  announce();
}

/**
 * Первому экрану пора выезжать. Вызывается до конца сцены: пока заставка
 * тает, дом уже идёт слева — иначе между кадрами остаётся полсекунды
 * пустого листа.
 */
function reveal() {
  if (played) return;
  played = true;
  announce();
}

function finish() {
  if (!live && played) return;
  live = false;
  played = true;
  announce();
}

/** Кнопка «Смотреть заставку» на первом экране. */
export function replayIntro() {
  begin();
}

/* ------------------------------------------------------------------ */
/* Сама сцена                                                          */
/* ------------------------------------------------------------------ */

export function Intro() {
  // Первый заход показывает кино; дальше — только по кнопке «Заставка».
  const live = useIntroLive();
  const root = useRef<HTMLDivElement>(null);
  const alt = useRef<HTMLSpanElement>(null);
  const place = useRef<HTMLParagraphElement>(null);

  const skip = useCallback(() => finish(), []);

  useEffect(() => {
    const seen = (() => {
      try {
        return sessionStorage.getItem("gh-intro") === "1";
      } catch {
        return false;
      }
    })();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || calm) {
      finish();
      return;
    }
    begin();
  }, []);

  useEffect(() => {
    if (!live) return;
    const node = root.current;
    if (!node) return;

    const set = (name: string, value: number | string) =>
      node.style.setProperty(name, typeof value === "number" ? value.toFixed(4) : value);

    let frame = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const t = now - start;

      // Знак: проявляется, потом уходит мимо камеры.
      const born = ease(span(t, 120, 1150));
      const pass = accel(span(t, 1150, 3500));
      set("--gh-logo", born * (1 - span(t, 2900, 3550)));
      set("--gh-logo-s", 0.86 + born * 0.14 + pass * 30);
      set("--gh-flare", born * (1 - span(t, 1600, 2600)));
      set("--gh-flare-s", 0.55 + born * 0.45 + pass * 1.2);

      // Темнота не отступает: это и есть космос. За планетой должна быть
      // чернота, а не страница, которая лежит под заставкой, — поэтому фон
      // гаснет не раньше, чем кадр целиком занят аэросъёмкой.
      set("--gh-void", 1 - span(t, 6050, 6500));
      const stars = span(t, 1250, 2600);
      set("--gh-stars", stars * (1 - span(t, 4600, 5600)));
      set("--gh-stars-s", 1 + accel(span(t, 1250, 5200)) * 1.7);

      // Планета: приходит из-за знака и растёт до самого кадра.
      const globe = span(t, 2250, 3350);
      const approach = accel(span(t, 3650, 6100));
      set("--gh-globe", globe * (1 - span(t, 5650, 6150)));
      set("--gh-globe-s", 0.34 + ease(globe) * 0.5 + approach * 4.2);
      set("--gh-globe-blur", accel(span(t, 5000, 6100)) * 22);

      // Прицел и цифры снижения.
      const hud = span(t, 3700, 4200) * (1 - span(t, 6000, 6450));
      set("--gh-hud", hud);
      set("--gh-cross-s", 1 - span(t, 3700, 6000) * 0.42);

      // Их собственная аэросъёмка: квартал, куда мы всё это время летели.
      const land = span(t, 5150, 6100);
      set("--gh-aerial", land * (1 - span(t, 6400, 7000)));
      set("--gh-aerial-s", 1.32 - ease(land) * 0.32 + span(t, 6100, 7000) * 0.06);
      set("--gh-aerial-blur", (1 - ease(land)) * 16);

      // Вся сцена уводится в прозрачность — под ней уже стоит первый экран.
      set("--gh-veil", 1 - span(t, 6500, TOTAL));
      if (t > 6250) reveal();

      // Высота: от орбиты до крыши. Считается из тех же долей, что и камера.
      const km = 6400 - accel(span(t, 3650, 6100)) * 6399.8;
      if (alt.current) {
        alt.current.textContent =
          km >= 10 ? `${Math.round(km)} км` : km >= 1 ? `${km.toFixed(1)} км` : `${Math.round(km * 1000)} м`;
      }
      // Подпись сужается вместе с кадром: страна, город, улица.
      if (place.current) {
        const label = km > 1200 ? "Узбекистан" : km > 60 ? "Узбекистан · Ташкент" : "Ташкент · 5-й проезд Садыка Азимова";
        if (place.current.textContent !== label) place.current.textContent = label;
      }

      if (t < TOTAL) {
        frame = requestAnimationFrame(draw);
        return;
      }
      finish();
    };

    frame = requestAnimationFrame(draw);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    // Прокрутка во время кино означает «мне не до кино».
    window.addEventListener("wheel", skip, { passive: true, once: true });
    window.addEventListener("touchstart", skip, { passive: true, once: true });

    try {
      sessionStorage.setItem("gh-intro", "1");
    } catch {
      // Приватная вкладка: тогда кино просто покажется ещё раз.
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, [live, skip]);

  // Пока кино идёт, страница под ним стоит на месте.
  useEffect(() => {
    if (!live) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [live]);

  if (!live) return null;

  return (
    <div ref={root} className="gh-intro" data-testid="gh-intro">
      <div aria-hidden>
        <div className="gh-intro__void" />
        <div className="gh-intro__stars" />
        <div className="gh-intro__flare" />

        <div className="gh-intro__globe">
          {/* Настоящая съёмка NASA, а не рисунок: см. content/gh/photos.ts. */}
          <Image src="/images/gh/globe.webp" alt="" fill sizes="90vmin" priority />
        </div>

        <div className="gh-intro__hud">
          <div className="gh-intro__cross" />
          <div className="absolute bottom-[clamp(1.5rem,6vh,3.5rem)] left-[clamp(1.25rem,5vw,3rem)]">
            <p ref={place} className="text-[0.62rem] uppercase tracking-[0.42em] text-[#e6c391]">
              Узбекистан
            </p>
            <p className="mt-2 text-[0.72rem] tracking-[0.14em] text-[#e6c391]/75">
              41°17′49″ с.ш. · 69°18′32″ в.д.
            </p>
            <p className="mt-1 text-[0.72rem] tracking-[0.14em] text-[#e6c391]/75">
              высота <span ref={alt}>6400 км</span>
            </p>
          </div>
        </div>

        <div className="gh-intro__aerial">
          <Image src="/images/gh/aerial.webp" alt="" fill sizes="100vw" priority />
        </div>

        <div className="gh-intro__logo">
          <Image
            src="/images/gh/logo-light.svg"
            alt=""
            width={469}
            height={57}
            priority
            className="h-auto w-full"
          />
        </div>
      </div>

      <button type="button" className="gh-intro__skip" onClick={skip}>
        Пропустить
      </button>
    </div>
  );
}

/** Отрезки сцены — читает проверка, чтобы не выписывать числа второй раз. */
export const introScenes = SCENES;
export const introDuration = TOTAL;

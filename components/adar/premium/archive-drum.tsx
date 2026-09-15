"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

import { Shell } from "@/components/adar/ui/shell";
import { ZodiacMark } from "@/components/adar/ui/zodiac-mark";
import { archiveSeasonsList, seasons } from "@/content/adar/archive";
import { cn } from "@/lib/cn";

/**
 * Угол между гранями. Сорок градусов, а не 360 на число сезонов: при мелком
 * шаге соседние грани почти не наклоняются и барабан читается стопкой
 * карточек. Дальние грани всё равно не видны, поэтому то, что окружность
 * при девятнадцати сезонах проходится дважды, значения не имеет.
 */
const STEP = 40;
/** Дальше этого угла грань не показываем — и не считаем. */
const VISIBLE = 2;
/** Сколько барабан держит год, пока крутится сам. */
const HOLD = 2600;

/**
 * Барабан архива.
 *
 * Компания работает с 2008 года, и каждый сезон у неё был свой: свой символ
 * года на новогодней коробке, своё 8 марта, свои детские наборы. Здесь эти
 * сезоны стоят гранями барабана — он открывается на первом и сам идёт по
 * годам до нынешнего, пока его не перехватят рукой.
 *
 * Вся геометрия в трёхмерных преобразованиях: браузер отдаёт их
 * видеокарте, поэтому барабан одинаково гладко идёт и на телефоне, и на
 * большом экране, а угол ведёт одна пружина на всех.
 */
export function ArchiveDrum() {
  const frame = useRef<HTMLElement>(null);
  const rail = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [running, setRunning] = useState(false);

  // Сырой угол ведёт палец, пружина сглаживает — за счёт этого барабан
  // догоняет руку, а не прыгает за ней.
  const raw = useMotionValue(0);
  const turn = useSpring(raw, { stiffness: 64, damping: 19, mass: 0.7, restDelta: 0.01 });
  const rotate = useTransform(turn, (value) => -value);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.min(seasons.length - 1, Math.max(0, next));
      setIndex(clamped);
      raw.set(clamped * STEP);
    },
    [raw],
  );

  // Барабан заводится, когда доезжает до экрана, и останавливается, когда
  // уезжает: крутить его за кадром незачем.
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const watcher = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting && entry.intersectionRatio > 0.35),
      { threshold: [0, 0.35, 0.7] },
    );
    watcher.observe(element);
    return () => watcher.disconnect();
  }, []);

  useEffect(() => {
    if (!running || held || reduced) return;
    if (index >= seasons.length - 1) return;
    const id = window.setTimeout(() => goTo(index + 1), HOLD);
    return () => window.clearTimeout(id);
  }, [goTo, held, index, reduced, running]);

  /**
   * Перетаскивание.
   *
   * Мышью барабан тянут вверх-вниз — так, как он и крутится. Пальцем —
   * вбок: вертикаль на телефоне принадлежит странице, и если забрать её
   * себе, барабан во весь экран просто перестанет пропускать прокрутку
   * дальше по сайту.
   */
  const drag = useRef<{ x: number; y: number; from: number; touch: boolean } | null>(null);

  const onDown = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      from: raw.get(),
      touch: event.pointerType === "touch",
    };
    setHeld(true);
  };
  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    const shift = start.touch
      ? (start.x - event.clientX) * 0.3
      : (start.y - event.clientY) * 0.22;
    raw.set(Math.min((seasons.length - 1) * STEP, Math.max(0, start.from + shift)));
  };
  const onUp = () => {
    if (drag.current) {
      drag.current = null;
      goTo(Math.round(raw.get() / STEP));
    }
    setHeld(false);
  };

  // Активный год подводится в видимую часть линейки: иначе на узком экране
  // барабан крутится, а линейка стоит на 2008.
  useEffect(() => {
    const list = rail.current;
    const chip = list?.children[index] as HTMLElement | undefined;
    if (!list || !chip) return;
    // Считаем по видимым рамкам, а не по offsetLeft: он меряется от
    // ближайшего позиционированного предка, а не от самой линейки.
    const here = chip.getBoundingClientRect();
    const box = list.getBoundingClientRect();
    const left = list.scrollLeft + (here.left - box.left) - box.width / 2 + here.width / 2;
    list.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [index, reduced]);

  const season = seasons[index];

  return (
    <section
      id="arhiv"
      ref={frame}
      aria-roledescription="барабан"
      aria-label="Архив сезонов"
      className="relative overflow-hidden border-y border-white/8 bg-adar-green-950 py-20 lg:py-28"
    >
      <div aria-hidden="true" className="adar-glow pointer-events-none absolute inset-x-0 top-0 h-[60vh]" />

      <Shell size="wide" className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-adar-gold-300">
            Архив
          </p>
          <h2 className="mt-5 text-balance font-adar-display text-[2.2rem] leading-[1.05] text-adar-cream-50 sm:text-5xl">
            Каждый сезон — <span className="adar-gold-text">своя упаковка</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-adar-cream-50/75">
            С 2008 года — символ года на новогодней коробке, свои линейки к 8 марта, к утренникам
            и к Дню защитника. Крутите барабан: от первого сезона к нынешнему.
          </p>
          <p className="mt-6 text-sm text-adar-cream-50/60">{archiveSeasonsList.join(" · ")}</p>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div
            className="adar-drum relative select-none"
            onPointerEnter={() => setHeld(true)}
            onPointerLeave={() => {
              onUp();
              setHeld(false);
            }}
            onFocusCapture={() => setHeld(true)}
            onBlurCapture={() => setHeld(false)}
          >
            <div
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onTouchStart={() => setHeld(true)}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  goTo(index - 1);
                }
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                  event.preventDefault();
                  goTo(index + 1);
                }
              }}
              role="group"
              aria-label={`Сезон ${season.year}. Стрелками — соседние сезоны`}
              tabIndex={0}
              // Окно чуть выше грани: соседние сезоны видно, но за края они
              // не вылезают. touch-pan-y оставляет вертикальную прокрутку
              // странице — пальцем барабан листают вбок.
              className="relative mx-auto h-[calc(var(--adar-card)*1.62)] w-[min(88vw,32rem)] cursor-grab touch-pan-y overflow-hidden outline-none ring-adar-gold-500/60 focus-visible:ring-2 active:cursor-grabbing"
              style={{ perspective: "1500px" }}
            >
              <div
                className="absolute inset-x-0 top-1/2 h-[var(--adar-card)] -translate-y-1/2"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(calc(var(--adar-radius) * -1))",
                }}
              >
                <motion.ul
                  style={
                    reduced
                      ? { transformStyle: "preserve-3d" }
                      : { rotateX: rotate, transformStyle: "preserve-3d" }
                  }
                  className="h-full w-full"
                >
                  {seasons.map((item, order) => (
                    <Face key={item.year} item={item} order={order} index={index} reduced={!!reduced} />
                  ))}
                </motion.ul>
              </div>
            </div>

            {/* Грани должны уходить в тень, а не обрываться по краю окна */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-adar-green-950 via-adar-green-950/75 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-adar-green-950 via-adar-green-950/75 to-transparent"
            />
          </div>

          <div className="mt-6 flex min-w-0 items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 text-adar-cream-50 transition-colors hover:border-adar-gold-500 hover:text-adar-gold-300 disabled:cursor-default disabled:opacity-35"
            >
              <span className="sr-only">Предыдущий сезон</span>
              <span aria-hidden="true">↑</span>
            </button>

            {/* Линейка годов: по ней и видно, что это ретроспектива */}
            <ol ref={rail} className="flex min-w-0 flex-1 gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {seasons.map((item, order) => (
                <li key={item.year}>
                  <button
                    type="button"
                    onClick={() => goTo(order)}
                    aria-current={order === index}
                    className={cn(
                      "cursor-pointer rounded-full px-2.5 py-1.5 text-xs tabular-nums transition-colors",
                      order === index
                        ? "bg-adar-gold-500 text-adar-green-950"
                        : "text-adar-cream-50/60 hover:bg-white/5 hover:text-adar-cream-50",
                    )}
                  >
                    {item.year}
                  </button>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === seasons.length - 1}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 text-adar-cream-50 transition-colors hover:border-adar-gold-500 hover:text-adar-gold-300 disabled:cursor-default disabled:opacity-35"
            >
              <span className="sr-only">Следующий сезон</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-adar-cream-50/55">
            <span className="lg:hidden">Листайте вбок или выберите год</span>
            <span className="hidden lg:inline">
              Тяните барабан, листайте стрелками или выберите год
            </span>
          </p>

          <p aria-live="polite" className="sr-only">
            Сезон {season.year}, год {season.zodiac}. {season.note ?? ""}
          </p>
        </div>
      </Shell>
    </section>
  );
}

/** Одна грань барабана — обложка каталога за сезон. */
function Face({
  item,
  order,
  index,
  reduced,
}: {
  item: (typeof seasons)[number];
  order: number;
  index: number;
  reduced: boolean;
}) {
  const away = Math.abs(order - index);
  const near = away <= VISIBLE;
  const current = order === index;

  return (
    <li
      aria-hidden={near ? undefined : "true"}
      className={cn(
        "absolute inset-0",
        reduced ? "" : "transition-opacity duration-500",
        near ? "opacity-100" : "opacity-0",
      )}
      style={{
        transformStyle: "preserve-3d",
        transform: `rotateX(${order * STEP}deg) translateZ(var(--adar-radius))`,
        // Дальние грани не перехватывают нажатия и не считаются.
        visibility: near ? "visible" : "hidden",
      }}
    >
      <article
        className={cn(
          "relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-adar-lg border px-6 py-7 text-center transition-colors duration-500 sm:px-10",
          current
            ? "border-adar-gold-500/45 bg-adar-green-900"
            : "border-white/10 bg-adar-green-900/60",
        )}
      >
        {item.cover ? (
          <>
            <Image
              src={item.cover}
              alt={`Каталог ADAR, сезон ${item.year}`}
              fill
              sizes="(max-width: 640px) 88vw, 34rem"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-adar-green-950 via-adar-green-950/55 to-adar-green-950/20"
            />
          </>
        ) : null}

        {/* Внутренняя рамка — как тиснение на обложке каталога */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-adar border border-adar-gold-500/20 sm:inset-4"
        />

        {/* Знак года — то, подо что и делалась упаковка сезона */}
        <ZodiacMark sign={item.sign} className="relative w-16 text-adar-gold-300 sm:w-20" />

        <p className="relative mt-3 text-[0.6rem] uppercase tracking-[0.35em] text-adar-gold-300">
          Каталог сезона
        </p>
        <p className="relative mt-1 font-adar-display text-[3.2rem] leading-none text-adar-cream-50 tabular-nums sm:text-6xl">
          {item.year}
        </p>
        <p className="relative mt-1 text-xs uppercase tracking-[0.25em] text-adar-cream-50/70">
          год {item.zodiac}
        </p>

        {/* Знак компании — едва заметным тиснением в углу обложки */}
        <span
          aria-hidden="true"
          className="adar-logo-mark pointer-events-none absolute -bottom-[10%] -right-[6%] w-[26%] opacity-[0.05]"
        />

        {item.note ? (
          <p className="relative mt-5 max-w-sm border-t border-adar-gold-500/25 pt-4 text-sm leading-relaxed text-adar-cream-50/80">
            {item.note}
          </p>
        ) : null}
      </article>
    </li>
  );
}

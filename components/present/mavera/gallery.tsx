"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

import { Screen } from "./screens";
import { directions, screens, type DirectionId, type ScreenId } from "./theme";

type Device = "desktop" | "mobile";

/** Переменные палитры отдаются как обычный инлайновый стиль. */
function paletteOf(id: DirectionId): React.CSSProperties {
  const found = directions.find((direction) => direction.id === id) ?? directions[0];
  return found.vars as React.CSSProperties;
}

/**
 * Указатель двигает слои: рамка слегка поворачивается, а силуэты внутри неё
 * разъезжаются по глубине. Значения пишутся прямо в CSS-переменные узла, без
 * состояния React — перерисовка на каждый кадр мыши обошлась бы дороже
 * самого эффекта.
 */
function usePointerParallax(enabled: boolean) {
  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled || event.pointerType !== "mouse") return;
      const node = event.currentTarget;
      const box = node.getBoundingClientRect();
      node.style.setProperty("--mv-mx", ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
      node.style.setProperty("--mv-my", ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
    },
    [enabled],
  );

  const onPointerLeave = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const node = event.currentTarget;
    node.style.setProperty("--mv-mx", "0");
    node.style.setProperty("--mv-my", "0");
  }, []);

  return { onPointerMove, onPointerLeave };
}

/** Рамка браузера: верхняя планка с адресом и обрезанный по ней экран. */
function BrowserFrame({
  path,
  children,
  className,
  bodyClassName,
  style,
}: {
  path: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "overflow-hidden rounded-xl border border-sand-50/12 bg-forest-900 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-sand-50/10 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-sand-50/20" />
          <span className="h-2 w-2 rounded-full bg-sand-50/20" />
          <span className="h-2 w-2 rounded-full bg-sand-50/20" />
        </span>
        <span className="mx-auto max-w-[70%] truncate rounded-full bg-sand-50/8 px-3 py-0.5 text-[0.62rem] text-sand-300/60">
          {path}
        </span>
      </div>
      <div className={cn("[container-type:inline-size]", bodyClassName)}>{children}</div>
    </div>
  );
}

/** Телефон — для показа адаптивности (пункт 9 брифа). */
function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border-[6px] border-forest-900 bg-forest-900 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-sand-50/20"
      />
      <div className="h-full [container-type:inline-size]">{children}</div>
    </div>
  );
}

export function MaveraGallery() {
  const [direction, setDirection] = useState<DirectionId>("night");
  const [openId, setOpenId] = useState<ScreenId | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [motion, setMotion] = useState(true);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const devicePicked = useRef(false);

  const parallax = usePointerParallax(motion);
  const active = directions.find((entry) => entry.id === direction) ?? directions[0];
  const openIndex = openId ? screens.findIndex((screen) => screen.id === openId) : -1;
  const openScreen = openIndex >= 0 ? screens[openIndex] : null;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotion(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Диалог открывается только из эффекта: показать его на сервере нельзя, а
  // `showModal` даёт бесплатно фокус-ловушку, Esc и затемнение фона.
  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (openScreen && !node.open) node.showModal();
    if (!openScreen && node.open) node.close();
  }, [openScreen]);

  /**
   * На телефоне разворачивать десктопный кадр бессмысленно — он ужимается до
   * нечитаемого, поэтому рамка выбирается по ширине окна. Как только зритель
   * сам тронул переключатель, его выбор больше не перебивается.
   */
  const open = useCallback((id: ScreenId) => {
    if (!devicePicked.current) {
      setDevice(window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop");
    }
    setOpenId(id);
  }, []);

  const chooseDevice = useCallback((next: Device) => {
    devicePicked.current = true;
    setDevice(next);
  }, []);

  const step = useCallback(
    (delta: number) => {
      if (openIndex < 0) return;
      const next = (openIndex + delta + screens.length) % screens.length;
      setOpenId(screens[next].id);
      scrollRef.current?.scrollTo({ top: 0 });
    },
    [openIndex],
  );

  /** Прокрутка внутри развёрнутого макета двигает задний план медленнее переднего. */
  const onScroll = useCallback(() => {
    if (!motion || frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const node = scrollRef.current;
      if (!node) return;
      node.style.setProperty("--mv-p", Math.min(node.scrollTop / 320, 1).toFixed(3));
    });
  }, [motion]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div style={paletteOf(direction)}>
      {/* Тумблер направлений */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Направление оформления"
          className="relative inline-flex w-full max-w-sm rounded-full border border-sand-50/12 bg-forest-900/60 p-1"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-[var(--mv-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${direction === "night" ? "0%" : "100%"})` }}
          />
          {directions.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={direction === entry.id}
              onClick={() => setDirection(entry.id)}
              className={cn(
                "relative z-10 flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300",
                direction === entry.id
                  ? "text-[var(--mv-accent-ink)]"
                  : "text-sand-200/70 hover:text-sand-50",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <p key={active.id} className="mv-fade max-w-md text-sm leading-relaxed text-sand-300/60">
          {active.note}
        </p>
      </div>

      {/* Сетка макетов */}
      <ul className="mt-12 grid gap-8 md:grid-cols-2 xl:gap-10">
        {screens.map((screen, index) => (
          <Reveal as="li" key={screen.id} delay={index * 70}>
            <button
              type="button"
              onClick={() => open(screen.id)}
              onPointerMove={parallax.onPointerMove}
              onPointerLeave={parallax.onPointerLeave}
              aria-haspopup="dialog"
              aria-label={`Развернуть макет: ${screen.title}`}
              className="group block w-full text-left [perspective:1400px]"
            >
              <BrowserFrame
                path={screen.path}
                className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[--mv-lift:-6px] group-focus-visible:[--mv-lift:-6px] motion-reduce:transform-none motion-reduce:transition-none"
                bodyClassName="relative h-64 overflow-hidden sm:h-72"
                style={
                  motion
                    ? {
                        transform:
                          "translate3d(0, var(--mv-lift, 0px), 0) rotateX(calc(var(--mv-my, 0) * -4deg)) rotateY(calc(var(--mv-mx, 0) * 6deg))",
                      }
                    : undefined
                }
              >
                <span aria-hidden="true">
                  <Screen id={screen.id} device="desktop" />
                </span>

                {/* Подсказка появляется поверх макета, а не двигает вёрстку. */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-forest-950/90 to-transparent pb-4 pt-10 text-xs font-medium text-sand-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  Развернуть макет
                </span>
              </BrowserFrame>

              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl text-sand-50">{screen.title}</h3>
                <span className="shrink-0 text-[0.7rem] uppercase tracking-[0.16em] text-harvest-300">
                  {screen.brief}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-sand-300/60">{screen.detail}</p>
            </button>
          </Reveal>
        ))}
      </ul>

      {/* Развёрнутый макет */}
      <dialog
        ref={dialogRef}
        onClose={() => setOpenId(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpenId(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        className="mv-dialog m-auto w-[min(100vw-1.5rem,1180px)] max-w-none bg-transparent p-0 text-sand-50 backdrop:bg-forest-950/85 backdrop:backdrop-blur-sm"
      >
        {openScreen ? (
          <div className="flex max-h-[92svh] flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl text-sand-50">{openScreen.title}</h2>
                <p className="mt-1 text-xs text-sand-300/55">
                  {active.label} · {openScreen.brief}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div
                  role="group"
                  aria-label="Устройство"
                  className="flex rounded-full border border-sand-50/12 p-1"
                >
                  {(["desktop", "mobile"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={device === item}
                      onClick={() => chooseDevice(item)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-300",
                        device === item
                          ? "bg-sand-50 text-forest-950"
                          : "text-sand-200/70 hover:text-sand-50",
                      )}
                    >
                      {item === "desktop" ? "Десктоп" : "Телефон"}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Предыдущий макет"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-50/12 text-sand-200 transition-colors hover:bg-sand-50/10"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Следующий макет"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sand-50/12 text-sand-200 transition-colors hover:bg-sand-50/10"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  className="flex h-9 items-center rounded-full border border-sand-50/12 px-4 text-xs font-medium text-sand-200 transition-colors hover:bg-sand-50/10"
                >
                  Закрыть
                </button>
              </div>
            </div>

            {device === "desktop" ? (
              <BrowserFrame path={openScreen.path} bodyClassName="min-h-0">
                <div
                  ref={scrollRef}
                  onScroll={onScroll}
                  onPointerMove={parallax.onPointerMove}
                  onPointerLeave={parallax.onPointerLeave}
                  role="img"
                  aria-label={`Макет страницы «${openScreen.title}» — ${active.label}`}
                  className="max-h-[62svh] overflow-y-auto overscroll-contain sm:max-h-[70svh]"
                >
                  <Screen id={openScreen.id} device="desktop" />
                </div>
              </BrowserFrame>
            ) : (
              <div className="flex justify-center">
                <PhoneFrame className="h-[62svh] w-[17rem] sm:h-[70svh] sm:w-[19rem]">
                  <div
                    ref={scrollRef}
                    onScroll={onScroll}
                    onPointerMove={parallax.onPointerMove}
                    onPointerLeave={parallax.onPointerLeave}
                    role="img"
                    aria-label={`Мобильный макет страницы «${openScreen.title}» — ${active.label}`}
                    className="h-full overflow-y-auto overscroll-contain"
                  >
                    <Screen id={openScreen.id} device="mobile" />
                  </div>
                </PhoneFrame>
              </div>
            )}

            <p className="text-xs leading-relaxed text-sand-300/50">
              Листайте макет внутри рамки — фон движется медленнее содержимого, как
              на готовой странице. Стрелки ← → переключают экраны, Esc закрывает.
            </p>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}

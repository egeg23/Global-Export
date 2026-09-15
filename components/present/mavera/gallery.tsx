"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

import { BrowserFrame, PhoneFrame, useMotionAllowed, usePointerParallax } from "./frames";
import { Screen } from "./screens";
import {
  currencies,
  lockedIn,
  moneyParts,
  rateNote,
  screensFor,
  tiers,
  type CurrencyId,
  type ScreenId,
  type TierId,
} from "./theme";

type Device = "desktop" | "mobile";

/** Экраны, где зритель действительно кликает, а не смотрит картинку. */
const interactiveScreens: ScreenId[] = ["genplan", "picker"];

function paletteOf(id: TierId): React.CSSProperties {
  const found = tiers.find((tier) => tier.id === id) ?? tiers[0];
  return found.vars as React.CSSProperties;
}

export function MaveraGallery() {
  const [tierId, setTierId] = useState<TierId>("premium");
  const [openId, setOpenId] = useState<ScreenId | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [currency, setCurrency] = useState<CurrencyId>("usd");
  const motion = useMotionAllowed();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const devicePicked = useRef(false);

  const parallax = usePointerParallax(motion);
  const tier = tiers.find((entry) => entry.id === tierId) ?? tiers[0];
  const visible = screensFor(tierId);
  const locked = lockedIn(tierId);
  const openIndex = openId ? visible.findIndex((screen) => screen.id === openId) : -1;
  const openScreen = openIndex >= 0 ? visible[openIndex] : null;
  const live = openScreen ? interactiveScreens.includes(openScreen.id) : false;

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

  // Без useCallback: список экранов пересобирается на каждый рендер, и ручная
  // мемоизация только мешала бы компилятору React оптимизировать компонент.
  const step = (delta: number) => {
    if (openIndex < 0) return;
    const next = (openIndex + delta + visible.length) % visible.length;
    setOpenId(visible[next].id);
    scrollRef.current?.scrollTo({ top: 0 });
  };

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
    <div style={paletteOf(tierId)}>
      {/* Тумблер пакетов и валюта */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="group"
        aria-label="Вариант сайта"
        className="relative flex w-full max-w-xl rounded-full border border-sand-50/12 bg-forest-900/60 p-1"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc(33.333%-0.1667rem)] rounded-full bg-[var(--mv-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(${tiers.findIndex((e) => e.id === tierId) * 100}%)` }}
        />
        {tiers.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={tierId === entry.id}
            onClick={() => setTierId(entry.id)}
            className={cn(
              "relative z-10 flex-1 rounded-full px-3 py-2.5 text-sm font-medium transition-colors duration-300",
              tierId === entry.id
                ? "text-[var(--mv-accent-ink)]"
                : "text-sand-200/70 hover:text-sand-50",
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

        {/* Валюта: цены хранятся в долларах, остальное — пересчёт по курсу. */}
        <div
          role="group"
          aria-label="Валюта"
          className="flex shrink-0 self-start rounded-full border border-sand-50/12 p-1"
        >
          {currencies.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={currency === entry.id}
              aria-label={entry.name}
              onClick={() => setCurrency(entry.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300",
                currency === entry.id
                  ? "bg-sand-50 text-forest-950"
                  : "text-sand-200/70 hover:text-sand-50",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      {/* Смета выбранного варианта */}
      <div
        key={tier.id}
        className="mv-fade mt-6 grid gap-8 rounded-card border border-sand-50/12 p-6 sm:p-8 lg:grid-cols-12 lg:gap-12"
      >
        <div className="lg:col-span-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--mv-accent)]">
            {tier.mood}
          </p>
          {/* Цифра — акцидентным шрифтом, единица — обычным: «175 МЛН СУМ»
              в Playfair читается хуже, чем цифра с подписью рядом. */}
          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl leading-none text-sand-50">
              {moneyParts(tier.priceUsd, currency).value}
            </span>
            <span className="text-base text-sand-200/70">
              {moneyParts(tier.priceUsd, currency).unit}
            </span>
          </p>
          <p className="mt-3 text-sm text-sand-300/60">
            {tier.duration} · {tier.hours}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-sand-200/75">{tier.note}</p>
        </div>

        <ul className="space-y-2.5 lg:col-span-7">
          {tier.includes.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-sand-200/75">
              <span aria-hidden="true" className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-[var(--mv-accent)]" />
              {item}
            </li>
          ))}
          <li className="pt-2 text-xs leading-relaxed text-sand-300/45">
            Цены без допников: перевод носителями, CRM, 3D-тур и поддержка считаются
            отдельно.
            {currency === "usd" ? null : <> Договор всё равно считается в долларах. {rateNote}.</>}
          </li>
        </ul>
      </div>

      {/* Сетка макетов */}
      <ul className="mt-12 grid gap-8 md:grid-cols-2 xl:gap-10">
        {visible.map((screen, index) => (
          <Reveal as="li" key={screen.id} delay={index * 60}>
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
                  <Screen id={screen.id} device="desktop" tier={tierId} currency={currency} />
                </span>

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

      {/* Чего в этом пакете нет — сразу с переходом туда, где есть. */}
      {locked.length > 0 ? (
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {locked.map((screen) => (
            <li key={screen.id}>
              <button
                type="button"
                onClick={() => {
                  setTierId("premium");
                  open(screen.id);
                }}
                className="group flex w-full items-center justify-between gap-4 rounded-card border border-dashed border-sand-50/18 px-5 py-4 text-left transition-colors hover:border-harvest-300/60 hover:bg-sand-50/4"
              >
                <span>
                  <span className="block font-display text-lg text-sand-50">{screen.title}</span>
                  <span className="mt-1 block text-xs text-sand-300/55">
                    Есть только в «Премиуме» — посмотреть
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-harvest-300 transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

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
                  {tier.label} · {openScreen.brief}
                  {live ? " · экран работает: попробуйте кликнуть" : ""}
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
                  {...(live
                    ? { role: "group", "aria-label": `Рабочий макет: ${openScreen.title}` }
                    : { role: "img", "aria-label": `Макет страницы «${openScreen.title}»` })}
                  className="max-h-[62svh] overflow-y-auto overscroll-contain sm:max-h-[70svh]"
                >
                  <Screen id={openScreen.id} device="desktop" tier={tierId} currency={currency} live={live} />
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
                    {...(live
                      ? { role: "group", "aria-label": `Рабочий макет: ${openScreen.title}` }
                      : { role: "img", "aria-label": `Мобильный макет: ${openScreen.title}` })}
                    className="h-full overflow-y-auto overscroll-contain"
                  >
                    <Screen id={openScreen.id} device="mobile" tier={tierId} currency={currency} live={live} />
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

"use client";

import { useEffect, useRef, useState } from "react";

import { Addon } from "@/components/configurator/context";
import { Icon } from "@/components/webname/icons";
import { In, reducedMotion, useOnScreen } from "@/components/webname/motion";
import { maintenance } from "@/content/webname/facts";
import { cn } from "@/lib/cn";

const TASHKENT: [number, number] = [41.31, 69.28];

/** Зоны и города, куда тянутся дуги из Ташкента. */
const ROUTES: { zone: string; city: string; at: [number, number] }[] = [
  { zone: ".com", city: "Нью-Йорк", at: [40.71, -74.0] },
  { zone: ".de", city: "Франкфурт", at: [50.11, 8.68] },
  { zone: ".kz", city: "Алматы", at: [43.24, 76.89] },
  { zone: ".ae", city: "Дубай", at: [25.2, 55.27] },
  { zone: ".tr", city: "Стамбул", at: [41.01, 28.98] },
  { zone: ".kr", city: "Сеул", at: [37.57, 126.98] },
  { zone: ".uk", city: "Лондон", at: [51.51, -0.13] },
  { zone: ".in", city: "Дели", at: [28.61, 77.21] },
];

/**
 * Глобус зон — cobe (MIT, WebGL, ~5 КБ). Из Ташкента расходятся дуги к
 * зонам, которые Arsenal D регистрирует кроме .UZ («более 1000 зон» — их
 * слова). Крутится, только пока виден; при «уменьшить движение» стоит;
 * пальцем его можно повернуть. Библиотека грузится отдельным куском, когда
 * блок подъезжает к экрану.
 */
function Globe({ premium = false }: { premium?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [wrap, visible] = useOnScreen<HTMLDivElement>("200px");
  const drag = useRef<{ x: number; phi: number } | null>(null);
  const phi = useRef(4.3);

  useEffect(() => {
    const node = canvas.current;
    if (!node || !visible) return;
    let frame = 0;
    let destroyed = false;
    let globe: { update: (state: { phi?: number; width?: number; height?: number }) => void; destroy: () => void } | null = null;
    const still = reducedMotion();

    void import("cobe").then(({ default: createGlobe }) => {
      if (destroyed) return;
      const size = node.offsetWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      globe = createGlobe(node, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi: phi.current,
        theta: 0.55,
        dark: 1,
        diffuse: 1.4,
        mapSamples: size < 400 ? 9000 : 16000,
        mapBrightness: 5,
        baseColor: premium ? [0.2, 0.17, 0.27] : [0.16, 0.22, 0.52],
        markerColor: premium ? [0.95, 0.82, 0.58] : [1, 0.79, 0.3],
        glowColor: premium ? [0.55, 0.22, 0.32] : [0.27, 0.36, 0.78],
        markers: [{ location: TASHKENT, size: 0.09, color: [0.85, 0.2, 0.15] }, ...ROUTES.map((route) => ({ location: route.at, size: 0.035 }))],
        arcs: ROUTES.map((route) => ({ from: TASHKENT, to: route.at })),
        arcColor: premium ? [1, 0.55, 0.6] : [0.44, 0.82, 1],
        arcWidth: 0.6,
        arcHeight: 0.28,
      });
      node.style.opacity = "1";
      if (still) return;
      const step = () => {
        if (!drag.current) phi.current += 0.0035;
        globe?.update({ phi: phi.current });
        frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    });

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(frame);
      globe?.destroy();
    };
  }, [visible, premium]);

  return (
    <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <canvas
        ref={canvas}
        aria-label="Глобус: из Ташкента дуги к доменным зонам мира"
        role="img"
        className="h-full w-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-700 active:cursor-grabbing"
        onPointerDown={(event) => {
          drag.current = { x: event.clientX, phi: phi.current };
        }}
        onPointerMove={(event) => {
          if (drag.current) phi.current = drag.current.phi + (event.clientX - drag.current.x) / 180;
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
      />
    </div>
  );
}

export function Pulse({ premium = false }: { premium?: boolean }) {
  return (
    <section id="pulse" className="wn-dark scroll-mt-20 overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-5">
          <In variant="slide">
            <h2 className="wn-display text-4xl sm:text-5xl">Из Ташкента — в любую зону</h2>
            <p className="wn-muted mt-4 max-w-md">
              Кроме .UZ Arsenal D регистрирует домены в 1000 с лишним зонах — .com, .kz, .ae, .de и дальше. Счёт и договор — в сумах, поддержка — по-русски и по-узбекски.
            </p>
          </In>
          <ul className="mt-8 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:grid-cols-2">
            {ROUTES.slice(0, 8).map((route, index) => (
              <In key={route.zone} as="li" variant="stamp" index={index}>
                <span className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
                  <b className="wn-mono text-wn-amber">{route.zone}</b>
                  <span className="wn-muted truncate">{route.city}</span>
                </span>
              </In>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <Globe premium={premium} />
        </div>
      </div>
      <Addon id="status" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:pb-24">
        <Status />
      </Addon>
    </section>
  );
}

const SERVICES = [
  { id: "dns", name: "DNS .UZ", note: "ns-серверы" },
  { id: "web", name: "Хостинг web1–web3", note: "webspace.uz" },
  { id: "vds", name: "VDS / VPS", note: "виртуальные серверы" },
  { id: "mail", name: "Почта", note: "IMAP / SMTP" },
  { id: "panel", name: "Кабинет webname.uz", note: "вход и оплата" },
];

/**
 * Доп «Статус серверов»: пульс сервисов и плановые работы. Время ответа —
 * демо-кривая, график работ — настоящий, из их новостей за 2026 год.
 */
function Status() {
  const [tick, setTick] = useState(0);
  const [wrap, visible] = useOnScreen<HTMLDivElement>("0px");

  useEffect(() => {
    if (!visible || reducedMotion()) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 1500);
    return () => window.clearInterval(timer);
  }, [visible]);

  return (
    <div ref={wrap} className="grid gap-4 lg:grid-cols-12">
      <div className="wn-card p-5 sm:p-7 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="wn-display text-2xl">Статус сервисов</h3>
          <span className="wn-muted text-xs">время ответа — демо</span>
        </div>
        <ul className="mt-5 space-y-3">
          {SERVICES.map((service, index) => {
            const bars = Array.from({ length: 24 }, (_, at) => {
              const seed = Math.sin((at + tick + index * 7) * 1.7) * 0.5 + 0.5;
              return 0.25 + seed * 0.75;
            });
            return (
              <li key={service.id} className="flex items-center gap-3">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="wn-pulse absolute inset-0 rounded-full bg-[#3ce39a]" />
                  <span className="relative h-3 w-3 rounded-full bg-[#3ce39a]" />
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-sm">{service.name}</b>
                  <span className="wn-muted block truncate text-xs">{service.note}</span>
                </span>
                <span aria-hidden="true" className="hidden h-8 items-end gap-[2px] sm:flex">
                  {bars.map((value, at) => (
                    <span
                      key={at}
                      className="h-8 w-1.5 origin-bottom rounded-sm bg-wn-sky-bright/70 transition-transform duration-700"
                      style={{ transform: `scaleY(${value.toFixed(2)})` }}
                    />
                  ))}
                </span>
                <span className="wn-mono shrink-0 text-xs text-[#3ce39a]">работает</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="wn-card p-5 sm:p-7 lg:col-span-5">
        <h3 className="wn-display text-2xl">Плановые работы</h3>
        <ul className="mt-5 space-y-3 text-sm">
          {maintenance.map((item, index) => (
            <li key={item.date} className={cn("flex gap-3 border-b border-dashed border-white/15 pb-3", index === 0 && "text-wn-amber")}>
              <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <b className="wn-mono">
                  {item.date} · {item.time}
                </b>
                <span className="block text-wn-muted-cobalt">{item.what}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="wn-muted mt-4 text-xs">Даты и время — из новостей webname.uz.</p>
      </div>
    </div>
  );
}

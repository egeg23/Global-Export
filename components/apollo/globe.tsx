"use client";

import { useEffect, useRef } from "react";

import { TASHKENT, type Destination } from "@/content/apollo/site";
import { useCalmMotion } from "@/lib/calm-motion";

/**
 * Глобус — cobe (MIT, WebGL, ~5 КБ): из Ташкента расходятся золотые дуги к
 * направлениям. `lit` — какие направления сейчас подсвечены (бюджет,
 * выбранная страна): у них дуга и крупная точка, остальные гаснут.
 * Библиотека грузится отдельным куском, крутится только на экране.
 */
export function Globe({
  destinations,
  lit,
  focus,
  className,
}: {
  destinations: Destination[];
  lit?: ReadonlySet<string>;
  focus?: [number, number];
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const globe = useRef<{ update: (s: Record<string, unknown>) => void; destroy: () => void } | null>(null);
  const phi = useRef(-1.25);
  const target = useRef<number | null>(null);
  const drag = useRef<{ x: number; phi: number } | null>(null);
  const calm = useCalmMotion();

  const state = () => {
    const on = destinations.filter((d) => !lit || lit.has(d.id));
    return {
      markers: [
        { location: TASHKENT, size: 0.07, color: [0.93, 0.77, 0.25] as [number, number, number] },
        ...destinations.map((d) => ({
          location: d.at,
          size: !lit || lit.has(d.id) ? 0.05 : 0.02,
          color: (!lit || lit.has(d.id) ? [1, 0.95, 0.8] : [0.45, 0.6, 0.56]) as [number, number, number],
        })),
      ],
      arcs: on.map((d) => ({ from: TASHKENT, to: d.at })),
    };
  };

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    let frame = 0;
    let destroyed = false;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(node);

    void import("cobe").then(({ default: createGlobe }) => {
      if (destroyed) return;
      const size = node.offsetWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      globe.current = createGlobe(node, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi: phi.current,
        theta: 0.32,
        dark: 1,
        diffuse: 1.2,
        mapSamples: size < 420 ? 10000 : 18000,
        mapBrightness: 4.2,
        mapBaseBrightness: 0.02,
        baseColor: [0.07, 0.27, 0.24],
        markerColor: [0.93, 0.77, 0.25],
        glowColor: [0.12, 0.42, 0.36],
        arcColor: [0.93, 0.77, 0.25],
        arcWidth: 0.7,
        arcHeight: 0.32,
        markerElevation: 0.02,
        ...state(),
      }) as never;
      node.style.opacity = "1";
      const step = () => {
        frame = window.requestAnimationFrame(step);
        if (!visible) return;
        if (target.current !== null) {
          const diff = target.current - phi.current;
          phi.current += diff * 0.05;
          if (Math.abs(diff) < 0.002) target.current = null;
        } else if (!drag.current && !calm) {
          phi.current += 0.0018;
        }
        globe.current?.update({ phi: phi.current });
      };
      frame = window.requestAnimationFrame(step);
    });

    return () => {
      destroyed = true;
      io.disconnect();
      window.cancelAnimationFrame(frame);
      globe.current?.destroy();
      globe.current = null;
    };
    // Глобус создаётся один раз; подсветку и фокус меняют эффекты ниже.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calm]);

  useEffect(() => {
    globe.current?.update(state());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lit, destinations]);

  useEffect(() => {
    if (!focus) return;
    // Долгота → поворот: точка встаёт к зрителю.
    const want = -((focus[1] * Math.PI) / 180) - Math.PI / 2;
    const turns = Math.round((phi.current - want) / (2 * Math.PI));
    target.current = want + turns * 2 * Math.PI;
  }, [focus]);

  return (
    <div className={className}>
      <canvas
        ref={canvas}
        role="img"
        aria-label="Глобус: из Ташкента дуги к направлениям"
        className="aspect-square h-full w-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-1000 active:cursor-grabbing"
        onPointerDown={(event) => {
          drag.current = { x: event.clientX, phi: phi.current };
          target.current = null;
        }}
        onPointerMove={(event) => {
          if (drag.current) phi.current = drag.current.phi + (event.clientX - drag.current.x) / 200;
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

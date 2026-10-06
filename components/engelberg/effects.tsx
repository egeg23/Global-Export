"use client";

import { useEffect, useRef } from "react";

import { SECTION_BOX } from "./art";

/**
 * Живые слои поверх сцен: потоки воздуха у окна и снег за стеклом.
 *
 * Каждый рисует только пока его сцена на экране: движок выставляет `level`
 * (0 — сцены нет, 1 — сцена целиком), и при нуле цикл кадров засыпает.
 */
export type Live = { level: number };

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, level: number) => void;

/**
 * Холст с циклом кадров. `setup` создаёт частицы и возвращает функцию
 * кадра — частицы живут в её замыкании, а не в состоянии React.
 */
function useCanvasLoop(live: Live, setup: () => Draw) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const draw = setup();
    let raf = 0;
    let prev = performance.now();
    let w = 0;
    let h = 0;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (live.level <= 0.001) return;
      draw(ctx, w, h, dt, live.level);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [live, setup]);

  return ref;
}

/** Повторяемый ряд случайных чисел: частицы одинаковы при каждом показе. */
function random(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* ------------------------------------------------------------------ */
/* Воздух у окна                                                      */
/* ------------------------------------------------------------------ */

/**
 * Координаты — в единицах разреза профиля (SECTION_BOX в art.tsx), холст
 * лежит ровно поверх него.
 *
 * Холодный воздух улицы идёт к стеклу слева, ударяется в него и стекает
 * вниз, не проходя внутрь. Тёплый воздух комнаты описывает спокойную петлю:
 * поднимается, идёт под потолком и опускается вдоль тёплого стекла без
 * рывка — у стекла нет холодного сквозняка.
 */
function coldPath(p: number, lane: number, seed: number): [number, number] {
  const y0 = 90 + lane * 230;
  if (p < 0.6) {
    const k = p / 0.6;
    return [180 + k * 232, y0 + Math.sin(k * 5 + seed) * 8];
  }
  const k = (p - 0.6) / 0.4;
  return [412 - k * 150 - Math.sin(k * 3) * 10, y0 + k * k * (280 - lane * 60)];
}

function warmPath(p: number, lane: number): [number, number] {
  const a = p * Math.PI * 2;
  const rx = 55 + lane * 30;
  const ry = 130 + lane * 60;
  return [705 + Math.cos(a) * rx * 0.9, 265 - Math.sin(a) * ry * 0.95];
}

function airSetup(): Draw {
  const rnd = random(7);
  const motes = Array.from({ length: 150 }, (_, i) => {
    const warm = i % 2 === 0;
    return { p: rnd(), lane: rnd(), speed: warm ? 0.05 + rnd() * 0.03 : 0.12 + rnd() * 0.08, warm, seed: rnd() * 6 };
  });

  return (ctx, w, h, dt, level) => {
    ctx.clearRect(0, 0, w, h);
    const { x: bx, y: by, w: bw, h: bh } = SECTION_BOX;
    const k = Math.min(w / bw, h / bh);
    const ox = (w - bw * k) / 2 - bx * k;
    const oy = (h - bh * k) / 2 - by * k;
    ctx.lineCap = "round";
    for (const m of motes) {
      m.p = (m.p + m.speed * dt) % 1;
      const at = (p: number) => (m.warm ? warmPath(p, m.lane) : coldPath(p, m.lane, m.seed));
      const [x1, y1] = at(m.p);
      const [x0, y0] = at(Math.max(0, m.p - (m.warm ? 0.035 : 0.05)));
      const fade = Math.sin(Math.PI * m.p);
      ctx.strokeStyle = m.warm
        ? `rgba(255, 178, 102, ${0.55 * fade * level})`
        : `rgba(150, 200, 255, ${0.6 * fade * level})`;
      ctx.lineWidth = (m.warm ? 2.2 : 1.6) * k * 1.4;
      ctx.beginPath();
      ctx.moveTo(ox + x0 * k, oy + y0 * k);
      ctx.lineTo(ox + x1 * k, oy + y1 * k);
      ctx.stroke();
    }
  };
}

export function Airflow({ live }: { live: Live }) {
  const ref = useCanvasLoop(live, airSetup);
  return <canvas ref={ref} className="eb-canvas" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Снег за окном                                                      */
/* ------------------------------------------------------------------ */

function snowSetup(): Draw {
  const rnd = random(11);
  const flakes = Array.from({ length: 220 }, () => {
    const depth = rnd();
    return { x: rnd(), y: rnd(), r: 0.6 + depth * 2.4, v: 0.04 + depth * 0.1, drift: rnd() * 6 };
  });

  return (ctx, w, h, dt, level) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = `rgba(255,255,255,${0.85 * level})`;
    const time = performance.now() / 1000;
    for (const f of flakes) {
      f.y += f.v * dt;
      f.x += (0.02 + Math.sin(time * 0.6 + f.drift) * 0.015) * f.v * dt * 4;
      if (f.y > 1.02) {
        f.y = -0.02;
        f.x = rnd();
      }
      if (f.x > 1.02) f.x = -0.02;
      ctx.beginPath();
      ctx.arc(f.x * w, f.y * h, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };
}

export function Snow({ live }: { live: Live }) {
  const ref = useCanvasLoop(live, snowSetup);
  return <canvas ref={ref} className="eb-canvas" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Воздух у разреза на фотографии (вторая версия)                     */
/* ------------------------------------------------------------------ */

/**
 * Координаты — в долях кадра profile (v2): холст лежит внутри камеры и
 * движется вместе со снимком. На их разрезе петля створки — слева, значит
 * слева дом, справа улица. Стёкла стоят около u 0.49–0.55 и поднимаются от
 * рамы (v 0.62) вверх.
 */
function photoCold(p: number, lane: number, seed: number): [number, number] {
  const v0 = 0.12 + lane * 0.42;
  if (p < 0.58) {
    const k = p / 0.58;
    return [1.02 - k * 0.455, v0 + Math.sin(k * 5 + seed) * 0.012];
  }
  const k = (p - 0.58) / 0.42;
  return [0.565 + k * 0.12 + Math.sin(k * 3) * 0.01, v0 + k * k * (0.6 - v0 * 0.6)];
}

function photoWarm(p: number, lane: number): [number, number] {
  const a = p * Math.PI * 2;
  return [0.3 + Math.cos(a) * (0.08 + lane * 0.05), 0.4 - Math.sin(a) * (0.22 + lane * 0.08)];
}

function photoAirSetup(): Draw {
  const rnd = random(5);
  const motes = Array.from({ length: 170 }, (_, i) => {
    const warm = i % 2 === 0;
    return { p: rnd(), lane: rnd(), speed: warm ? 0.05 + rnd() * 0.03 : 0.11 + rnd() * 0.07, warm, seed: rnd() * 6 };
  });

  return (ctx, w, h, dt, level) => {
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    const lw = Math.max(1.2, w / 1400);
    for (const m of motes) {
      m.p = (m.p + m.speed * dt) % 1;
      const at = (p: number) => (m.warm ? photoWarm(p, m.lane) : photoCold(p, m.lane, m.seed));
      const [x1, y1] = at(m.p);
      const [x0, y0] = at(Math.max(0, m.p - (m.warm ? 0.03 : 0.045)));
      const fade = Math.sin(Math.PI * m.p);
      ctx.strokeStyle = m.warm
        ? `rgba(255, 176, 98, ${0.6 * fade * level})`
        : `rgba(150, 202, 255, ${0.65 * fade * level})`;
      ctx.lineWidth = (m.warm ? 2.2 : 1.7) * lw;
      ctx.beginPath();
      ctx.moveTo(x0 * w, y0 * h);
      ctx.lineTo(x1 * w, y1 * h);
      ctx.stroke();
    }
  };
}

export function PhotoAirflow({ live }: { live: Live }) {
  const ref = useCanvasLoop(live, photoAirSetup);
  return <canvas ref={ref} className="eb-canvas" aria-hidden="true" />;
}

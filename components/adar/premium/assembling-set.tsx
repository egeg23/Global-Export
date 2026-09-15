"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/cn";

/** Сторона плитки в css-пикселях: крупнее — грубее «пиксели», мельче — дороже кадр. */
const TILE = 20;
/** Сколько длится сборка. 1.15 — это 1 плюс запас на волну сверху вниз. */
const BUILD = 1.15;
/** Радиус, на котором курсор ещё разворачивает набор к себе. */
const REACH = 520;

/**
 * Набор на первом экране.
 *
 * Фотография набора вырезана из фона, и поставленная поверх кадра целиком
 * она читается наклейкой. Поэтому набор собирается: плитки поднимаются
 * волной сверху вниз, вырастая из точки, — за полторы секунды из россыпи
 * получается коробка. Дальше он живой: поворачивается за курсором, и вслед
 * за ним ходит золотой ореол, который и связывает его с фоном.
 *
 * Сетка гоняется по кадрам только на время сборки. Как только она
 * закончилась, на канве лежит обычная картинка, и страница больше ничего
 * не считает.
 */
export function AssemblingSet({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  /** Ширина сцены задаётся снаружи: на первом экране она своя. */
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 20, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 20, mass: 0.6 });

  const rotateY = useTransform(smoothX, [-1, 1], [-9, 9]);
  const rotateX = useTransform(smoothY, [-1, 1], [7, -7]);
  const haloX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const haloY = useTransform(smoothY, [-1, 1], [-22, 22]);

  useEffect(() => {
    if (reduced) return;
    const holder = box.current;
    if (!holder) return;

    // Курсор двигается чаще, чем кадры, а замер положения — это чтение
    // раскладки. Поэтому событие только запоминается, а считается один раз
    // в кадр.
    let last: { x: number; y: number } | null = null;
    let frame = 0;

    const measure = () => {
      frame = 0;
      if (!last) return;
      const rect = holder.getBoundingClientRect();
      const dx = (last.x - (rect.left + rect.width / 2)) / REACH;
      const dy = (last.y - (rect.top + rect.height / 2)) / REACH;
      pointerX.set(Math.max(-1, Math.min(1, dx)));
      pointerY.set(Math.max(-1, Math.min(1, dy)));
    };

    const onMove = (event: PointerEvent) => {
      last = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const onLeave = () => {
      last = null;
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [pointerX, pointerY, reduced]);

  useEffect(() => {
    const el = canvas.current;
    const holder = box.current;
    if (!el || !holder) return;

    let cancelled = false;
    let controls: { stop: () => void } | undefined;
    let settled = false;

    const image = new window.Image();
    image.decoding = "async";
    image.setAttribute("fetchpriority", "high");
    image.src = src;

    /** Детерминированный шум: иначе плитки встают ровной шеренгой. */
    const jitter = (col: number, row: number) => {
      const value = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453;
      return value - Math.floor(value);
    };

    const paint = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = holder.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));

      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      const ctx = el.getContext("2d");
      if (!ctx) return null;
      ctx.scale(dpr, dpr);

      const cols = Math.max(8, Math.round(width / TILE));
      const rows = Math.max(8, Math.round(height / TILE));
      const sw = image.width / cols;
      const sh = image.height / rows;
      const dw = width / cols;
      const dh = height / rows;

      return {
        ctx,
        width,
        height,
        whole: () => {
          ctx.clearRect(0, 0, width, height);
          ctx.globalAlpha = 1;
          ctx.drawImage(image, 0, 0, width, height);
        },
        grid: (progress: number) => {
          ctx.clearRect(0, 0, width, height);
          for (let row = 0; row < rows; row += 1) {
            const wave = (row / rows) * 0.62;
            for (let col = 0; col < cols; col += 1) {
              const start = wave + jitter(col, row) * 0.2;
              const t = Math.min(1, Math.max(0, (progress - start) / 0.3));
              if (t <= 0) continue;
              const eased = 1 - (1 - t) ** 3;
              const scale = 0.32 + 0.68 * eased;
              // Плитка вырастает из своего центра и подтягивается снизу.
              const x = col * dw + (dw * (1 - scale)) / 2;
              const y = row * dh + (dh * (1 - scale)) / 2 + (1 - eased) * dh * 1.6;
              ctx.globalAlpha = eased;
              // Пол-пикселя нахлёста: иначе между плитками видна сетка.
              ctx.drawImage(image, col * sw, row * sh, sw, sh, x, y, dw * scale + 0.5, dh * scale + 0.5);
            }
          }
          ctx.globalAlpha = 1;
        },
      };
    };

    const start = () => {
      if (cancelled) return;
      const scene = paint();
      if (!scene) return;

      if (reduced) {
        scene.whole();
        settled = true;
        return;
      }

      controls = animate(0, BUILD, {
        duration: 1.35,
        ease: "linear",
        onUpdate: scene.grid,
        onComplete: () => {
          settled = true;
          scene.whole();
        },
      });
    };

    const onResize = () => {
      if (!settled || cancelled) return;
      paint()?.whole();
    };

    if (image.complete && image.naturalWidth > 0) start();
    else image.onload = start;

    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      controls?.stop();
      window.removeEventListener("resize", onResize);
    };
  }, [reduced, src]);

  return (
    <div className={cn("relative mx-auto w-full [perspective:900px]", className ?? "max-w-[min(28rem,46vh)]")}>
      {/* Тёмная земля под набором успокаивает пёструю фотографию, золотой
          ореол поверх неё отделяет набор от кадра. Без этой пары вырезанный
          набор читается наклейкой. */}
      <span
        aria-hidden="true"
        className="adar-set-ground pointer-events-none absolute -inset-[26%] -z-20 rounded-full blur-2xl"
      />
      <motion.span
        aria-hidden="true"
        style={reduced ? undefined : { x: haloX, y: haloY }}
        className="adar-set-halo pointer-events-none absolute -inset-[12%] -z-10 rounded-full blur-2xl"
      />

      <motion.div
        ref={box}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative aspect-square"
      >
        <canvas ref={canvas} role="img" aria-label={alt} className="h-full w-full">
          {alt}
        </canvas>
      </motion.div>

      {/* Тень: набор должен стоять в кадре, а не висеть в нём */}
      <span
        aria-hidden="true"
        className="adar-set-floor pointer-events-none absolute inset-x-[6%] -bottom-[4%] -z-10 h-[16%] blur-md"
      />
    </div>
  );
}

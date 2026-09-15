"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { MotionValue } from "motion/react";

/** Крупная нарезка: из неё берутся шоколадки, которые лежат в фоне. */
const FIELD_GRID = 7;
/** Мелкая: из неё складывается сам набор. */
const FLOCK_GRID = 13;
/** Сколько длится сборка набора, мс. */
const BUILD = 1700;
/**
 * Сколько пикселей канве разрешено держать.
 *
 * Плотность считается от этого числа, а не берётся у экрана: на ретине
 * 2560×1440 полноэкранная канва в два пикселя на точку — это почти
 * пятнадцать миллионов пикселей на кадр, и без видеоускорения кадр
 * считается впятеро дольше, чем нужно. Качество при этом не теряется:
 * снимки наборов всего 860 px, и на 1,5 плитка уже рисуется один к одному
 * с исходником.
 */
const BUDGET = 2_600_000;
/**
 * Ступени качества поля.
 *
 * Сцена сама смотрит, укладывается ли кадр в 60 в секунду, и если нет —
 * спускается на ступень: шоколадок становится меньше. Замерять чужую
 * машину заранее нельзя, а обещание «сайт не лагает» держать надо.
 */
const LEVELS = [1, 0.68, 0.45, 0.3];
/** Доля сборки, которую занимает разброс стартов по плиткам. */
const STAGGER = 0.45;

type Crop = { image: number; sx: number; sy: number; ss: number };

type FieldTile = Crop & {
  /** Место в долях экрана — чтобы поле не ломалось при смене размера окна. */
  u: number;
  v: number;
  depth: number;
  spin: number;
  size: number;
  alpha: number;
};

type FlockTile = Crop & {
  col: number;
  row: number;
  /** Откуда прилетает — тоже в долях экрана. */
  u: number;
  v: number;
  spin: number;
  delay: number;
};

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const mix = (from: number, to: number, t: number) => from + (to - from) * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Повторяемый «шум»: одна и та же раскладка при каждой загрузке страницы. */
function noise(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** Последовательность Халтона — точки ложатся равномерно, без комков. */
function halton(index: number, base: number) {
  let fraction = 1;
  let result = 0;
  let i = index;
  while (i > 0) {
    fraction /= base;
    result += fraction * (i % base);
    i = Math.floor(i / base);
  }
  return result;
}

/** Кусочно-линейная кривая — то же, что useTransform, но внутри кадра канвы. */
function curve(t: number, stops: number[], values: number[]) {
  if (t <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i += 1) {
    if (t <= stops[i]) {
      const span = stops[i] - stops[i - 1] || 1;
      return mix(values[i - 1], values[i], (t - stops[i - 1]) / span);
    }
  }
  return values[values.length - 1];
}

/**
 * Нарезает картинку набора на клетки и оставляет те, где действительно
 * лежит товар: у снимков прозрачный фон, и пустые клетки дали бы в поле
 * дырки, а в наборе — рваные края.
 */
function usableCells(alpha: Uint8ClampedArray, side: number, grid: number, floor: number) {
  const cells: { col: number; row: number }[] = [];
  const step = side / grid;
  for (let row = 0; row < grid; row += 1) {
    for (let col = 0; col < grid; col += 1) {
      let sum = 0;
      let count = 0;
      for (let y = Math.floor(row * step); y < Math.floor((row + 1) * step); y += 1) {
        for (let x = Math.floor(col * step); x < Math.floor((col + 1) * step); x += 1) {
          sum += alpha[(y * side + x) * 4 + 3];
          count += 1;
        }
      }
      if (count && sum / (count * 255) >= floor) cells.push({ col, row });
    }
  }
  return cells;
}

/**
 * Фон первого экрана — поле шоколадок, из которого собирается набор.
 *
 * Фотографию-подложку убрали: набор, вырезанный и положенный на чужой кадр,
 * читается наклейкой. Вместо неё на тёмном стоят сами конфеты — настоящие,
 * нарезанные из снимков наборов, — и когда начинается глава, часть из них
 * слетается в середину и складывается в коробку.
 *
 * Всё рисует одна канва: и поле, и набор. Так это сотня отрисовок спрайтов
 * за кадр вместо сотни элементов в разметке, за которыми браузер считал бы
 * раскладку.
 */
export function ChocoField({
  sources,
  active,
  progress,
  timeline,
  boxRef,
  reduced,
}: {
  /** Снимки наборов: и фон из них, и сам набор. */
  sources: string[];
  /** Какой набор собирается сейчас. */
  active: number;
  /** Положение внутри главы, 0…1. */
  progress: MotionValue<number>;
  /** Сквозная позиция по всем главам — на неё едет поле. */
  timeline: MotionValue<number>;
  /** Пустая коробка в разметке, вокруг которой стоят подписи состава. */
  boxRef: RefObject<HTMLDivElement | null>;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const bornRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    activeRef.current = active;
    bornRef.current = performance.now();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stopped = false;
    let frame = 0;
    let visible = true;
    let level = 0;
    let quality = LEVELS[0];
    let width = 0;
    let height = 0;
    let ratio = 1;
    let box = { x: 0, y: 0, size: 0 };

    /** Ставит плитку: масштаб под плотность пикселей входит в саму матрицу. */
    const place = (x: number, y: number, spin: number) => {
      const cos = Math.cos(spin) * ratio;
      const sin = Math.sin(spin) * ratio;
      ctx.setTransform(cos, sin, -sin, cos, x * ratio, y * ratio);
    };
    const reset = () => ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const images: HTMLImageElement[] = [];
    let field: FieldTile[] = [];
    let flocks: FlockTile[][] = [];
    let halo: HTMLCanvasElement | null = null;

    /** Тёмная земля и золотой ореол под набором — заранее, одной картинкой. */
    const bakeHalo = () => {
      const size = 320;
      const sprite = document.createElement("canvas");
      sprite.width = size;
      sprite.height = size;
      const paintCtx = sprite.getContext("2d");
      if (!paintCtx) return;

      const mid = size / 2;
      const ground = paintCtx.createRadialGradient(mid, mid, 0, mid, mid, mid * 0.86);
      ground.addColorStop(0, "rgba(6, 18, 12, 0.82)");
      ground.addColorStop(0.5, "rgba(6, 18, 12, 0.46)");
      ground.addColorStop(1, "rgba(6, 18, 12, 0)");
      paintCtx.fillStyle = ground;
      paintCtx.fillRect(0, 0, size, size);

      const glow = paintCtx.createRadialGradient(mid, mid, 0, mid, mid, mid * 0.72);
      glow.addColorStop(0, "rgba(208, 160, 60, 0.26)");
      glow.addColorStop(0.55, "rgba(208, 160, 60, 0.07)");
      glow.addColorStop(1, "rgba(208, 160, 60, 0)");
      paintCtx.fillStyle = glow;
      paintCtx.fillRect(0, 0, size, size);

      halo = sprite;
    };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const room = Math.sqrt(BUDGET / (width * height));
      ratio = Math.max(1, Math.min(window.devicePixelRatio || 1, 1.6, room));
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      reset();

      const target = boxRef.current?.getBoundingClientRect();
      box = target
        ? { x: target.left - rect.left, y: target.top - rect.top, size: target.width }
        : { x: width / 2 - 140, y: height / 2 - 140, size: 280 };
    };

    const build = () => {
      const narrow = width < 900;
      const cell = narrow ? 116 : 152;
      const fit = Math.max(16, Math.min(130, Math.round((width * height) / (cell * cell))));
      const count = Math.max(12, Math.round(fit * quality));
      const base = narrow ? 64 : Math.max(88, Math.min(118, Math.round(width / 13)));

      // Поле: крупные куски со всех наборов, разложенные по Халтону.
      const pool: Crop[] = [];
      images.forEach((image, index) => {
        const probe = document.createElement("canvas");
        probe.width = 96;
        probe.height = 96;
        const probeCtx = probe.getContext("2d", { willReadFrequently: true });
        if (!probeCtx) return;
        probeCtx.drawImage(image, 0, 0, 96, 96);
        const alpha = probeCtx.getImageData(0, 0, 96, 96).data;

        const side = image.naturalWidth / FIELD_GRID;
        for (const cell of usableCells(alpha, 96, FIELD_GRID, 0.72)) {
          pool.push({ image: index, sx: cell.col * side, sy: cell.row * side, ss: side });
        }

        // Набор: мелкая сетка, пустые клетки выброшены.
        const fine = image.naturalWidth / FLOCK_GRID;
        const tiles: FlockTile[] = [];
        for (const cell of usableCells(alpha, 96, FLOCK_GRID, 0.12)) {
          const seed = index * 97 + cell.row * FLOCK_GRID + cell.col;
          tiles.push({
            image: index,
            sx: cell.col * fine,
            sy: cell.row * fine,
            ss: fine,
            col: cell.col,
            row: cell.row,
            u: 0.08 + noise(seed) * 0.84,
            v: 0.06 + noise(seed + 13.3) * 0.88,
            spin: (noise(seed + 31.7) - 0.5) * 1.5,
            delay: noise(seed + 57.1) * STAGGER,
          });
        }
        flocks[index] = tiles;
      });

      bakeHalo();

      field = Array.from({ length: count }, (_, i) => {
        const crop = pool[Math.floor(noise(i * 5.7) * pool.length) % Math.max(1, pool.length)];
        const depth = 0.34 + noise(i + 3.3) * 0.66;
        return {
          ...crop,
          u: halton(i + 1, 2),
          v: halton(i + 1, 3),
          depth,
          spin: (noise(i + 9.1) - 0.5) * 0.9,
          size: base * (0.66 + depth * 0.62),
          alpha: 0.13 + depth * 0.26,
        };
      });
    };

    const paint = (now: number) => {
      reset();
      ctx.clearRect(0, 0, width, height);

      const q = progress.get();
      const line = timeline.get();
      const px = pointer.current.x;
      const py = pointer.current.y;

      const dim = curve(q, [0.4, 0.55, 0.84, 0.94], [0, 0.72, 0.72, 0]);

      // Поле: медленно едет вверх на прокрутке и чуть ведётся за курсором.
      for (let i = 0; i < field.length; i += 1) {
        const tile = field[i];
        const image = images[tile.image];
        if (!image) continue;

        const span = height + tile.size * 2;
        const shift = line * 90 * tile.depth + (reduced ? 0 : now * 0.0055 * tile.depth);
        let y = ((tile.v * height + tile.size + shift) % span + span) % span - tile.size;
        const x = tile.u * width + px * 34 * tile.depth;
        y += py * 22 * tile.depth;

        const spin = tile.spin + (reduced ? 0 : Math.sin(now * 0.00016 + i) * 0.06);
        ctx.globalAlpha = tile.alpha;
        place(x, y, spin);
        ctx.drawImage(image, tile.sx, tile.sy, tile.ss, tile.ss, -tile.size / 2, -tile.size / 2, tile.size, tile.size);
      }
      reset();

      if (dim > 0) {
        ctx.globalAlpha = dim;
        ctx.fillStyle = "#081710";
        ctx.fillRect(0, 0, width, height);
      }

      const flock = flocks[activeRef.current] ?? [];
      const image = images[activeRef.current];
      if (!image) {
        ctx.globalAlpha = 1;
        return;
      }

      // Последняя глава не разлетается: экран должен кончиться набором, а
      // не пустым полем.
      const last = activeRef.current === flocks.length - 1;
      const scale = curve(q, [0, 0.42, 0.62, 1], [1, 1, 0.78, 0.78]);
      const fade = last ? 1 : curve(q, [0, 0.95, 1], [1, 1, 0]);
      const back = last ? 0 : curve(q, [0.94, 1], [0, 1]);
      const built = reduced ? 1 : clamp01((now - bornRef.current) / BUILD);

      const side = (box.size * scale) / FLOCK_GRID;
      const left = box.x + box.size / 2 - (side * FLOCK_GRID) / 2;
      const top = box.y + box.size / 2 - (side * FLOCK_GRID) / 2;

      const cx = box.x + box.size / 2;
      const cy = box.y + box.size / 2;

      if (halo) {
        const reach = box.size * 2.2;
        ctx.globalAlpha = clamp01(built * 1.4) * fade;
        ctx.drawImage(halo, cx - reach / 2, cy - reach / 2, reach, reach);
      }

      for (let i = 0; i < flock.length; i += 1) {
        const tile = flock[i];
        const t = easeOut(clamp01((built - tile.delay) / (1 - STAGGER)));
        if (t <= 0) continue;

        const wildX = tile.u * width;
        const wildY = tile.v * height;
        const homeX = left + (tile.col + 0.5) * side;
        const homeY = top + (tile.row + 0.5) * side;

        // Прилетает крупной шоколадкой и садится в свою клетку; в конце
        // главы улетает обратно в поле.
        const settle = back > 0 ? 1 - back : t;
        const x = mix(wildX, homeX, settle);
        const y = mix(wildY, homeY, settle);
        const size = mix(side * 2.6, side, settle) + 0.5;
        const spin = mix(tile.spin, 0, settle);

        ctx.globalAlpha = clamp01(t * 2) * fade * (back > 0 ? 1 - back * 0.85 : 1);
        place(x, y, spin);
        ctx.drawImage(image, tile.sx, tile.sy, tile.ss, tile.ss, -size / 2, -size / 2, size, size);
      }

      reset();
      ctx.globalAlpha = 1;
    };

    // Сторож частоты: медиана по полусотне кадров, ступень вниз — сразу,
    // вверх — только после трёх спокойных замеров, иначе качество запрыгает.
    const spans: number[] = [];
    let previous = 0;
    let calm = 0;

    const govern = (now: number) => {
      const delta = now - previous;
      previous = now;
      if (delta <= 0 || delta > 400) return;
      spans.push(delta);
      if (spans.length < 48) return;

      spans.sort((a, b) => a - b);
      // Смотрим не медиану, а хвост: медиана держит 16,7 мс и тогда, когда
      // каждый третий кадр проседает, — а видно именно просадки.
      const slow = spans[Math.floor(spans.length * 0.7)];
      const fast = spans[Math.floor(spans.length * 0.9)];
      spans.length = 0;

      if (slow > 20 && level < LEVELS.length - 1) {
        level += 1;
        quality = LEVELS[level];
        calm = 0;
        build();
      } else if (fast < 15 && level > 0) {
        calm += 1;
        if (calm >= 3) {
          level -= 1;
          quality = LEVELS[level];
          calm = 0;
          build();
        }
      } else {
        calm = 0;
      }
    };

    const loop = (now: number) => {
      if (stopped) return;
      if (visible) {
        paint(now);
        govern(now);
      } else {
        previous = 0;
        spans.length = 0;
      }
      frame = requestAnimationFrame(loop);
    };

    const onResize = () => {
      measure();
      build();
    };

    let pointerFrame = 0;
    let lastPointer: { x: number; y: number } | null = null;
    const applyPointer = () => {
      pointerFrame = 0;
      if (!lastPointer) return;
      pointer.current = {
        x: Math.max(-1, Math.min(1, (lastPointer.x / window.innerWidth) * 2 - 1)),
        y: Math.max(-1, Math.min(1, (lastPointer.y / window.innerHeight) * 2 - 1)),
      };
    };
    const onPointer = (event: PointerEvent) => {
      lastPointer = { x: event.clientX, y: event.clientY };
      if (!pointerFrame) pointerFrame = requestAnimationFrame(applyPointer);
    };

    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    watcher.observe(canvas);

    Promise.all(
      sources.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve) => {
            const image = new window.Image();
            image.decoding = "async";
            image.onload = () => resolve(image);
            image.onerror = () => resolve(image);
            image.src = src;
          }),
      ),
    ).then((loaded) => {
      if (stopped) return;
      images.push(...loaded);
      flocks = [];
      measure();
      build();
      bornRef.current = performance.now();
      frame = requestAnimationFrame(loop);
    });

    const sizer = new ResizeObserver(() => {
      if (images.length) onResize();
    });
    sizer.observe(canvas);

    window.addEventListener("resize", onResize);
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      stopped = true;
      watcher.disconnect();
      sizer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [boxRef, progress, reduced, sources, timeline]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

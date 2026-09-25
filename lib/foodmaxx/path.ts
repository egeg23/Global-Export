/**
 * Кривая, по которой катится банка.
 *
 * Считается формулой, а не через `getPointAtLength` у SVG: точки нужны и на
 * сервере, и до того, как разметка окажется в DOM, а кубическая Безье
 * раскрывается в пятнадцать строк и не требует браузера.
 */

export type Point = { x: number; y: number; angle: number; at: number };

type Curve = [number, number, number, number, number, number, number, number];

/** Дорога в системе 1000 × 520: подъём, спуск и выход наверх. */
const CURVES: Curve[] = [
  [120, 400, 230, 160, 360, 150, 490, 255],
  [490, 255, 570, 330, 630, 425, 745, 405],
  [745, 405, 840, 388, 880, 300, 900, 200],
];

const at = (c: Curve, t: number) => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return {
    x: a * c[0] + b * c[2] + d * c[4] + e * c[6],
    y: a * c[1] + b * c[3] + d * c[5] + e * c[7],
  };
};

/**
 * Разбивает дорогу на равные по длине шаги.
 *
 * Именно по длине, а не по параметру: у Безье параметр бежит неравномерно, и
 * банка на крутых участках рвалась бы вперёд, а на пологих ползла.
 */
export function roadPoints(steps = 160): Point[] {
  const dense: { x: number; y: number }[] = [];
  for (const curve of CURVES) {
    for (let i = 0; i <= 240; i++) dense.push(at(curve, i / 240));
  }

  const runs: number[] = [0];
  for (let i = 1; i < dense.length; i++) {
    const dx = dense[i].x - dense[i - 1].x;
    const dy = dense[i].y - dense[i - 1].y;
    runs.push(runs[i - 1] + Math.hypot(dx, dy));
  }
  const total = runs[runs.length - 1];

  const out: Point[] = [];
  let cursor = 0;
  for (let s = 0; s <= steps; s++) {
    const want = (total * s) / steps;
    while (cursor < runs.length - 2 && runs[cursor + 1] < want) cursor += 1;
    const span = runs[cursor + 1] - runs[cursor] || 1;
    const k = (want - runs[cursor]) / span;
    const a = dense[cursor];
    const b = dense[cursor + 1];
    const x = a.x + (b.x - a.x) * k;
    const y = a.y + (b.y - a.y) * k;
    out.push({
      x,
      y,
      angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
      at: want / total,
    });
  }
  return out;
}

/** Тот же путь строкой — им рисуется сама линия. */
export const roadD = CURVES.map((c, i) =>
  `${i === 0 ? `M ${c[0]} ${c[1]} ` : ""}C ${c[2]} ${c[3]} ${c[4]} ${c[5]} ${c[6]} ${c[7]}`,
).join(" ");

/** Длина дороги в тех же единицах — нужна для «рисования» линии. */
export const roadLength = (() => {
  const pts = roadPoints(400);
  let sum = 0;
  for (let i = 1; i < pts.length; i++) sum += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return sum;
})();

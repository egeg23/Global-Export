/**
 * Время истории — в экранах прокрутки: t = 12.5 значит «пролистано двенадцать
 * с половиной высот окна». Сцены описаны функциями от t, а не ключевыми
 * кадрами CSS: так любой кадр можно перемотать вперёд и назад, и он выглядит
 * одинаково при любой скорости прокрутки.
 */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Доля пути от a к b: 0 до начала, 1 после конца. */
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;

/** Мягкий вход и выход — основное движение камеры. */
export const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const out = (x: number) => 1 - Math.pow(1 - x, 3);
export const sine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

/**
 * Значение по опорным точкам [t, v]: между соседними — с плавным ходом,
 * так что камера не дёргается на стыках.
 */
export function keys(t: number, points: readonly (readonly [number, number])[], ease = sine): number {
  if (t <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i += 1) {
    const [t1, v1] = points[i];
    if (t <= t1) {
      const [t0, v0] = points[i - 1];
      return lerp(v0, v1, ease((t - t0) / (t1 - t0)));
    }
  }
  return points[points.length - 1][1];
}

/** Появиться к a…a+fade, исчезнуть к b-fade…b. */
export function window01(t: number, a: number, b: number, fade = 0.6): number {
  return Math.min(seg(t, a, a + fade), 1 - seg(t, b - fade, b));
}

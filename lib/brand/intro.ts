/**
 * Связь с заставкой студии для тех страниц, у которых есть своя.
 *
 * Заставка объявляет о себе ещё до первой отрисовки — скриптом, стоящим в
 * разметке перед самим слоем. Поэтому собственный пролог страницы узнаёт о
 * ней сразу на монтировании, а не через кадр, когда уже начал играть под
 * чужим слоем.
 */

/** Событие «заставка договорила, кадр ваш». */
export const DEVUZ_INTRO_END = "devuz:intro-end";

/** Идёт ли сейчас заставка студии. */
export function devuzIntroPending(): boolean {
  if (typeof window === "undefined") return false;
  return (window as unknown as { __dz?: boolean }).__dz === true;
}

/**
 * Выполнить, когда заставка студии освободит кадр. Если её на странице нет
 * (или она уже отыграла) — выполняется сразу же.
 *
 * Возвращает отписку, чтобы вызывать прямо из эффекта.
 */
export function whenDevuzIntroDone(run: () => void): () => void {
  if (!devuzIntroPending()) {
    run();
    return () => {};
  }
  window.addEventListener(DEVUZ_INTRO_END, run, { once: true });
  return () => window.removeEventListener(DEVUZ_INTRO_END, run);
}

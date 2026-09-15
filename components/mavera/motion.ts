"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Число, которое досчитывается до нового значения.
 *
 * Общая для карточки квартиры и итога конструктора: когда цифра меняется от
 * действия пользователя, счёт показывает, что она изменилась именно сейчас,
 * а не была такой всегда. При выключенном движении значение возвращается
 * напрямую — состояние не трогается, лишних перерисовок нет.
 */
export function useCountUp(value: number, enabled: boolean, duration = 520) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  const frame = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const start = from.current;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + (value - start) * eased));
      if (p < 1) frame.current = requestAnimationFrame(tick);
      else from.current = value;
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, enabled, duration]);

  return enabled ? shown : value;
}

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(listener: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

/**
 * Разрешено ли движение системной настройкой.
 *
 * Внешнее хранилище, а не состояние с эффектом: на сервере и при гидрации
 * считается «разрешено», после — то, что сказала система, без лишнего
 * каскада перерисовок.
 */
export function useMotionPreferred() {
  return useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(QUERY).matches,
    () => true,
  );
}

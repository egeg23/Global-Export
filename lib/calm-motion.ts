"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const now = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(QUERY).matches
    : false;

/** На сервере медиазапроса нет — там движение всегда «включено». */
const onServer = () => false;

/**
 * «Уменьшить движение» — так, чтобы это переживало гидратацию.
 *
 * Обычный хук отдаёт настройку системы уже на первой отрисовке в браузере, и
 * компонент, который при ней рисует другую разметку, расходится с тем, что
 * пришло с сервера: React выбрасывает всё поддерево и собирает заново.
 * `useSyncExternalStore` на гидратации берёт серверное значение, а настоящее
 * подставляет следующим кадром — разметка сходится, а поведение остаётся.
 */
export function useCalmMotion() {
  return useSyncExternalStore(subscribe, now, onServer);
}

"use client";

import { useSyncExternalStore } from "react";

import type { StepId } from "@/content/delta/school";

/**
 * Выбор из подбора ступени — для формы записи.
 *
 * Подбор и форма живут в разных разделах страницы, и прокидывать состояние
 * через общего родителя пришлось бы через серверные компоненты. Поэтому
 * маленькое внешнее хранилище: подбор кладёт ответ, форма его читает.
 */
export type Pick = { step: StepId; ages: string; note: string };

let current: Pick | null = null;
const listeners = new Set<() => void>();

export function announcePick(pick: Pick) {
  current = pick;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function usePick(): Pick | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

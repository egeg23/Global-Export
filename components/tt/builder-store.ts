"use client";

import { useCallback, useSyncExternalStore } from "react";

import { scenarios } from "@/content/tt/scenarios";

/**
 * Набор услуг живёт вне обоих блоков, которые его показывают.
 *
 * Конструктор и раздел «Задачи» стоят в разных главах страницы, но
 * работают с одним набором: выбрал сценарий — конструктор отметил то,
 * что под него нужно. Держать это состояние внутри одного из них
 * означало бы тянуть его наружу через всю страницу.
 */

type State = { picked: string[]; seats: number; scenario: string | null };

let state: State = {
  picked: ["internet", "telephony", "pbx", "workplace"],
  seats: 50,
  scenario: "office",
};

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot() {
  return state;
}

export function useBuilder() {
  const value = useSyncExternalStore(subscribe, snapshot, snapshot);

  const toggle = useCallback((id: string) => {
    const picked = state.picked.includes(id)
      ? state.picked.filter((item) => item !== id)
      : [...state.picked, id];
    // Руками тронули состав — сценарий больше не «выбран целиком».
    state = { ...state, picked, scenario: null };
    emit();
  }, []);

  const setSeats = useCallback((seats: number) => {
    state = { ...state, seats: Math.min(Math.max(seats, 1), 500) };
    emit();
  }, []);

  const applyScenario = useCallback((id: string) => {
    const scenario = scenarios.find((item) => item.id === id);
    if (!scenario) return;
    state = { picked: [...scenario.services], seats: scenario.seats, scenario: id };
    emit();
  }, []);

  return { ...value, toggle, setSeats, applyScenario };
}

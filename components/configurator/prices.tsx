"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import type { PriceList } from "@/lib/configurator/quote";

/**
 * Цены в доке — по коду.
 *
 * Решение владельца от 29.09.2026. Код дают бот студии и менеджер (скаут).
 * Прайса в браузере нет, пока сервер не проверил код
 * (app/api/showcase/prices): до этого док показывает только тумблеры, как
 * раньше. Код запоминается на время вкладки (sessionStorage) — чтобы при
 * переходе между страницами и проектами витрины не вводить его заново.
 */

const KEY = "dz-price-code";

export type PriceError = "wrong_code" | "too_many" | "not_configured" | "network";

export type PriceAccess = {
  prices: PriceList | null;
  busy: boolean;
  error: PriceError | null;
  unlock: (code: string) => Promise<void>;
  lock: () => void;
};

const Context = createContext<PriceAccess | null>(null);

async function request(project: string, code: string): Promise<{ prices?: PriceList; error?: PriceError }> {
  try {
    const response = await fetch("/api/showcase/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project, code }),
    });
    const data = (await response.json().catch(() => ({}))) as { ok?: boolean; prices?: PriceList; error?: string };
    if (response.ok && data.ok && data.prices) return { prices: data.prices };
    if (data.error === "wrong_code" || data.error === "too_many" || data.error === "not_configured") {
      return { error: data.error };
    }
    return { error: "network" };
  } catch {
    return { error: "network" };
  }
}

function saved(): string | null {
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function remember(code: string | null) {
  try {
    if (code) window.sessionStorage.setItem(KEY, code);
    else window.sessionStorage.removeItem(KEY);
  } catch {
    // Приватная вкладка: код придётся ввести ещё раз, и только.
  }
}

export function PriceProvider({ project, children }: { project: string; children: React.ReactNode }) {
  const [prices, setPrices] = useState<PriceList | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<PriceError | null>(null);

  // Код уже вводили в этой вкладке — цены подтягиваются сами.
  useEffect(() => {
    const code = saved();
    if (!code) return;
    let alive = true;
    request(project, code).then((result) => {
      if (!alive) return;
      if (result.prices) setPrices(result.prices);
      else if (result.error === "wrong_code" || result.error === "not_configured") remember(null);
    });
    return () => {
      alive = false;
    };
  }, [project]);

  const unlock = useCallback(
    async (code: string) => {
      setBusy(true);
      setError(null);
      const result = await request(project, code.trim());
      setBusy(false);
      if (result.prices) {
        remember(code.trim());
        setPrices(result.prices);
      } else {
        setError(result.error ?? "network");
      }
    },
    [project],
  );

  const lock = useCallback(() => {
    remember(null);
    setPrices(null);
    setError(null);
  }, []);

  return <Context.Provider value={{ prices, busy, error, unlock, lock }}>{children}</Context.Provider>;
}

export function usePrices(): PriceAccess | null {
  return useContext(Context);
}

export const priceErrorText: Record<PriceError, string> = {
  wrong_code: "Код не подошёл. Проверьте цифры или спросите менеджера.",
  too_many: "Слишком много попыток — подождите минуту.",
  not_configured: "Цены на этой площадке пока не включены.",
  network: "Не получилось связаться с сервером. Попробуйте ещё раз.",
};

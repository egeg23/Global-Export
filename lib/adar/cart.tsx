"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { sets } from "@/content/adar/catalog";
import type { GiftSet } from "@/lib/adar/types";

/** Где корзина живёт между визитами. */
const STORAGE = "adar:cart";
/** Партии считают тысячами, но не миллионами. */
const MAX_QTY = 99_999;

export type CartLine = { slug: string; qty: number };
export type CartRow = { set: GiftSet; qty: number; sum: number };

type Cart = {
  rows: CartRow[];
  /** Сколько подарков в корзине всего. */
  count: number;
  /** Сумма в сумах. */
  total: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<Cart | null>(null);

/**
 * Корзина есть не во всех вариантах витрины, поэтому снаружи провайдера хук
 * отдаёт null, а кнопки «в корзину» просто не появляются.
 */
export function useCart() {
  return useContext(CartContext);
}

const known = new Map(sets.map((set) => [set.slug, set] as const));

function sane(line: unknown): line is CartLine {
  if (!line || typeof line !== "object") return false;
  const { slug, qty } = line as CartLine;
  return (
    typeof slug === "string" &&
    known.has(slug) &&
    Number.isFinite(qty) &&
    qty > 0 &&
    qty <= MAX_QTY
  );
}

/* ------------------------------------------------------------------
   Хранилище корзины.

   Лежит в модуле, а не в состоянии компонента, и читается через
   useSyncExternalStore. Так разметка на сервере и на первом кадре в
   браузере совпадает (пустая корзина), а содержимое подхватывается ровно
   тогда, когда React подписывается на хранилище, — без записи состояния
   из эффекта.

   В localStorage лежат только артикул и количество: цена и состав всегда
   берутся из каталога. Иначе корзина, пролежавшая до нового прайса,
   показывала бы прошлогодние цены — и заявка ушла бы с ними же.
   ------------------------------------------------------------------ */

/** Стабильная ссылка: useSyncExternalStore сравнивает снимки по ней. */
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(parsed)) return EMPTY;
    const safe = parsed.filter(sane);
    return safe.length ? safe : EMPTY;
  } catch {
    // Приватное окно или запрет на хранилище: корзина не переживёт
    // перезагрузку, но работать будет.
    return EMPTY;
  }
}

function write(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE, JSON.stringify(next));
  } catch {
    /* см. read() */
  }
  for (const listener of listeners) listener();
}

/** Корзину могли поменять в соседней вкладке — подхватываем. */
function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== STORAGE) return;
  lines = read();
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  if (!loaded) {
    loaded = true;
    lines = read();
    window.addEventListener("storage", onStorage);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const snapshot = () => lines;
const serverSnapshot = () => EMPTY;

export function CartProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [isOpen, setOpen] = useState(false);

  const add = useCallback((slug: string, qty = 1) => {
    if (!known.has(slug)) return;
    const found = lines.find((line) => line.slug === slug);
    write(
      found
        ? lines.map((line) =>
            line.slug === slug ? { ...line, qty: Math.min(MAX_QTY, line.qty + qty) } : line,
          )
        : [...lines, { slug, qty: Math.min(MAX_QTY, Math.max(1, qty)) }],
    );
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    write(
      qty <= 0
        ? lines.filter((line) => line.slug !== slug)
        : lines.map((line) =>
            line.slug === slug ? { ...line, qty: Math.min(MAX_QTY, Math.round(qty)) } : line,
          ),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    write(lines.filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => write(EMPTY), []);

  const value = useMemo<Cart>(() => {
    const rows = current
      .map((line) => {
        const set = known.get(line.slug);
        return set ? { set, qty: line.qty, sum: set.price * line.qty } : null;
      })
      .filter((row): row is CartRow => row !== null);

    return {
      rows,
      count: rows.reduce((sum, row) => sum + row.qty, 0),
      total: rows.reduce((sum, row) => sum + row.sum, 0),
      add,
      setQty,
      remove,
      clear,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  }, [add, clear, current, isOpen, remove, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

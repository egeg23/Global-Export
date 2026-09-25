"use client";

import { useCallback, useSyncExternalStore } from "react";

import { LANG_KEY } from "@/lib/showcase/lang-script";
import { langs, type Lang, type Pair } from "@/content/tt/i18n";
import { cn } from "@/lib/cn";

/**
 * Язык страницы.
 *
 * Хранится там же, где палитра, — в атрибуте на теле документа, который
 * ставит скрипт ещё до первой отрисовки. Состояние React вторым
 * источником правды здесь только мешало бы: на сервере языка ещё нет, а
 * запись состояния в эффекте компилятор React справедливо запрещает.
 *
 * Скрипт заодно смотрит на язык браузера: казахстанцу с казахским
 * интерфейсом страница откроется по-казахски сама.
 */

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function read() {
  return document.body.getAttribute("data-lang") ?? "ru";
}

function server() {
  return "ru";
}

export function useLang(): { lang: Lang; setLang: (lang: Lang) => void } {
  const stored = useSyncExternalStore(subscribe, read, server);
  const lang: Lang = stored === "kk" ? "kk" : "ru";

  const setLang = useCallback((next: Lang) => {
    document.body.setAttribute("data-lang", next);
    document.documentElement.setAttribute("lang", next === "kk" ? "kk" : "ru");
    for (const listener of listeners) listener();
    try {
      localStorage.setItem(`${LANG_KEY}:tt`, next);
    } catch {
      // Приватное окно: язык просто не запомнится.
    }
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(null, "", url);
  }, []);

  return { lang, setLang };
}

/** Короткая запись перевода прямо в разметке. */
export function useT() {
  const { lang } = useLang();
  return useCallback((pair: Pair) => pair[lang], [lang]);
}

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-[var(--w-line)] p-0.5",
        className,
      )}
    >
      {langs.map((item) => {
        const on = item.id === lang;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLang(item.id)}
            aria-pressed={on}
            aria-label={item.full}
            lang={item.id === "kk" ? "kk" : "ru"}
            className={cn(
              "cursor-pointer rounded-full px-2.5 py-1 text-[0.78rem] transition-colors",
              on
                ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
                : "text-[var(--w-muted)] hover:text-[var(--w-ink)]",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

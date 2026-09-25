"use client";

import { useCallback, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";

/**
 * Переключатель палитры мира.
 *
 * У «Премиума» MAVERA такой уже есть, но он завязан на её разделы и на
 * два набора — светлый и тёмный. Здесь задача проще и общее: у витрины
 * три палитры, переключаются они целиком и сразу.
 *
 * Выбор живёт в трёх местах, и все три нужны. В атрибуте `data-palette`
 * на корне документа — им красится страница. В адресе (`?palette=`) —
 * чтобы заказчику можно было отправить ссылку сразу на нужный вариант, а
 * не объяснять словами, что там надо нажать. В localStorage — чтобы
 * вернувшись, он увидел то же, что выбрал.
 *
 * Атрибут ставится и до первой отрисовки, скриптом в разметке: иначе
 * страница успела бы моргнуть палитрой по умолчанию. Этот приём описан в
 * руководстве Next про вспышку до гидратации.
 */

export type Palette = {
  id: string;
  label: string;
  /** Одна строка о характере — под образцом. */
  note: string;
  /** Краска самого образца: фон, подложка, акцент. */
  swatch: { bg: string; paper: string; accent: string };
};

import { PALETTE_KEY } from "@/lib/showcase/palette-script";

/**
 * Текущая палитра живёт не в состоянии React, а в самом документе.
 *
 * Её ставит скрипт из разметки ещё до первой отрисовки, и она же красит
 * страницу. Второй источник правды в состоянии React означал бы
 * рассинхрон и запись состояния прямо в эффекте, чего компилятор React
 * справедливо не любит. Поэтому атрибут и есть хранилище, а подписка
 * через `useSyncExternalStore` просто сообщает о его смене.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readPalette() {
  return document.body.getAttribute("data-palette") ?? "";
}

/** На сервере палитры ещё нет: там рисуется первая из списка. */
function serverPalette() {
  return "";
}

export function usePalette(world: string, palettes: Palette[]) {
  const stored = useSyncExternalStore(subscribe, readPalette, serverPalette);
  const active = palettes.some((p) => p.id === stored) ? stored : palettes[0].id;

  const choose = useCallback(
    (id: string) => {
      document.body.setAttribute("data-palette", id);
      for (const listener of listeners) listener();
      try {
        localStorage.setItem(`${PALETTE_KEY}:${world}`, id);
      } catch {
        // Приватное окно: палитра просто не запомнится.
      }
      const url = new URL(window.location.href);
      url.searchParams.set("palette", id);
      window.history.replaceState(null, "", url);
    },
    [world],
  );

  return { active, choose };
}

/** Ряд образцов. Кнопки, а не радиокнопки: выбор виден на самой странице. */
export function PaletteSwitch({
  world,
  palettes,
  className,
  label = "Палитра",
}: {
  world: string;
  palettes: Palette[];
  className?: string;
  label?: string;
}) {
  const { active, choose } = usePalette(world, palettes);

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      <span className="text-[0.7rem] uppercase tracking-[0.2em] text-[var(--w-muted)]">
        {label}
      </span>
      {/* Переносим: три названия палитр в строку не помещаются на телефоне
          и утаскивали за собой всю страницу вправо. */}
      <ul className="flex flex-wrap items-center gap-1.5">
        {palettes.map((palette) => {
          const on = palette.id === active;
          return (
            <li key={palette.id}>
              <button
                type="button"
                onClick={() => choose(palette.id)}
                aria-pressed={on}
                title={`${palette.label} — ${palette.note}`}
                className={cn(
                  "group flex cursor-pointer items-center gap-2 rounded-[var(--w-radius)] border px-2 py-1.5 transition-colors",
                  on
                    ? "border-[var(--w-accent)] bg-[var(--w-accent-soft)]"
                    : "border-[var(--w-line)] hover:border-[var(--w-accent)]",
                )}
              >
                {/* Образец красится своей краской, а не текущей палитрой:
                    иначе «Степь» показывала бы цвет «Магистрали». */}
                <span
                  aria-hidden
                  className="flex size-5 overflow-hidden rounded-full border border-black/10"
                >
                  <span className="w-1/3" style={{ background: palette.swatch.bg }} />
                  <span className="w-1/3" style={{ background: palette.swatch.paper }} />
                  <span className="w-1/3" style={{ background: palette.swatch.accent }} />
                </span>
                <span className="text-[0.78rem] whitespace-nowrap">{palette.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

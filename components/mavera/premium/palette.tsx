"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  defaultPalette,
  isPalette,
  paletteById,
  palettes,
  sectionLabel,
  type PaletteId,
} from "@/content/mavera/palettes";
import { cn } from "@/lib/cn";

/**
 * Палитра «Премиума»: свет всего сайта и свет отдельного раздела.
 *
 * Механика держится на одном: страница нигде не знает конкретного цвета,
 * она собрана на переменных мира. Поэтому смена палитры — это смена одного
 * атрибута, а не перерисовка компонентов. Атрибут на корне красит весь сайт,
 * тот же атрибут на разделе переопределяет переменные только внутри него.
 *
 * Зачем раздел отдельно: на встрече спор идёт не про сайт целиком, а про
 * конкретный экран — «генплан в песке тяжеловат, а подбор в нём как раз».
 * Здесь это проверяется на месте, а не рисуется потом в макете.
 *
 * Выбор уезжает в адрес страницы, поэтому кнопка «Скопировать ссылку» в
 * конструкторе уносит и палитру: коллега откроет ровно то, что видели вы.
 */

type State = {
  /** Палитра всего сайта. */
  global: PaletteId;
  /** Разделы, которым выбрали своё. Пусто — все живут общей. */
  sections: Record<string, PaletteId>;
  /** Режим «по разделам»: на разделах появляются образцы. */
  perSection: boolean;
  open: boolean;
};

const empty: State = { global: defaultPalette, sections: {}, perSection: false, open: false };

let state: State = empty;
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

const read = () => state;
/**
 * На сервере и при первом рендере — палитра по умолчанию.
 *
 * Читать адрес прямо здесь нельзя: разметка с сервера про параметр не
 * знает, и React развалил бы гидрацию. Адрес разбирается эффектом сразу
 * после неё — см. `PaletteRoot`.
 */
const readOnServer = () => empty;

const PARAM = "palette";
const SECTIONS_PARAM = "pal";

function patch(next: Partial<State>) {
  state = { ...state, ...next };
  emit();
  save();
}

/** Набор уезжает в адрес: ссылку можно отправить, и палитра приедет с ней. */
function save() {
  try {
    const url = new URL(window.location.href);
    if (state.global === defaultPalette) url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, state.global);

    const pairs = Object.entries(state.sections).map(([id, palette]) => `${id}:${palette}`);
    if (pairs.length) url.searchParams.set(SECTIONS_PARAM, pairs.join(","));
    else url.searchParams.delete(SECTIONS_PARAM);

    window.history.replaceState(window.history.state, "", url);
  } catch {
    /* без адреса палитра живёт в памяти вкладки */
  }
}

/** Разбор адреса после гидрации. Чужая ссылка открывается с чужой палитрой. */
function adopt() {
  try {
    const params = new URLSearchParams(window.location.search);
    const global = params.get(PARAM);
    const raw = params.get(SECTIONS_PARAM);

    const sections: Record<string, PaletteId> = {};
    for (const pair of (raw ?? "").split(",")) {
      const [id, value] = pair.split(":");
      if (id && isPalette(value)) sections[id] = value;
    }

    const next: State = {
      ...state,
      global: isPalette(global) ? global : state.global,
      sections,
    };
    // Разделы со своим цветом видны только в режиме «по разделам», иначе
    // человек по ссылке увидит разноцветную страницу и не поймёт, откуда.
    if (Object.keys(sections).length) next.perSection = true;

    state = next;
    emit();
  } catch {
    /* адрес не прочитался — остаёмся на палитре по умолчанию */
  }
}

function usePalette() {
  return useSyncExternalStore(subscribe, read, readOnServer);
}

/* ------------------------------------------------------------------ */
/* Корень: палитра всего сайта                                         */
/* ------------------------------------------------------------------ */

export function PaletteRoot({ children }: { children: React.ReactNode }) {
  const { global } = usePalette();

  useEffect(() => {
    adopt();
  }, []);

  return (
    <div data-palette={global} className="w-slab w-slab-flat bg-[var(--w-bg)] text-[var(--w-ink)]">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Раздел: своя палитра поверх общей                                   */
/* ------------------------------------------------------------------ */

export function PaletteSection({
  id,
  tone = "bg",
  curved = true,
  anchor,
  className,
  children,
}: {
  /** Ключ раздела: он же в адресе и в подписи образца. */
  id: string;
  /** На чём лежит раздел: основной фон или подложка. */
  tone?: "bg" | "paper";
  /** Скруглённый край поверх предыдущего раздела. У первого экрана его нет. */
  curved?: boolean;
  anchor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { sections, perSection, global } = usePalette();
  const own = sections[id];

  return (
    <section
      id={anchor}
      data-palette={own ?? undefined}
      data-palette-section={id}
      className={cn(
        "w-slab isolate",
        curved ? "-mt-6 border-t border-[var(--w-line)] sm:-mt-10" : "w-slab-flat",
        anchor ? "scroll-mt-24" : null,
        tone === "paper" ? "bg-[var(--w-paper)]" : "bg-[var(--w-bg)]",
        className,
      )}
    >
      {perSection ? <SectionChips id={id} own={own} global={global} /> : null}
      {children}
    </section>
  );
}

/** Три образца в углу раздела и крестик «вернуть общую». */
function SectionChips({ id, own, global }: { id: string; own?: PaletteId; global: PaletteId }) {
  const label = sectionLabel(id);

  return (
    <div className="pointer-events-none absolute right-3 top-3 z-30 flex justify-end sm:right-5 sm:top-5">
      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-[#0b0d10]/92 py-1.5 pl-3 pr-1.5 text-[#f2efe9] shadow-lg ring-1 ring-white/10 backdrop-blur-sm">
        <span className="hidden max-w-[10rem] truncate text-[0.68rem] text-[#f2efe9]/70 sm:block">
          {label}
        </span>
        {palettes.map((palette) => {
          const active = (own ?? global) === palette.id;
          return (
            <button
              key={palette.id}
              type="button"
              aria-pressed={active}
              aria-label={`${label}: ${palette.label}`}
              title={palette.label}
              onClick={() =>
                patch({
                  sections:
                    palette.id === global
                      ? omit(state.sections, id)
                      : { ...state.sections, [id]: palette.id },
                })
              }
              className={cn(
                "h-6 w-6 shrink-0 rounded-full border transition-transform duration-200 hover:scale-110 motion-reduce:transform-none",
                active ? "border-[#ffd166] ring-1 ring-[#ffd166]" : "border-white/25",
              )}
              style={{
                background: `linear-gradient(135deg, ${palette.swatch.bg} 0 55%, ${palette.swatch.accent} 55% 100%)`,
              }}
            />
          );
        })}
        {own ? (
          <button
            type="button"
            onClick={() => patch({ sections: omit(state.sections, id) })}
            aria-label={`${label}: вернуть общую палитру`}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#f2efe9]/70 transition-colors hover:bg-white/10 hover:text-[#f2efe9]"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}

function omit(source: Record<string, PaletteId>, key: string): Record<string, PaletteId> {
  const next = { ...source };
  delete next[key];
  return next;
}

/* ------------------------------------------------------------------ */
/* Панель управления палитрой                                          */
/* ------------------------------------------------------------------ */

export function PaletteBar() {
  const { global, sections, perSection, open } = usePalette();
  const current = paletteById(global);
  const tuned = Object.keys(sections).length;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") patch({ open: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) {
    // Ярлык обязателен: на узком экране подпись «Палитра» прячется, и без
    // него у кнопки остаётся одно название цвета — непонятно ни человеку,
    // ни программе чтения с экрана.
    return (
      <button
        type="button"
        onClick={() => patch({ open: true })}
        aria-expanded={false}
        aria-label={`Палитра: ${current.label}`}
        className="w-dock-in fixed bottom-[5.5rem] left-1/2 z-[65] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[#0b0d10] py-2 pl-2.5 pr-4 font-sans text-sm text-[#f2efe9] shadow-2xl ring-1 ring-white/10 sm:bottom-5"
      >
        <span className="flex gap-1" aria-hidden="true">
          {palettes.map((palette) => (
            <span
              key={palette.id}
              className={cn(
                "h-4 w-4 rounded-full border",
                palette.id === global ? "border-[#ffd166]" : "border-white/20",
              )}
              style={{
                background: `linear-gradient(135deg, ${palette.swatch.bg} 0 55%, ${palette.swatch.accent} 55% 100%)`,
              }}
            />
          ))}
        </span>
        <span className="hidden sm:inline">Палитра</span>
        <span className="text-[#ffd166]">{current.label}</span>
        {tuned ? (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-[#f2efe9]/70">
            +{tuned}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <aside
      role="dialog"
      aria-label="Палитра сайта"
      className="w-dock-in fixed bottom-[5.5rem] left-1/2 z-[65] max-h-[min(78vh,42rem)] w-[min(92vw,24rem)] -translate-x-1/2 overflow-y-auto rounded-2xl bg-[#0b0d10] p-5 font-sans text-[#f2efe9] shadow-2xl ring-1 ring-white/10 sm:bottom-5"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#ffd166]">Палитра</p>
          <h2 className="mt-1 font-sans text-base font-medium">Свет всего сайта</h2>
        </div>
        <button
          type="button"
          onClick={() => patch({ open: false })}
          aria-label="Свернуть палитру"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#f2efe9]/60 transition-colors hover:bg-white/10 hover:text-[#f2efe9]"
        >
          ×
        </button>
      </header>

      <ul className="mt-4 space-y-1.5">
        {palettes.map((palette) => {
          const active = palette.id === global;
          return (
            <li key={palette.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => patch({ global: palette.id })}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-200",
                  active ? "border-[#ffd166]/70 bg-white/5" : "border-white/10 hover:border-white/25",
                )}
              >
                <span
                  aria-hidden="true"
                  className="h-9 w-9 shrink-0 rounded-full border border-white/15"
                  style={{
                    background: `conic-gradient(from 210deg, ${palette.swatch.bg} 0 40%, ${palette.swatch.paper} 40% 72%, ${palette.swatch.accent} 72% 100%)`,
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">{palette.label}</span>
                  <span className="block text-xs text-[#f2efe9]/50">{palette.note}</span>
                </span>
                {active ? <span className="shrink-0 text-xs text-[#ffd166]">сейчас</span> : null}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-start justify-between gap-3 border-t border-white/10 pt-4">
        <span className="min-w-0 flex-1">
          <span className="block text-sm">Своя палитра у раздела</span>
          <span className="mt-0.5 block text-xs leading-relaxed text-[#f2efe9]/50">
            На каждом разделе появятся образцы. Генплан можно оставить в песке,
            а подбор перевести в жемчуг.
          </span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={perSection}
          aria-label="Своя палитра у раздела"
          onClick={() => patch({ perSection: !perSection })}
          className={cn(
            "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
            perSection ? "bg-[#ffd166]" : "bg-white/15",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition-transform duration-200 motion-reduce:transition-none",
              perSection ? "translate-x-5 bg-[#0b0d10]" : "bg-[#f2efe9]",
            )}
          />
        </button>
      </div>

      {tuned ? (
        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="text-xs text-[#f2efe9]/50">Отличаются от общей:</p>
          <ul className="mt-2 space-y-1">
            {Object.entries(sections).map(([id, palette]) => (
              <li key={id} className="flex items-center justify-between gap-3 text-xs">
                <span className="min-w-0 truncate text-[#f2efe9]/80">{sectionLabel(id)}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="text-[#ffd166]">{paletteById(palette).label}</span>
                  <button
                    type="button"
                    onClick={() => patch({ sections: omit(state.sections, id) })}
                    aria-label={`${sectionLabel(id)}: вернуть общую палитру`}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[#f2efe9]/60 transition-colors hover:bg-white/10 hover:text-[#f2efe9]"
                  >
                    ×
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => patch({ sections: {} })}
            className="mt-3 w-full rounded-full border border-white/15 px-4 py-2 text-xs text-[#f2efe9]/80 transition-colors hover:border-white/40 hover:text-[#f2efe9]"
          >
            Вернуть все разделы к общей
          </button>
        </div>
      ) : null}
    </aside>
  );
}

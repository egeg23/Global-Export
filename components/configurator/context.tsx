"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Dock } from "@/components/configurator/dock";
import {
  adopt,
  clear,
  parse,
  patchSession,
  read,
  readOnServer,
  readSession,
  readSessionOnServer,
  subscribe,
  write,
} from "@/components/configurator/store";
import { cn } from "@/lib/cn";
import {
  addonOf,
  extrasOf,
  firstSharedPage,
  isIncluded as includedIn,
  pageOf,
  withToggled,
  type Catalog,
} from "@/lib/configurator/catalog";

/**
 * Конструктор сайта: тумблер в доке включает настоящий блок на странице.
 *
 * Механики, одно состояние:
 *
 *  1. Док внизу справа — блоки с тумблерами. Тумблер включён — блок
 *     смонтирован, страница подъезжает к нему и он пульсирует; выключен —
 *     блока нет. Никакой перезагрузки: это обычное состояние React.
 *  2. Метки на странице. Пока док открыт, каждый включённый блок носит ярлык
 *     с названием (и крестиком), а на месте выключенного стоит пунктирный
 *     «призрак» с кнопкой «включить». Закрыл док — сайт чистый.
 *  3. «Было / стало». У только что включённого блока — переключатель:
 *     «было» временно прячет его, не трогая набор, «стало» возвращает и
 *     заново проигрывает появление. Так сравнивают, не трогая тумблер.
 *  4. Перенос. Если блок живёт на другой странице (карточка ЖК, панель
 *     управления, соседняя концепция), конструктор сам переводит туда,
 *     оставляет док открытым и подъезжает к блоку.
 *  5. Ссылка. Набор лежит в адресе и в хранилище браузера: его можно
 *     отправить коллеге, и он переживает переходы между страницами.
 *  6. Бриф. Кнопка в доке отправляет собранный набор нам в Telegram и
 *     ведёт клиента к ассистенту в боте.
 *
 * Денег на странице нет нигде: витрина — публичное портфолио. Сумму брифа
 * сервер считает сам по прайсу, которого в браузере нет
 * (lib/configurator/prices.ts), и отдаёт её только студии.
 *
 * Проект описывается каталогом (lib/configurator/catalog.ts): один и тот же
 * док работает у MAVERA, ADAR и Global Export. Провайдер сам рисует корень
 * мира (`data-world`) и тумблер движения (`data-motion`), если каталог их
 * задаёт.
 */

export type Configurator = {
  catalog: Catalog;
  tier: string;
  page: string;
  hrefs: Record<string, string>;
  /** Что включено по тумблерам — это и уходит в бриф и в ссылку. */
  enabled: ReadonlySet<string>;
  /** Что показывается: то же, минус свежий допник, пока смотрим «было». */
  shown: ReadonlySet<string>;
  fresh: { id: string; at: number } | null;
  peek: boolean;
  open: boolean;
  /** Сколько включено сверх варианта. */
  extras: number;
  setOpen: (open: boolean) => void;
  setPeek: (peek: boolean) => void;
  toggle: (id: string) => void;
  reset: () => void;
  isIncluded: (id: string) => boolean;
  /** «в варианте» или «дополнительно» — одной строкой для ярлыков и дока. */
  statusLabel: (id: string) => string;
  /** Куда переводит тумблер, если блок живёт не на этой странице. */
  destination: (where: string) => string | null;
  /** Заголовок группы: «Главная», «Главная и карточка». */
  placeLabel: (where: string) => string;
};

const Context = createContext<Configurator | null>(null);

export function useConfigurator() {
  return useContext(Context);
}

/** Показан ли допник. Вне конструктора — всегда да: страница живёт как раньше. */
export function useAddon(id: string) {
  const ctx = useContext(Context);
  return ctx ? ctx.shown.has(id) : true;
}

export function ConfiguratorProvider({
  catalog,
  tier,
  page,
  hrefs,
  frame = "none",
  dock = true,
  children,
}: {
  catalog: Catalog;
  tier: string;
  page: string;
  /** Адреса страниц каталога: страница знает их сама, браузеру список проектов не нужен. */
  hrefs: Record<string, string>;
  /** «world» — корень мира сайта (data-world); «studio» — наша тёмная витрина; «none» — без атрибута. */
  frame?: "world" | "studio" | "none";
  /**
   * Показывать ли док с тумблерами. Экраны панели спрашивают у конструктора,
   * включены ли отдельные блоки, и провайдер им нужен, — но сам разговор о
   * тарифе идёт не везде, и тогда док в углу только сбивает.
   */
  dock?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, () => read(catalog.project, tier), readOnServer);
  const session = useSyncExternalStore(subscribe, readSession, readSessionOnServer);
  const enabled = useMemo(() => new Set(parse(raw, catalog, tier)), [raw, catalog, tier]);
  const shown = useMemo(() => {
    if (!session.peek || !session.fresh) return enabled;
    const next = new Set(enabled);
    next.delete(session.fresh.id);
    return next;
  }, [enabled, session.peek, session.fresh]);

  useEffect(() => adopt(catalog.project, tier), [catalog.project, tier]);

  const isIncluded = (id: string) => includedIn(catalog, tier, id);

  const destination = (where: string): string | null => {
    if (catalog.crossMounted) return null;
    if (catalog.everywhere && where === catalog.everywhere) {
      if (pageOf(catalog, page)?.shared !== false) return null;
      const first = firstSharedPage(catalog);
      return first ? (hrefs[first.id] ?? null) : null;
    }
    return where === page ? null : (hrefs[where] ?? null);
  };

  const placeLabel = (where: string): string => {
    if (catalog.everywhere && where === catalog.everywhere) {
      return catalog.everywhereLabel ?? firstSharedPage(catalog)?.label ?? "Везде";
    }
    return pageOf(catalog, where)?.label ?? where;
  };

  const value: Configurator = {
    catalog,
    tier,
    page,
    hrefs,
    enabled,
    shown,
    fresh: session.fresh,
    peek: session.peek,
    open: session.open,
    extras: extrasOf(catalog, tier, enabled).length,
    setOpen: (open) => patchSession({ open }),
    setPeek: (peek) => patchSession({ peek }),
    isIncluded,
    destination,
    placeLabel,
    statusLabel: (id) => (isIncluded(id) ? "в варианте" : "дополнительно"),
    toggle: (id) => {
      const next = withToggled(catalog, enabled, id);
      if (!next.has(id)) {
        patchSession({ fresh: null, peek: false });
        write(catalog, tier, next);
        return;
      }
      patchSession({ fresh: { id, at: Date.now() }, peek: false, open: true });
      write(catalog, tier, next);
      const target = destination(addonOf(catalog, id).where);
      if (target) router.push(target);
    },
    reset: () => {
      clear(catalog.project, tier);
      patchSession({ fresh: null, peek: false });
    },
  };

  const motion = catalog.motionAddon ? (shown.has(catalog.motionAddon) ? "on" : "off") : undefined;
  const withChat = catalog.chat && pageOf(catalog, page)?.shared !== false;

  return (
    <Context.Provider value={value}>
      <div data-world={frame === "world" ? tier : undefined} data-motion={motion}>
        {children}
        {withChat && catalog.chat ? (
          <Addon id={catalog.chat.id} inline scroll={false} className="fixed bottom-5 left-4 z-[60] sm:left-5">
            <ChatButton text={catalog.chat.text} site={catalog.chat.site} />
          </Addon>
        ) : null}
        {dock ? <Dock /> : null}
      </div>
    </Context.Provider>
  );
}

/** Последняя подсветка, которую уже показали: повторно к блоку не едем. */
let seenStamp = 0;

type Tag = "div" | "section" | "span" | "figure";

/**
 * Обёртка блока, которым управляет тумблер.
 *
 * Включён — рисует детей (и ярлык, пока док открыт). Выключен — либо ничего,
 * либо «призрак» на том же месте, если док открыт. Только что включённый блок
 * подъезжает в кадр и пульсирует; при загрузке страницы с готовым набором
 * ничего не подъезжает — подсветка отвечает на действие, а не на состояние.
 *
 * `flag` — для допников, которые меняют блок, а не добавляют его (живой
 * первый экран, магнитные кнопки): дети рисуются всегда, ярлык показывает
 * состояние и даёт включить или выключить на месте.
 */
export function Addon({
  id,
  children,
  className,
  as = "div",
  inline = false,
  compact = false,
  flag = false,
  scroll = true,
  anchor,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  /** HTML-id обёртки — для якорных ссылок из меню. */
  anchor?: string;
  /** Маленький элемент в строке — пилюля языка, кнопка: ярлык и призрак встают рядом. */
  inline?: boolean;
  /** Низкий призрак — когда на месте блока остаётся замена, а не пустота. */
  compact?: boolean;
  /** Дети рисуются всегда; ярлык только помечает и переключает. */
  flag?: boolean;
  /** Подъезжать ли к блоку: для прилипшей шапки и плавающей кнопки не нужно. */
  scroll?: boolean;
}) {
  const ctx = useContext(Context);
  const ref = useRef<HTMLElement>(null);
  const on = ctx ? ctx.shown.has(id) : true;
  const isFresh = ctx?.fresh?.id === id;
  const stamp = isFresh && ctx.fresh ? ctx.fresh.at : 0;
  const prevOn = useRef(on);
  const peeking = Boolean(ctx && isFresh && ctx.peek && ctx.enabled.has(id));

  useEffect(() => {
    const node = ref.current;
    const returned = !prevOn.current && on;
    prevOn.current = on;
    if (!stamp || !on || !node) return;

    const unseen = stamp !== seenStamp;
    if (!unseen && !returned) return;
    seenStamp = stamp;

    node.classList.add("w-tag-pulse");
    const done = (event: AnimationEvent) => {
      if (event.animationName === "w-tag-pulse") node.classList.remove("w-tag-pulse");
    };
    node.addEventListener("animationend", done);

    // К блоку едем один раз и чуть позже монтирования: после перехода на
    // другую страницу картинкам нужно мгновение, чтобы занять место.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer =
      scroll && unseen
        ? window.setTimeout(
            () => node.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }),
            160,
          )
        : 0;

    return () => {
      window.clearTimeout(timer);
      node.removeEventListener("animationend", done);
      node.classList.remove("w-tag-pulse");
    };
  }, [stamp, on, scroll]);

  if (!ctx) return <>{children}</>;

  const Tag = as as React.ElementType;
  const spec = addonOf(ctx.catalog, id);
  // Плавающая кнопка чата приходит с `fixed`: своё `relative` обёртка тогда не
  // ставит, иначе кнопка легла бы в поток в конце страницы.
  const positioned = /\b(fixed|absolute|sticky)\b/.test(className ?? "");
  const label = (
    <>
      <span className="min-w-0 truncate">{spec.label}</span>
      <span className="shrink-0 text-[#ffd166]">{ctx.statusLabel(id)}</span>
    </>
  );

  if (flag) {
    const raw = ctx.enabled.has(id);
    return (
      <Tag
        ref={ref}
        id={anchor}
        data-addon={id}
        data-addon-on={raw ? "true" : "false"}
        className={cn(positioned ? null : "relative", "scroll-mt-[16vh]", inline ? "inline-block max-w-full align-middle" : "block", className)}
      >
        {children}
        {ctx.open ? (
          <span className={cn(chipClass, inline ? "ml-2 max-w-[16rem] align-middle" : "absolute -top-3 left-2 max-w-[calc(100%-1rem)]")}>
            {label}
            {raw ? (
              <>
                {isFresh ? <Compare /> : null}
                <Off id={id} label={spec.label} />
              </>
            ) : (
              <button
                type="button"
                onClick={() => ctx.toggle(id)}
                className="shrink-0 rounded-full bg-[#ffd166] px-2 py-0.5 text-[0.68rem] font-medium text-[#0b0d10]"
              >
                включить
              </button>
            )}
          </span>
        ) : null}
      </Tag>
    );
  }

  if (peeking) {
    return (
      <Tag
        id={anchor}
        data-addon-peek={id}
        className={cn(
          "w-ghost items-center justify-center",
          inline ? "inline-flex align-middle" : "flex min-h-[3.5rem] w-full",
          className,
        )}
      >
        <span className="m-2 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full bg-[#0b0d10] py-1.5 pl-4 pr-1.5 text-sm font-normal normal-case tracking-normal text-[#f2efe9] shadow-lg ring-1 ring-white/10">
          <span>
            Было: без «{spec.label}»
          </span>
          <Compare />
        </span>
      </Tag>
    );
  }

  if (!on) {
    if (!ctx.open) return null;
    return (
      <Tag
        id={anchor}
        data-addon-ghost={id}
        className={cn(
          "w-ghost items-center justify-center",
          inline ? "inline-flex align-middle" : compact ? "flex min-h-[3.5rem] w-full" : "flex min-h-[7rem] w-full",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => ctx.toggle(id)}
          className="m-2 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full bg-[#0b0d10] px-4 py-2 text-sm font-normal normal-case tracking-normal text-[#f2efe9] shadow-lg ring-1 ring-white/10 transition-transform duration-200 hover:scale-[1.03] motion-reduce:transform-none"
        >
          <span>+ {spec.label}</span>
          <span className="text-[#ffd166]">{ctx.statusLabel(id)}</span>
          <span className="text-xs text-[#f2efe9]/55">— включить</span>
        </button>
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      id={anchor}
      data-addon={id}
      className={cn(
        positioned ? null : "relative",
        "scroll-mt-[16vh]",
        inline ? "inline-block max-w-full align-middle" : "block",
        stamp ? "w-row" : null,
        className,
      )}
    >
      {children}
      {ctx.open ? (
        <span className={cn(chipClass, inline ? "ml-2 max-w-[16rem] align-middle" : "absolute -top-3 left-2 max-w-[calc(100%-1rem)]")}>
          {label}
          {isFresh ? <Compare /> : null}
          <Off id={id} label={spec.label} />
        </span>
      ) : null}
    </Tag>
  );
}

const chipClass =
  "z-20 inline-flex items-center gap-2 rounded-full bg-[#0b0d10] py-1 pl-3 pr-1 text-xs font-normal normal-case tracking-normal text-[#f2efe9] shadow-lg ring-1 ring-white/10";

function Off({ id, label }: { id: string; label: string }) {
  const ctx = useContext(Context);
  if (!ctx) return null;
  return (
    <button
      type="button"
      onClick={() => ctx.toggle(id)}
      aria-label={`Выключить: ${label}`}
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#f2efe9]/70 transition-colors hover:bg-white/10 hover:text-[#f2efe9]"
    >
      ×
    </button>
  );
}

/**
 * «Было / стало» — сравнение на месте.
 *
 * «Было» прячет свежий блок, не трогая тумблер и набор; «стало» возвращает и
 * заново проигрывает появление. Одна и та же кнопка стоит на ярлыке блока,
 * на его заглушке и в строке дока — куда бы ни смотрел заказчик.
 */
export function Compare({ className }: { className?: string }) {
  const ctx = useContext(Context);
  if (!ctx) return null;

  const option = (active: boolean) =>
    cn(
      "rounded-full px-2 py-0.5 text-[0.68rem] font-medium transition-colors duration-200",
      active ? "bg-[#f2efe9] text-[#0b0d10]" : "text-[#f2efe9]/60 hover:text-[#f2efe9]",
    );

  return (
    <span role="group" aria-label="Сравнить" className={cn("inline-flex shrink-0 rounded-full bg-white/10 p-0.5", className)}>
      <button type="button" aria-pressed={ctx.peek} onClick={() => ctx.setPeek(true)} className={option(ctx.peek)}>
        Было
      </button>
      <button type="button" aria-pressed={!ctx.peek} onClick={() => ctx.setPeek(false)} className={option(!ctx.peek)}>
        Стало
      </button>
    </span>
  );
}

/**
 * Плавающая кнопка мессенджера — допник «Чат».
 *
 * Нажатие открывает выбор: WhatsApp или Telegram. Ссылки настоящие — без
 * номера отдела продаж мессенджер предложит выбрать, кому писать, а номер и
 * аккаунт подставятся из настроек панели. Заглушечный номер сюда не ставим:
 * он бы вёл к случайному человеку.
 */
function ChatButton({ text, site }: { text: string; site: string }) {
  const [open, setOpen] = useState(false);
  const encoded = encodeURIComponent(text);

  return (
    <div className="relative">
      {open ? (
        <div
          role="dialog"
          aria-label="Написать в мессенджер"
          className="mv-fade absolute bottom-16 left-0 w-64 rounded-2xl bg-[#0b0d10] p-3 text-[#f2efe9] shadow-2xl ring-1 ring-white/10"
        >
          <p className="px-2 pb-2 text-xs text-[#f2efe9]/60">Отдел продаж отвечает с 9:00 до 19:00</p>
          <a
            href={`https://wa.me/?text=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/10"
          >
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#25d366]" />
            WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(site)}&text=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/10"
          >
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#2aabee]" />
            Telegram
          </a>
          <p className="px-2 pt-2 text-[0.68rem] leading-relaxed text-[#f2efe9]/45">
            Номер и аккаунт отдела продаж задаются в панели управления.
          </p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Чат WhatsApp / Telegram"
        title="Чат WhatsApp / Telegram"
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-10px_rgba(37,211,102,0.8)] transition-transform duration-200 hover:scale-105 motion-reduce:transform-none"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L4 21l1.6-4.4A8.5 8.5 0 1 1 21 12Z" />
          <path d="M9 10h.01M12 10h.01M15 10h.01" />
        </svg>
      </button>
    </div>
  );
}

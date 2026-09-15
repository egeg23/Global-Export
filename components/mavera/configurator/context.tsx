"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from "react";

import { Dock } from "@/components/mavera/configurator/dock";
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
} from "@/components/mavera/configurator/store";
import { money, tiers, type CurrencyId, type TierId } from "@/components/present/mavera/theme";
import { addonById, addons, included, type AddonId, type AddonWhere } from "@/content/mavera/addons";
import { projects } from "@/content/mavera/data";
import { cn } from "@/lib/cn";

/**
 * Конструктор сайта: тумблер в доке включает настоящий блок на странице.
 *
 * Механики, одно состояние:
 *
 *  1. Док внизу справа — допники с ценой и итогом. Тумблер включён — блок
 *     смонтирован, страница подъезжает к нему и он пульсирует; выключен —
 *     блока нет. Никакой перезагрузки: это обычное состояние React.
 *  2. Метки на странице. Пока док открыт, каждый включённый блок носит ярлык
 *     с названием и ценой (и крестиком), а на месте выключенного стоит
 *     пунктирный «призрак» с кнопкой «включить». Закрыл док — сайт чистый.
 *  3. «Было / стало». У только что включённого блока — переключатель:
 *     «было» временно прячет его, не меняя цену, «стало» возвращает и заново
 *     проигрывает появление. Так сравнивают, не трогая тумблер.
 *  4. Перенос. Если блок живёт на другой странице (карточка ЖК, панель
 *     управления), конструктор сам переводит туда, оставляет док открытым и
 *     подъезжает к блоку.
 *  5. Ссылка. Набор лежит в адресе и в хранилище браузера: его можно
 *     отправить коллеге, и он переживает переходы между страницами.
 *
 * Провайдер сам рисует корень мира (`data-world`) и тумблер движения
 * (`data-motion`): так «Анимации и параллакс» отключаются одним атрибутом.
 */

export type Page = "main" | "object" | "admin";

export type Configurator = {
  tier: TierId;
  page: Page;
  homeHref: string;
  objectHref: string;
  adminHref: string;
  /** Что включено по тумблерам — от этого считается цена. */
  enabled: ReadonlySet<AddonId>;
  /** Что показывается: то же, минус свежий допник, пока смотрим «было». */
  shown: ReadonlySet<AddonId>;
  fresh: { id: AddonId; at: number } | null;
  peek: boolean;
  open: boolean;
  currency: CurrencyId;
  packageUsd: number;
  extrasUsd: number;
  totalUsd: number;
  setOpen: (open: boolean) => void;
  setPeek: (peek: boolean) => void;
  setCurrency: (currency: CurrencyId) => void;
  toggle: (id: AddonId) => void;
  reset: () => void;
  isIncluded: (id: AddonId) => boolean;
  /** «в пакете» или «+$500» — одной строкой для ярлыков и дока. */
  priceLabel: (id: AddonId) => string;
  /** Куда переводит тумблер, если блок живёт не на этой странице. */
  destination: (where: AddonWhere) => string | null;
};

const Context = createContext<Configurator | null>(null);

export function useConfigurator() {
  return useContext(Context);
}

/** Показан ли допник. Вне конструктора — всегда да: страница живёт как раньше. */
export function useAddon(id: AddonId) {
  const ctx = useContext(Context);
  return ctx ? ctx.shown.has(id) : true;
}

export function ConfiguratorProvider({
  tier,
  page,
  frame = "world",
  children,
}: {
  tier: TierId;
  page: Page;
  /** «world» — корень мира сайта; «studio» — наша тёмная витрина без токенов мира. */
  frame?: "world" | "studio";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, () => read(tier), readOnServer);
  const session = useSyncExternalStore(subscribe, readSession, readSessionOnServer);
  const enabled = useMemo(() => new Set(parse(raw, tier)), [raw, tier]);
  const shown = useMemo(() => {
    if (!session.peek || !session.fresh) return enabled;
    const next = new Set(enabled);
    next.delete(session.fresh.id);
    return next;
  }, [enabled, session.peek, session.fresh]);
  const currency = useSyncExternalStore(subscribe, readCurrency, () => "usd" as CurrencyId);

  useEffect(() => adopt(tier), [tier]);

  const homeHref = `/mavera/${tier}`;
  // Куда вести с главной, если блок живёт в карточке ЖК: в первый проект.
  const objectHref = `${homeHref}/${projects[0].slug}`;
  const adminHref = `${homeHref}/admin`;
  const packageUsd = (tiers.find((entry) => entry.id === tier) ?? tiers[0]).priceUsd;

  const isIncluded = (id: AddonId) => included[tier].includes(id);
  const extrasUsd = addons
    .filter((addon) => enabled.has(addon.id) && !isIncluded(addon.id))
    .reduce((sum, addon) => sum + addon.priceUsd, 0);

  const destination = (where: AddonWhere): string | null => {
    if (where === "main") return page === "main" ? null : homeHref;
    if (where === "object") return page === "object" ? null : objectHref;
    if (where === "admin") return page === "admin" ? null : adminHref;
    return page === "admin" ? homeHref : null;
  };

  const value: Configurator = {
    tier,
    page,
    homeHref,
    objectHref,
    adminHref,
    enabled,
    shown,
    fresh: session.fresh,
    peek: session.peek,
    open: session.open,
    currency,
    packageUsd,
    extrasUsd,
    totalUsd: packageUsd + extrasUsd,
    setOpen: (open) => patchSession({ open }),
    setPeek: (peek) => patchSession({ peek }),
    setCurrency: writeCurrency,
    isIncluded,
    destination,
    priceLabel: (id) => {
      const addon = addonById(id);
      if (isIncluded(id) || addon.priceUsd === 0) return "в пакете";
      return `+${money(addon.priceUsd, currency)}`;
    },
    toggle: (id) => {
      const next = new Set(enabled);
      if (next.has(id)) {
        next.delete(id);
        patchSession({ fresh: null, peek: false });
        write(tier, next);
        return;
      }
      next.add(id);
      patchSession({ fresh: { id, at: Date.now() }, peek: false, open: true });
      write(tier, next);
      const target = destination(addonById(id).where);
      if (target) router.push(target);
    },
    reset: () => {
      clear(tier);
      patchSession({ fresh: null, peek: false });
    },
  };

  const motion = shown.has("motion") ? "on" : "off";

  return (
    <Context.Provider value={value}>
      <div data-world={frame === "world" ? tier : undefined} data-motion={motion}>
        {children}
        {page === "admin" ? null : (
          <Addon id="chat" inline scroll={false} className="fixed bottom-5 left-4 z-[60] sm:left-5">
            <ChatButton />
          </Addon>
        )}
        <Dock />
      </div>
    </Context.Provider>
  );
}

/* Валюта дока — тоже в памяти модуля: переживает переход между страницами. */
let currencyState: CurrencyId = "usd";
function readCurrency() {
  return currencyState;
}
function writeCurrency(currency: CurrencyId) {
  currencyState = currency;
  patchSession({});
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
}: {
  id: AddonId;
  children: React.ReactNode;
  className?: string;
  as?: Tag;
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
  const spec = addonById(id);
  const label = (
    <>
      <span className="min-w-0 truncate">{spec.label}</span>
      <span className="shrink-0 tabular-nums text-[#ffd166]">{ctx.priceLabel(id)}</span>
    </>
  );

  if (flag) {
    const raw = ctx.enabled.has(id);
    return (
      <Tag
        ref={ref}
        data-addon={id}
        data-addon-on={raw ? "true" : "false"}
        className={cn("relative scroll-mt-[16vh]", inline ? "inline-block max-w-full align-middle" : "block", className)}
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
          <span className="tabular-nums text-[#ffd166]">{ctx.priceLabel(id)}</span>
          <span className="text-xs text-[#f2efe9]/55">— включить</span>
        </button>
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      data-addon={id}
      className={cn(
        "relative scroll-mt-[16vh]",
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

function Off({ id, label }: { id: AddonId; label: string }) {
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
 * «Было» прячет свежий блок, не трогая тумблер и цену; «стало» возвращает и
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

/** Плавающая кнопка мессенджера — допник «Чат». */
function ChatButton() {
  return (
    <span
      role="img"
      aria-label="Чат WhatsApp / Telegram"
      title="Чат WhatsApp / Telegram"
      className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-10px_rgba(37,211,102,0.8)]"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L4 21l1.6-4.4A8.5 8.5 0 1 1 21 12Z" />
        <path d="M9 10h.01M12 10h.01M15 10h.01" />
      </svg>
    </span>
  );
}

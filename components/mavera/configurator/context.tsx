"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { Dock } from "@/components/mavera/configurator/dock";
import { adopt, clear, parse, read, readOnServer, subscribe, write } from "@/components/mavera/configurator/store";
import { money, tiers, type CurrencyId, type TierId } from "@/components/present/mavera/theme";
import { addonById, addons, included, type AddonId } from "@/content/mavera/addons";
import { projects } from "@/content/mavera/data";
import { cn } from "@/lib/cn";

/**
 * Конструктор сайта: тумблер в доке включает настоящий блок на странице.
 *
 * Три механики, одно состояние:
 *
 *  1. Док внизу справа — список допников с ценой и итогом. Тумблер включён —
 *     блок смонтирован, страница подъезжает к нему и он пульсирует; выключен —
 *     блока нет. Никакой перезагрузки: это обычное состояние React.
 *  2. Метки на странице. Пока док открыт, каждый включённый блок носит ярлык
 *     с названием и ценой (и крестиком), а на месте выключенного стоит
 *     пунктирный «призрак» с кнопкой «включить». Закрыл док — сайт чистый,
 *     каким его увидит покупатель.
 *  3. Ссылка. Набор лежит в адресе и в хранилище браузера: его можно отправить
 *     коллеге, и он переживает переход с главной в карточку ЖК.
 *
 * Провайдер сам рисует корень мира (`data-world`) и тумблер движения
 * (`data-motion`): так «Анимации и параллакс» отключаются одним атрибутом.
 */

export type Page = "main" | "object";

type Fresh = { id: AddonId; at: number } | null;

export type Configurator = {
  tier: TierId;
  page: Page;
  homeHref: string;
  objectHref: string;
  enabled: ReadonlySet<AddonId>;
  /** Что включили последним — его блок подсвечивается и подъезжает. */
  fresh: Fresh;
  open: boolean;
  currency: CurrencyId;
  packageUsd: number;
  extrasUsd: number;
  totalUsd: number;
  setOpen: (open: boolean) => void;
  setCurrency: (currency: CurrencyId) => void;
  toggle: (id: AddonId) => void;
  reset: () => void;
  isIncluded: (id: AddonId) => boolean;
  /** «в пакете» или «+$500» — одной строкой для ярлыков и дока. */
  priceLabel: (id: AddonId) => string;
};

const Context = createContext<Configurator | null>(null);

export function useConfigurator() {
  return useContext(Context);
}

/** Включён ли допник. Вне конструктора — всегда да: страница живёт как раньше. */
export function useAddon(id: AddonId) {
  const ctx = useContext(Context);
  return ctx ? ctx.enabled.has(id) : true;
}

export function ConfiguratorProvider({
  tier,
  page,
  children,
}: {
  tier: TierId;
  page: Page;
  children: React.ReactNode;
}) {
  const packageUsd = (tiers.find((entry) => entry.id === tier) ?? tiers[0]).priceUsd;
  // Куда вести с главной, если блок живёт в карточке ЖК: в первый проект.
  const objectHref = `/mavera/${tier}/${projects[0].slug}`;

  const raw = useSyncExternalStore(subscribe, () => read(tier), readOnServer);
  const enabled = useMemo(() => new Set(parse(raw, tier)), [raw, tier]);
  const [fresh, setFresh] = useState<Fresh>(null);
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyId>("usd");

  useEffect(() => adopt(tier), [tier]);

  const isIncluded = (id: AddonId) => included[tier].includes(id);
  const extrasUsd = addons
    .filter((addon) => enabled.has(addon.id) && !isIncluded(addon.id))
    .reduce((sum, addon) => sum + addon.priceUsd, 0);

  const value: Configurator = {
    tier,
    page,
    homeHref: `/mavera/${tier}`,
    objectHref,
    enabled,
    fresh,
    open,
    currency,
    packageUsd,
    extrasUsd,
    totalUsd: packageUsd + extrasUsd,
    setOpen,
    setCurrency,
    isIncluded,
    priceLabel: (id) => {
      const addon = addonById(id);
      if (isIncluded(id) || addon.priceUsd === 0) return "в пакете";
      return `+${money(addon.priceUsd, currency)}`;
    },
    toggle: (id) => {
      const next = new Set(enabled);
      if (next.has(id)) {
        next.delete(id);
        setFresh(null);
      } else {
        next.add(id);
        setFresh({ id, at: Date.now() });
      }
      write(tier, next);
    },
    reset: () => {
      clear(tier);
      setFresh(null);
    },
  };

  return (
    <Context.Provider value={value}>
      <div data-world={tier} data-motion={enabled.has("motion") ? "on" : "off"}>
        {children}
        <Addon id="chat" inline scroll={false} className="fixed bottom-5 left-4 z-[60] sm:left-5">
          <ChatButton />
        </Addon>
        <Dock />
      </div>
    </Context.Provider>
  );
}

type Tag = "div" | "section" | "span" | "figure";

/**
 * Обёртка блока, которым управляет тумблер.
 *
 * Включён — рисует детей (и ярлык, пока док открыт). Выключен — либо ничего,
 * либо «призрак» на том же месте, если док открыт. Только что включённый блок
 * подъезжает в кадр и пульсирует; при загрузке страницы с готовым набором
 * ничего не подъезжает — подсветка отвечает на действие, а не на состояние.
 */
export function Addon({
  id,
  children,
  className,
  as = "div",
  inline = false,
  compact = false,
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
  /** Подъезжать ли к блоку: для прилипшей шапки и плавающей кнопки не нужно. */
  scroll?: boolean;
}) {
  const ctx = useContext(Context);
  const ref = useRef<HTMLElement>(null);
  const on = ctx ? ctx.enabled.has(id) : true;
  const stamp = ctx?.fresh?.id === id ? ctx.fresh.at : 0;

  useEffect(() => {
    const node = ref.current;
    if (!stamp || !on || !node) return;

    node.classList.add("w-tag-pulse");
    const done = (event: AnimationEvent) => {
      if (event.animationName === "w-tag-pulse") node.classList.remove("w-tag-pulse");
    };
    node.addEventListener("animationend", done);

    if (scroll) {
      const top = node.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.16;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(top, 0), behavior: reduce ? "auto" : "smooth" });
    }

    return () => {
      node.removeEventListener("animationend", done);
      node.classList.remove("w-tag-pulse");
    };
  }, [stamp, on, scroll]);

  if (!ctx) return <>{children}</>;

  const Tag = as as React.ElementType;
  const spec = addonById(id);

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
        "relative",
        inline ? "inline-block max-w-full align-middle" : "block",
        stamp ? "w-row" : null,
        className,
      )}
    >
      {children}
      {ctx.open ? (
        <span
          className={cn(
            "z-20 inline-flex items-center gap-2 rounded-full bg-[#0b0d10] py-1 pl-3 pr-1 text-xs font-normal normal-case tracking-normal text-[#f2efe9] shadow-lg ring-1 ring-white/10",
            inline ? "ml-2 max-w-[14rem] align-middle" : "absolute -top-3 right-2 max-w-[calc(100%-1rem)]",
          )}
        >
          <span className="min-w-0 truncate">{spec.label}</span>
          <span className="shrink-0 tabular-nums text-[#ffd166]">{ctx.priceLabel(id)}</span>
          <button
            type="button"
            onClick={() => ctx.toggle(id)}
            aria-label={`Выключить: ${spec.label}`}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#f2efe9]/70 transition-colors hover:bg-white/10 hover:text-[#f2efe9]"
          >
            ×
          </button>
        </span>
      ) : null}
    </Tag>
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

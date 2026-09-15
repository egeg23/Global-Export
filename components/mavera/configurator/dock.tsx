"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Compare, useConfigurator } from "@/components/mavera/configurator/context";
import { shareUrl, write } from "@/components/mavera/configurator/store";
import { useCountUp, useMotionPreferred } from "@/components/mavera/motion";
import { currencies, money, rateNote, tiers } from "@/components/present/mavera/theme";
import { addons, type Addon, type AddonWhere } from "@/content/mavera/addons";
import { cn } from "@/lib/cn";

/**
 * Док конструктора: свёрнут — пилюля с итогом, развёрнут — тумблеры.
 *
 * Оформление намеренно не из мира сайта: тёмная плашка с жёлтой ценой одна и
 * та же на белом «Стандарте», бумажном «Люксе» и тёмном «Премиуме». Это наш
 * инструмент, а не часть сайта, и выглядеть он должен как инструмент.
 *
 * Допники сгруппированы по месту: сначала то, что живёт на этой странице,
 * потом остальное. Тумблер из другой группы сам переводит на нужную страницу.
 */

const placeLabel: Record<AddonWhere, string> = {
  main: "Главная",
  object: "Карточка ЖК",
  both: "Главная и карточка",
  admin: "Панель управления",
};

export function Dock() {
  const ctx = useConfigurator();
  const motion = useMotionPreferred();
  const total = useCountUp(ctx?.totalUsd ?? 0, motion, 600);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!ctx?.open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") ctx.setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ctx]);

  if (!ctx) return null;

  const tier = tiers.find((entry) => entry.id === ctx.tier) ?? tiers[0];
  const extrasOn = addons.filter((addon) => ctx.enabled.has(addon.id) && !ctx.isIncluded(addon.id)).length;

  if (!ctx.open) {
    return (
      <button
        type="button"
        onClick={() => ctx.setOpen(true)}
        aria-expanded={false}
        className="w-dock-in fixed bottom-5 right-4 z-[70] flex items-center gap-3 rounded-full bg-[#0b0d10] py-3 pl-4 pr-5 text-sm text-[#f2efe9] shadow-2xl ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transform-none sm:right-5"
      >
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#ffd166]" />
        <span>Конструктор</span>
        <span className="tabular-nums text-[#ffd166]">{money(total, ctx.currency)}</span>
        {extrasOn ? (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-[#f2efe9]/70">
            +{extrasOn}
          </span>
        ) : null}
      </button>
    );
  }

  const order: AddonWhere[] =
    ctx.page === "main"
      ? ["main", "both", "object", "admin"]
      : ctx.page === "object"
        ? ["object", "both", "main", "admin"]
        : ["admin", "main", "both", "object"];

  const copy = async () => {
    // Ссылка несёт набор всегда — даже если его читали из хранилища.
    write(ctx.tier, ctx.enabled);
    try {
      await navigator.clipboard.writeText(shareUrl(ctx.enabled));
      setCopied(true);
    } catch {
      window.prompt("Скопируйте ссылку", shareUrl(ctx.enabled));
    }
  };

  return (
    <aside
      role="dialog"
      aria-label="Конструктор сайта"
      className="w-dock-in fixed inset-x-0 bottom-0 z-[70] flex max-h-[64svh] flex-col rounded-t-2xl bg-[#0b0d10] text-[#f2efe9] shadow-2xl ring-1 ring-white/10 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[25rem] sm:max-h-[min(82vh,46rem)] sm:rounded-2xl"
    >
      <header className="flex items-start justify-between gap-4 px-5 pt-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#ffd166]">Конструктор</p>
          <h2 className="mt-1 text-base font-medium">Что войдёт в сайт «{tier.label}»</h2>
          <p className="mt-1 hidden text-xs leading-relaxed text-[#f2efe9]/55 sm:block">
            Включите — блок появится на странице, а цена пересчитается. Если
            блок живёт на другой странице, откроется она. У свежего блока есть
            «было / стало».
          </p>
        </div>
        <button
          type="button"
          onClick={() => ctx.setOpen(false)}
          aria-label="Свернуть конструктор"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#f2efe9]/60 transition-colors hover:bg-white/10 hover:text-[#f2efe9]"
        >
          ×
        </button>
      </header>

      <div className="mt-3 flex items-center justify-between gap-4 border-y border-white/10 px-5 py-2.5">
        <span className="text-xs text-[#f2efe9]/55">Валюта</span>
        <div role="group" aria-label="Валюта" className="flex rounded-full bg-white/5 p-0.5">
          {currencies.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={ctx.currency === entry.id}
              aria-label={entry.name}
              onClick={() => ctx.setCurrency(entry.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200",
                ctx.currency === entry.id ? "bg-[#f2efe9] text-[#0b0d10]" : "text-[#f2efe9]/65 hover:text-[#f2efe9]",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
        {order.map((where) => (
          <Group key={where} where={where} />
        ))}
      </div>

      <footer className="border-t border-white/10 px-5 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-[#f2efe9]/60">Итого</span>
          <span className="text-2xl font-semibold tabular-nums">{money(total, ctx.currency)}</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[#f2efe9]/45">
          Пакет {money(ctx.packageUsd, ctx.currency)}
          {ctx.extrasUsd ? <> + допники {money(ctx.extrasUsd, ctx.currency)}</> : null}
          {ctx.currency === "usd" ? null : <>. {rateNote}</>}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="flex-1 rounded-full bg-[#ffd166] px-4 py-2.5 text-sm font-medium text-[#0b0d10] transition-opacity hover:opacity-90"
          >
            {copied ? "Скопировано" : "Скопировать ссылку"}
          </button>
          <button
            type="button"
            onClick={ctx.reset}
            className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-[#f2efe9]/80 transition-colors hover:border-white/40 hover:text-[#f2efe9]"
          >
            Сбросить
          </button>
        </div>
      </footer>
    </aside>
  );
}

function Group({ where }: { where: AddonWhere }) {
  const ctx = useConfigurator();
  if (!ctx) return null;

  const items = addons
    .filter((addon) => addon.where === where)
    .sort((a, b) => Number(ctx.isIncluded(a.id)) - Number(ctx.isIncluded(b.id)));
  if (items.length === 0) return null;

  const target = ctx.destination(where);

  return (
    <section className="py-2">
      <h3 className="flex items-baseline justify-between gap-3 text-[0.65rem] uppercase tracking-[0.16em] text-[#f2efe9]/45">
        <span>{placeLabel[where]}</span>
        <span className="normal-case tracking-normal">{target ? "тумблер переведёт туда" : "на этой странице"}</span>
      </h3>
      <ul className="mt-1 divide-y divide-white/5">
        {items.map((addon) => (
          <Row key={addon.id} addon={addon} target={target} />
        ))}
      </ul>
    </section>
  );
}

function Row({ addon, target }: { addon: Addon; target: string | null }) {
  const ctx = useConfigurator();
  if (!ctx) return null;

  const on = ctx.enabled.has(addon.id);
  const isFresh = ctx.fresh?.id === addon.id;
  const free = ctx.isIncluded(addon.id) || addon.priceUsd === 0;

  return (
    <li className="flex items-start gap-3 py-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={addon.label}
        onClick={() => ctx.toggle(addon.id)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          on ? "bg-[#ffd166]" : "bg-white/15",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition-transform duration-200 motion-reduce:transition-none",
            on ? "translate-x-5 bg-[#0b0d10]" : "bg-[#f2efe9]",
          )}
        />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className={cn("text-sm", on ? "text-[#f2efe9]" : "text-[#f2efe9]/75")}>{addon.label}</span>
          <span className={cn("shrink-0 text-xs tabular-nums", free ? "text-[#f2efe9]/40" : "text-[#ffd166]")}>
            {ctx.priceLabel(addon.id)}
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-[#f2efe9]/50">{addon.effect}</p>
        {on && isFresh ? (
          <div className="mt-1.5 flex items-center gap-2 text-xs text-[#f2efe9]/50">
            <span>Сравнить:</span>
            <Compare />
          </div>
        ) : null}
        {target && on ? (
          <Link
            href={target}
            prefetch={false}
            className="mt-1 inline-block text-xs text-[#ffd166]/85 underline decoration-dotted underline-offset-2 transition-colors hover:text-[#ffd166]"
          >
            открыть {placeLabel[addon.where === "both" ? "main" : addon.where].toLowerCase()} →
          </Link>
        ) : null}
      </div>
    </li>
  );
}

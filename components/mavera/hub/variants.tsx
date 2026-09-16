"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Rise } from "@/components/mavera/reveal";
import { currencies, moneyParts, rateNote, tiers, type CurrencyId, type TierId } from "@/components/present/mavera/theme";
import { cn } from "@/lib/cn";

/** Как выглядит вариант на превью и куда ведёт. */
const cards: Record<TierId, { href: string; photo: string; school: string; motion: string }> = {
  standard: {
    href: "/mavera/standard",
    photo: "/images/mavera/hero-catalog.jpg",
    school: "Швейцарская школа",
    motion: "Движение: нет — анимации подключаются тумблером",
  },
  lux: {
    href: "/mavera/lux",
    photo: "/images/mavera/hero-editorial.jpg",
    school: "Журнальный разворот",
    motion: "Движение: всплытие и параллакс кадров",
  },
  premium: {
    href: "/mavera/premium",
    photo: "/images/mavera/hero-cinema.jpg",
    school: "Светлый зал",
    motion: "Движение: сцены, слои, счётчики, рабочие экраны",
  },
};

export function VariantCards() {
  const [currency, setCurrency] = useState<CurrencyId>("usd");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-sand-300/60">
          Цена, срок и состав работ — по каждому варианту. Валюта переключается.
        </p>

        <div role="group" aria-label="Валюта" className="flex rounded-full border border-sand-50/12 p-1">
          {currencies.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={currency === entry.id}
              aria-label={entry.name}
              onClick={() => setCurrency(entry.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300",
                currency === entry.id ? "bg-sand-50 text-forest-950" : "text-sand-200/70 hover:text-sand-50",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-10 grid gap-8 lg:grid-cols-3">
        {tiers.map((tier, index) => {
          const card = cards[tier.id];
          const price = moneyParts(tier.priceUsd, currency);

          return (
            <Rise as="li" key={tier.id} delay={index * 90}>
              <Link
                href={card.href}
                prefetch={false}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-sand-50/12 bg-forest-950 transition-colors duration-500 hover:border-harvest-300/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={card.photo}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transform-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/30 to-transparent" />
                  <span className="absolute bottom-4 left-5 text-[0.7rem] uppercase tracking-[0.2em] text-harvest-300">
                    {card.school}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl text-sand-50">{tier.label}</h3>
                    <p className="flex items-baseline gap-1.5">
                      <span className="font-display text-2xl text-sand-50">{price.value}</span>
                      <span className="text-xs text-sand-200/70">{price.unit}</span>
                    </p>
                  </div>

                  <p className="mt-2 text-xs text-sand-300/55">
                    {tier.duration} · {tier.hours}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-sand-200/75">{tier.note}</p>

                  <ul className="mt-5 space-y-2">
                    {tier.includes.slice(0, 3).map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.82rem] leading-relaxed text-sand-300/65">
                        <span aria-hidden="true" className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-harvest-300" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-xs text-sand-300/45">{card.motion}</p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-harvest-300">
                    Открыть сайт целиком
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </Rise>
          );
        })}
      </ul>

      <p className="mt-6 text-xs leading-relaxed text-sand-300/45">
        Цены пакетов без допников.{currency === "usd" ? null : <> Договор считается в долларах. {rateNote}.</>}
      </p>

      <Rise delay={120} className="mt-8 flex flex-col gap-4 rounded-card border border-harvest-300/30 bg-forest-950 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-7">
        <span
          aria-hidden="true"
          className="inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#0b0d10] py-2.5 pl-4 pr-5 text-sm text-[#f2efe9] ring-1 ring-white/10"
        >
          <span className="h-2 w-2 rounded-full bg-[#ffd166]" />
          Конструктор
          <span className="tabular-nums text-[#ffd166]">$6 400</span>
        </span>
        <div>
          <p className="text-sm font-medium text-sand-50">
            Допники включаются тумблерами прямо на сайте
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-sand-200/70">
            Внизу справа на каждом варианте — конструктор. Включили калькулятор,
            шахматку или 3D-тур — блок появился на странице, итог пересчитался,
            ссылку с набором можно отправить. Без перезагрузок.
          </p>
        </div>
      </Rise>
    </div>
  );
}

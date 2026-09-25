import type { Metadata } from "next";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { MarketHeader } from "@/components/foodmaxx/market/header";
import { MarketHero } from "@/components/foodmaxx/market/hero";
import { MarketLead } from "@/components/foodmaxx/market/lead";
import { VariantSwitch } from "@/components/foodmaxx/market/variant-switch";
import {
  Chains,
  Checklist,
  HowWeMake,
  Shelves,
  WhatInside,
} from "@/components/foodmaxx/market/sections";

export const metadata: Metadata = {
  title: "Вариант 02 — «Полка»",
  description:
    "FOODMAXX: 47 позиций консервации, восемь этапов производства, шесть торговых сетей. Прайс и образцы по запросу.",
};

/**
 * Вариант 02 — «Полка».
 *
 * Те же данные, другая подача: не кино, а инфографика карточки
 * маркетплейса. Светлый фон, товар с выносками, чек-лист, нумерованные
 * шаги — всё, что читается за три секунды и отвечает на вопрос «чем эта
 * банка лучше соседней».
 */
export default function FoodmaxxMarketPage() {
  return (
    <div className="bg-white font-mk text-mk-ink">
      <DevuzIntro project="foodmaxx" />
      <VariantSwitch current="market" />
      <MarketHeader />
      <main>
        <MarketHero />
        <WhatInside />
        <Checklist />
        <HowWeMake />
        <Shelves />
        <Chains />
        <MarketLead />
      </main>
    </div>
  );
}

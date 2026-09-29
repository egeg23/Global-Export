"use client";

import { Catalog } from "@/components/cf/catalog";
import { AdminPreview, Booking, Colors, Installment, View3d } from "@/components/cf/extras";
import { Fit } from "@/components/cf/fit";
import { Header, Hero } from "@/components/cf/hero";
import { Faq, Footer, FromTexture, Materials, Process, Showrooms, Trust } from "@/components/cf/scenes";
import { SiteStateProvider } from "@/components/cf/state";

/**
 * Сайт Comfort Mebel — одна страница, две палитры.
 *
 * Палитра задаётся атрибутом `data-cf` на корне: разметка у A и B одна и
 * та же, различаются токены (app/comfort.css). Блоки допников стоят на
 * своих местах всегда — конструктор решает, показывать ли их, и при
 * включении подъезжает к ним.
 */
export function ComfortSite({ palette }: { palette: "a" | "b" }) {
  return (
    <div data-cf={palette} className="min-h-screen">
      <SiteStateProvider>
        <Header palette={palette} />
        <main>
          <Hero />
          <Trust />
          <FromTexture />
          <Catalog />
          <Fit />
          <Colors />
          <View3d />
          <Installment />
          <Materials />
          <Process />
          <Showrooms>
            <Booking />
          </Showrooms>
          <AdminPreview />
          <Faq />
        </main>
        <Footer />
      </SiteStateProvider>
    </div>
  );
}

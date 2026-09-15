"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Shell } from "@/components/adar/ui/shell";
import { Wordmark } from "@/components/adar/ui/wordmark";
import { company } from "@/content/adar/company";
import { cn } from "@/lib/cn";

const nav = [
  { label: "Каталог", href: "#katalog" },
  { label: "Линейки", href: "#podbor" },
  { label: "Корпоративным", href: "#korporativnym" },
  { label: "Контакты", href: "#kontakty" },
];

/**
 * Шапка премиальной версии.
 *
 * Лежит поверх первого кадра прозрачной и набирает фон только после того,
 * как экран уехал вверх: иначе плашка режет кадр пополам с первой секунды.
 */
export function PremiumHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-500",
        scrolled
          ? "border-b border-white/8 bg-adar-green-950/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <Shell size="wide" className="flex items-center gap-8 py-5">
        <Link href="#" aria-label="ADAR — на главную">
          <Wordmark />
        </Link>

        <nav aria-label="Основное меню" className="ml-4 hidden gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-underline text-sm text-adar-cream-50/65 transition-colors hover:text-adar-cream-50"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <a
            href={`tel:${company.contacts.phones[2].replace(/\s/g, "")}`}
            className="hidden text-sm text-adar-cream-50/80 transition-colors hover:text-adar-gold-400 sm:block"
          >
            {company.contacts.phones[2]}
          </a>
          <a
            href="#kontakty"
            className="rounded-full border border-adar-gold-500/60 px-5 py-2.5 text-sm font-medium text-adar-gold-300 transition-colors duration-300 hover:bg-adar-gold-500 hover:text-adar-green-950"
          >
            Заказать
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="adar-premium-nav"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 lg:hidden"
          >
            <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-adar-cream-50 transition-transform duration-300",
                  open && "top-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 top-1.5 h-px bg-adar-cream-50 transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 top-3 h-px bg-adar-cream-50 transition-transform duration-300",
                  open && "top-1.5 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </Shell>

      <div id="adar-premium-nav" hidden={!open} className="border-t border-white/8 lg:hidden">
        <Shell size="wide" className="grid gap-1 py-4">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base text-adar-cream-50/70 transition-colors hover:bg-white/5 hover:text-adar-cream-50"
            >
              {item.label}
            </a>
          ))}
        </Shell>
      </div>
    </header>
  );
}

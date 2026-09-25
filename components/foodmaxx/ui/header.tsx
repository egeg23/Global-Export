"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { company } from "@/content/foodmaxx/company";
import { cn } from "@/lib/cn";

const nav = [
  { label: "Продукция", href: "#produkciya" },
  { label: "Производство", href: "#proizvodstvo" },
  { label: "О компании", href: "#o-kompanii" },
  { label: "Контакты", href: "#kontakty" },
];

/**
 * Шапка.
 *
 * Лежит поверх первого экрана и до первой прокрутки остаётся прозрачной:
 * плашка, врезанная в кадр с первой секунды, обрезает его пополам. Стекло
 * набирается по мере ухода экрана вверх.
 */
export function FoodmaxxHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // Шапка в потоке, а не поверх страницы: над ней стоит переключатель
    // вариантов, и вынутая из потока плашка ложилась прямо на него.
    <header className="pointer-events-none sticky top-0 z-40">
      <Shell size="wide" className="pt-3 sm:pt-4">
        <div
          className={cn(
            "pointer-events-auto flex items-center gap-4 rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5 lg:gap-8",
            scrolled ? "fm-glass fm-glass-sheen" : "bg-transparent",
          )}
        >
          <a href="#content" aria-label="FOODMAXX — к началу страницы" className="shrink-0">
            <Image
              src="/foodmaxx/brand/logo.webp"
              alt="FOODMAXX"
              width={900}
              height={224}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </a>

          <nav aria-label="Основное меню" className="ml-2 hidden gap-7 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="link-underline -my-1 py-1 text-sm text-fm-cream-50/75 transition-colors hover:text-fm-cream-50"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <a
              href={`tel:${company.contacts.phones[0].replace(/\s/g, "")}`}
              className="-my-1 hidden py-1 text-sm tabular-nums text-fm-cream-50/80 transition-colors hover:text-fm-amber-400 md:block"
            >
              {company.contacts.phones[0]}
            </a>
            <a
              href="#kontakty"
              className="hidden rounded-full bg-fm-amber-500 px-5 py-2.5 text-sm font-medium text-fm-ink-950 transition-colors duration-300 hover:bg-fm-amber-400 sm:block"
            >
              Стать дистрибьютором
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-fm-cream-50 transition-colors hover:border-fm-amber-500 lg:hidden"
            >
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300",
                    open && "translate-y-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300",
                    open && "-translate-y-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {open ? (
          <nav
            aria-label="Меню"
            className="fm-glass pointer-events-auto mt-2 grid gap-1 rounded-3xl p-3 lg:hidden"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base text-fm-cream-50/85 transition-colors hover:bg-white/8 hover:text-fm-cream-50"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#kontakty"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-2xl bg-fm-amber-500 px-4 py-3 text-center text-base font-medium text-fm-ink-950"
            >
              Стать дистрибьютором
            </a>
          </nav>
        ) : null}
      </Shell>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

import { Shell } from "@/components/adar/ui/shell";
import { Wordmark } from "@/components/adar/ui/wordmark";
import { company } from "@/content/adar/company";
import { cn } from "@/lib/cn";

const nav = [
  { label: "Каталог", href: "#katalog" },
  { label: "Тематики", href: "#tematiki" },
  { label: "О компании", href: "#o-kompanii" },
  { label: "Контакты", href: "#kontakty" },
];

/**
 * Шапка «Витрины».
 *
 * Липкая, полупрозрачная, с одним действием справа — позвонить. На узком
 * экране меню складывается в кнопку: половина посетителей приходит с
 * телефона, и прятать навигацию совсем нельзя.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-adar-green-900/8 bg-adar-cream-50/85 backdrop-blur-md">
      <Shell size="wide" className="flex items-center gap-6 py-4">
        <Link href="#" className="shrink-0" aria-label="ADAR — на главную">
          <Wordmark />
        </Link>

        <nav aria-label="Основное меню" className="ml-6 hidden gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-underline text-sm text-adar-ink-muted transition-colors hover:text-adar-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={`tel:${company.contacts.phones[2].replace(/\s/g, "")}`}
            className="hidden text-sm font-medium text-adar-ink sm:block"
          >
            {company.contacts.phones[2]}
          </a>
          <a
            href="#kontakty"
            className="rounded-full bg-adar-green-900 px-5 py-2.5 text-sm font-medium text-adar-cream-50 transition-colors duration-300 hover:bg-adar-green-800"
          >
            Заказать
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="adar-mobile-nav"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-adar-green-900/12 lg:hidden"
          >
            <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-adar-ink transition-transform duration-300",
                  open && "top-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 top-1.5 h-px bg-adar-ink transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 top-3 h-px bg-adar-ink transition-transform duration-300",
                  open && "top-1.5 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </Shell>

      <div
        id="adar-mobile-nav"
        hidden={!open}
        className="border-t border-adar-green-900/8 lg:hidden"
      >
        <Shell size="wide" className="grid gap-1 py-4">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base text-adar-ink-muted transition-colors hover:bg-adar-cream-100 hover:text-adar-ink"
            >
              {item.label}
            </a>
          ))}
        </Shell>
      </div>
    </header>
  );
}

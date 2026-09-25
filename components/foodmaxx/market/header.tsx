"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { company } from "@/content/foodmaxx/company";
import { cn } from "@/lib/cn";

const nav = [
  { label: "Состав", href: "#sostav" },
  { label: "Почему мы", href: "#pochemu" },
  { label: "Производство", href: "#kak-delaem" },
  { label: "Каталог", href: "#polki" },
];

/** Шапка варианта 02: светлая, плотная, с кнопкой в оранжевом. */
export function MarketHeader() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white transition-shadow duration-200",
        stuck && "shadow-[0_1px_0_rgba(15,27,20,0.08)]",
      )}
    >
      <Shell size="wide" className="flex items-center gap-5 py-3 lg:gap-9">
        <a href="#content" aria-label="FOODMAXX — к началу страницы" className="shrink-0">
          <Image
            src="/foodmaxx/brand/logo.webp"
            alt="FOODMAXX"
            width={900}
            height={224}
            priority
            className="h-8 w-auto"
          />
        </a>

        <nav aria-label="Основное меню" className="hidden gap-7 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="-my-1 py-1 text-sm text-mk-ink-muted transition-colors hover:text-mk-green-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={`tel:${company.contacts.phones[0].replace(/\s/g, "")}`}
            className="-my-1 hidden py-1 text-sm font-medium tabular-nums text-mk-ink transition-colors hover:text-mk-green-600 md:block"
          >
            {company.contacts.phones[0]}
          </a>
          <a
            href="#zayavka"
            className="rounded-full bg-mk-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mk-orange-600"
          >
            Получить прайс
          </a>
        </div>
      </Shell>
    </header>
  );
}

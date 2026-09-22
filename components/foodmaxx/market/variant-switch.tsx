import Link from "next/link";

import { cn } from "@/lib/cn";

const VARIANTS = [
  { href: "/foodmaxx", index: "01", label: "Кино", note: "тёмный, со сценами" },
  { href: "/foodmaxx/market", index: "02", label: "Полка", note: "светлый, инфографикой" },
];

/**
 * Переключатель вариантов.
 *
 * Два оформления на одних и тех же данных: заказчику нужно выбрать одно, и
 * переключатель — единственное, что он должен на витрине сделать. Не липкий:
 * уезжает с первой прокруткой и не режет кадр.
 */
export function VariantSwitch({ current }: { current: "cinema" | "market" }) {
  const active = current === "cinema" ? "/foodmaxx" : "/foodmaxx/market";

  return (
    <div className="relative z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2.5 sm:px-8 lg:px-10">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-mk-ink-subtle">
          Два варианта сайта
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          {VARIANTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200",
                item.href === active
                  ? "bg-mk-green-500 font-medium text-white"
                  : "text-mk-ink-muted hover:bg-mk-green-50",
              )}
            >
              <span className="mr-1.5 text-[0.7rem] opacity-65">{item.index}</span>
              {item.label}
              <span className="ml-2 hidden text-xs opacity-60 sm:inline">{item.note}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

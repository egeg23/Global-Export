"use client";

import { useCart } from "@/lib/adar/cart";
import { cn } from "@/lib/cn";

/**
 * Кнопка корзины в шапке.
 *
 * Снаружи провайдера хук отдаёт null, и кнопка не появляется вовсе — так
 * варианты витрины без корзины остаются без неё и в разметке.
 */
export function CartButton({ className }: { className?: string }) {
  const cart = useCart();
  if (!cart) return null;

  return (
    <button
      type="button"
      onClick={cart.open}
      // Имя целиком в aria-label: иначе диктор читает «Корзина Корзина,
      // наборов: 2» — видимое слово и скрытую подпись подряд.
      aria-label={`Корзина, наборов: ${cart.count}`}
      className={cn(
        "relative flex h-10 cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 text-sm text-adar-cream-50 transition-colors hover:border-adar-gold-500 hover:text-adar-gold-300",
        className,
      )}
    >
      {/* Иконка нарисована, а не взята эмодзи: эмодзи на каждой системе своя */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M5 8h14l-1.2 11.2a1.6 1.6 0 0 1-1.6 1.4H7.8a1.6 1.6 0 0 1-1.6-1.4z" />
        <path d="M9 8V6.2A3 3 0 0 1 15 6.2V8" />
      </svg>
      <span aria-hidden="true" className="hidden sm:inline">
        Корзина
      </span>
      {cart.count > 0 ? (
        <span
          aria-hidden="true"
          className="min-w-5 rounded-full bg-adar-gold-500 px-1.5 text-center text-[0.7rem] font-medium leading-5 tabular-nums text-adar-green-950"
        >
          {cart.count}
        </span>
      ) : null}
    </button>
  );
}

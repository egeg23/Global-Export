"use client";

import { useState } from "react";

import { company } from "@/content/adar/company";
import { cn } from "@/lib/cn";

const query = encodeURIComponent(company.contacts.address);

/** Карта грузится в рамку только по нажатию — см. комментарий к компоненту. */
const widget = `https://yandex.uz/map-widget/v1/?text=${query}&z=16&lang=ru_RU`;
const routes = `https://yandex.uz/maps/?text=${query}&rtext=~${query}`;
const google = `https://www.google.com/maps/search/?api=1&query=${query}`;

/**
 * Где нас найти.
 *
 * Карта чужая и тяжёлая: сторонний виджет тянет свои скрипты, ставит свои
 * куки и заметно портит скорость страницы — а смотрит на него один посетитель
 * из двадцати. Поэтому до нажатия в рамке лежит адрес и две ссылки, а сам
 * виджет подставляется только тогда, когда карту действительно попросили.
 */
export function VenueMap({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const [shown, setShown] = useState(false);

  return (
    <div
      className={cn(
        "mt-10 overflow-hidden rounded-adar border",
        dark ? "border-white/12 bg-white/[0.03]" : "border-adar-green-900/12 bg-white",
      )}
    >
      {/* Своя обрезка: без неё знак-подложка выползает на полосу ссылок ниже */}
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
        {shown ? (
          <iframe
            src={widget}
            title={`ADAR на карте: ${company.contacts.address}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            {/* Знак уведён в нижний угол и приглушён: он подложка, а не рисунок */}
            <span
              aria-hidden="true"
              className={cn(
                "adar-logo-mark absolute -bottom-[22%] -right-[10%] w-[32%]",
                dark ? "opacity-[0.05]" : "opacity-[0.04]",
              )}
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("h-7 w-7", dark ? "text-adar-gold-400" : "text-adar-green-700")}
            >
              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
            <p
              className={cn(
                "relative max-w-xs text-sm leading-relaxed",
                dark ? "text-adar-cream-50/80" : "text-adar-ink-muted",
              )}
            >
              {company.contacts.address}
            </p>
            <button
              type="button"
              onClick={() => setShown(true)}
              className={cn(
                "relative cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-colors",
                dark
                  ? "border-adar-gold-500/60 text-adar-gold-300 hover:bg-adar-gold-500 hover:text-adar-green-950"
                  : "border-adar-green-900/20 text-adar-green-800 hover:border-adar-green-700",
              )}
            >
              Показать карту
            </button>
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center gap-x-5 gap-y-2 border-t px-5 py-3.5 text-sm",
          dark ? "border-white/10" : "border-adar-green-900/10",
        )}
      >
        <a
          href={routes}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            // Запас по высоте — ради пальца: строка в двадцать пикселей
            // меньше, чем промахивается средний палец.
            "link-underline -my-1 inline-block py-1",
            dark ? "text-adar-cream-50/80 hover:text-adar-gold-400" : "text-adar-green-800",
          )}
        >
          Построить маршрут
        </a>
        <a
          href={google}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "link-underline -my-1 inline-block py-1",
            dark ? "text-adar-cream-50/60 hover:text-adar-gold-400" : "text-adar-ink-subtle",
          )}
        >
          Открыть в Google Картах
        </a>
      </div>
    </div>
  );
}

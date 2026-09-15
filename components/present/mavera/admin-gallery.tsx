"use client";

import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/cn";

import { AdminScreen } from "./admin-screens";
import { BrowserFrame } from "./frames";
import { adminScreens, type AdminScreenId } from "./theme";

/**
 * Панель управления — отдельный блок, вне тумблера вариантов.
 *
 * Оформление сайта заказчик выбирает, панель — нет: она одинаковая во всех
 * трёх пакетах и отличается только объёмом разделов. Показывать её вперемешку
 * с вариантами значило бы намекать, что от выбора оформления зависит и она.
 */
export function AdminGallery() {
  const [activeId, setActiveId] = useState<AdminScreenId>("editor");
  const active = adminScreens.find((screen) => screen.id === activeId) ?? adminScreens[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Разделы панели"
        className="flex flex-wrap gap-2"
      >
        {adminScreens.map((screen) => (
          <button
            key={screen.id}
            type="button"
            role="tab"
            aria-selected={activeId === screen.id}
            onClick={() => setActiveId(screen.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300",
              activeId === screen.id
                ? "border-harvest-300 bg-harvest-300 text-forest-950"
                : "border-sand-50/14 text-sand-200/75 hover:border-sand-50/30 hover:text-sand-50",
            )}
          >
            {screen.title}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <BrowserFrame
            path="mavera.uz/admin"
            bodyClassName="max-h-[34rem] overflow-y-auto overscroll-contain"
          >
            <div
              key={activeId}
              className="mv-fade"
              role="img"
              aria-label={`Макет панели: ${active.title}`}
            >
              <AdminScreen id={activeId} />
            </div>
          </BrowserFrame>
        </div>

        <div className="lg:col-span-4">
          <h3 className="font-display text-xl text-sand-50">{active.title}</h3>
          <p key={active.id} className="mv-fade mt-3 text-sm leading-relaxed text-sand-200/75">
            {active.detail}
          </p>

          <div className="mt-8 border-t border-sand-50/10 pt-6">
            <p className="text-sm leading-relaxed text-sand-300/60">
              Панель одна на все три варианта. В «Стандарте» это проекты, коммерция,
              страницы и заявки; в «Люксе» добавляются медиатека с перетаскиванием,
              черновики и порядок вывода; в «Премиуме» — роли, журнал действий и
              выгрузка заявок в CRM.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-sand-300/60">
              Бриф требует Laravel. Это рабочий вариант, но тот же результат мы уже
              собрали на своём стеке — и он на 10–15% дешевле. Решать заказчику.
            </p>

            <Link
              href="/admin"
              prefetch={false}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-harvest-300 transition-colors hover:text-harvest-200"
            >
              Открыть настоящую панель Global Export
              <span aria-hidden="true">↗</span>
            </Link>
            <p className="mt-2 text-xs text-sand-300/45">
              Не макет: рабочая админка действующего клиента, с теми же приёмами.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

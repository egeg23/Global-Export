"use client";

import Link from "next/link";
import { useState } from "react";

import { AdminScreen, adminSections, type AdminScreenId } from "@/components/mavera/admin/screens";
import { useConfigurator } from "@/components/mavera/configurator/context";
import { BrowserFrame } from "@/components/present/mavera/frames";
import { cn } from "@/lib/cn";
import type { AddonId } from "@/content/mavera/addons";

/**
 * Витрина панели управления.
 *
 * Разделы слева, экран справа — как в самой панели, чтобы по витрине было
 * понятно её устройство, а не только внешний вид. Восемь экранов в одном
 * списке утонули бы, поэтому они сгруппированы так же, как в меню.
 */

const captions: Record<AdminScreenId, string> = {
  overview:
    "Сводка за неделю: заявки, брони, остаток квартир и конверсия. График визитов и заявок тянется из Яндекс.Метрики — отдельно её открывать не нужно.",
  projects:
    "Все жилые комплексы одним списком: сколько квартир, сколько свободно, опубликован или черновик. Порядок на сайте задаётся числом, публикация переключается прямо в строке.",
  "project-form":
    "Карточка ЖК: тексты в трёх языках с индикатором незаполненного перевода, корпуса со сроками сдачи, характеристики, фотографии перетаскиванием и планировки, привязанные к типу квартиры.",
  flats:
    "Шахматка корпуса: выделяете несколько квартир и меняете статус, цену или планировку разом. Цены можно поднять по корпусу или этажу — например, на 3% после выхода на фасад.",
  leads:
    "Заявки с источником до квартиры и UTM-метки, ответственным менеджером и статусом от новой до сделки. Выгрузка в CRM — кнопкой.",
  users:
    "Сотрудники, роли и матрица прав: кто правит сайт, кто трогает цены, кто видит заявки. Журнал действий пишет, кто и когда поменял статус квартиры.",
  analytics:
    "Поведение посетителей: источники и заявки по каждому, цели Метрики, вебвизор и карта скроллов. Видно, где бросают калькулятор и до какого блока дочитывают карточку.",
  media:
    "Общая библиотека файлов: загрузка перетаскиванием, переиспользование во всех разделах, JPG, PNG, WebP, AVIF и PDF.",
  audit:
    "Журнал действий: кто, когда и что поменял — с прежним и новым значением. Спорная цена или статус откатываются одной кнопкой.",
};

/** На каком экране живёт допник панели — туда переключаемся, когда его включают. */
const screenOf: Partial<Record<AddonId, AdminScreenId>> = {
  roles: "users",
  crm: "leads",
  import: "flats",
  metrika: "analytics",
  audit: "audit",
};

export function AdminGallery() {
  const ctx = useConfigurator();
  // Свежий допник конструктора открывает свой экран, но более поздний клик по
  // вкладке важнее. Клик запоминает, какой допник был свежим в тот момент:
  // пока он тот же — выбор за кликом, появился новый — за допником.
  const [choice, setChoice] = useState<{ id: AdminScreenId; after: number }>({ id: "project-form", after: 0 });
  const freshAt = ctx?.fresh?.at ?? 0;
  const target = ctx?.fresh ? screenOf[ctx.fresh.id] : undefined;
  const activeId = target && freshAt > choice.after ? target : choice.id;
  const setActiveId = (id: AdminScreenId) => setChoice({ id, after: freshAt });
  const groups = [...new Set(adminSections.map((s) => s.group))];
  const active = adminSections.find((s) => s.id === activeId) ?? adminSections[0];

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* Разделы — как меню самой панели */}
      <div className="lg:col-span-3">
        <div role="tablist" aria-label="Разделы панели" className="space-y-6">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-sand-300/40">
                {group}
              </p>
              <div className="mt-2.5 space-y-1">
                {adminSections
                  .filter((s) => s.group === group)
                  .map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      role="tab"
                      aria-selected={activeId === section.id}
                      onClick={() => setActiveId(section.id)}
                      className={cn(
                        "block w-full rounded-lg px-3.5 py-2 text-left text-sm transition-colors duration-300",
                        activeId === section.id
                          ? "bg-harvest-300 font-medium text-forest-950"
                          : "text-sand-200/75 hover:bg-sand-50/6 hover:text-sand-50",
                      )}
                    >
                      {section.label}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-sand-50/10 pt-6">
          <Link
            href="/admin"
            prefetch={false}
            className="inline-flex items-center gap-2 text-sm font-medium text-harvest-300 transition-colors hover:text-harvest-200"
          >
            Открыть рабочую панель
            <span aria-hidden="true">↗</span>
          </Link>
          <p className="mt-2 text-xs leading-relaxed text-sand-300/45">
            Не макет: действующая админка Global Export, на которой это собрано.
          </p>
        </div>
      </div>

      {/* Экран */}
      <div className="lg:col-span-9">
        <BrowserFrame
          path="mavera.uz/admin"
          bodyClassName="max-h-[36rem] overflow-y-auto overscroll-contain"
        >
          <div key={activeId} className="mv-fade" role="group" aria-label={`Экран панели: ${active.label}`}>
            <AdminScreen id={activeId} />
          </div>
        </BrowserFrame>

        <p key={`${activeId}-text`} className="mv-fade mt-5 max-w-3xl text-sm leading-relaxed text-sand-200/75">
          <span className="font-medium text-sand-50">{active.label}. </span>
          {captions[activeId]}
        </p>
      </div>
    </div>
  );
}

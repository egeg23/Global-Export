"use client";

import Link from "next/link";

import { AdminScreen, adminSections, type AdminScreenId } from "@/components/mavera/admin/screens";
import { useConfigurator } from "@/components/configurator/context";
import { panelHref } from "@/components/mavera/admin/model";
import { AdminProvider, useAdmin } from "@/components/mavera/admin/store";
import { BrowserFrame } from "@/components/present/mavera/frames";
import { cn } from "@/lib/cn";

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
const screenOf: Partial<Record<string, AdminScreenId>> = {
  roles: "users",
  crm: "leads",
  import: "flats",
  metrika: "analytics",
  audit: "audit",
};

/**
 * Панель со своим состоянием.
 *
 * Провайдер стоит здесь, а не на странице: галерею показывают в двух местах —
 * на странице панели и в перечне вариантов, — и каждый показ должен получать
 * рабочую панель без отдельной обвязки на вызывающей стороне.
 */
export function AdminGallery() {
  return (
    <AdminProvider>
      <Gallery />
    </AdminProvider>
  );
}

/**
 * Какой экран открыт. Свежий допник конструктора открывает свой экран, но
 * более поздний клик по разделу важнее. Отметка времени клика запоминается
 * рядом с экраном: пока допник тот же — выбор за человеком, появился новый —
 * за допником. Общий для рамки и для панели на весь экран.
 */
export function useActiveScreen() {
  const ctx = useConfigurator();
  const admin = useAdmin();
  const freshAt = ctx?.fresh?.at ?? 0;
  const target = ctx?.fresh ? screenOf[ctx.fresh.id] : undefined;
  const activeId = target && freshAt > admin.pickedAt ? target : admin.screen;
  const setActiveId = (id: AdminScreenId) => admin.setScreen(id, freshAt);
  return { activeId, setActiveId };
}

/** Кнопка входа: панель открывается страницей на весь экран. */
export function PanelButton({ className }: { className?: string }) {
  const ctx = useConfigurator();
  return (
    <Link
      href={panelHref(ctx?.tier ?? "premium")}
      prefetch={false}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-harvest-300 px-6 py-3 text-sm font-semibold text-forest-950 transition-colors hover:bg-harvest-200",
        className,
      )}
    >
      Войти в панель
      <span aria-hidden="true">→</span>
    </Link>
  );
}

function Gallery() {
  const { activeId, setActiveId } = useActiveScreen();
  const groups = [...new Set(adminSections.map((s) => s.group))];
  const active = adminSections.find((s) => s.id === activeId) ?? adminSections[0];

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* На телефоне рамка тесная: сразу зовём в панель на весь экран. */}
      <div className="rounded-xl border border-harvest-300/25 bg-harvest-300/8 p-5 lg:hidden">
        <p className="text-sm leading-relaxed text-sand-200/85">
          Ниже — панель в рамке для обзора. Работать в ней удобнее на весь экран.
        </p>
        <PanelButton className="mt-4 w-full" />
      </div>

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
          <PanelButton className="w-full" />
          <p className="mt-3 text-xs leading-relaxed text-sand-300/45">
            Та же панель отдельной страницей, на весь экран: меню, поиск и все
            девять разделов. Правки живут до обновления страницы.
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

        <p className="mt-2 text-sm text-sand-300/55">
          Панель рабочая: меню внутри окна переключает разделы, поиск ищет по
          проектам, квартирам и заявкам, а всё, что вы измените, пересчитается
          на остальных экранах и попадёт в журнал действий.
        </p>
      </div>
    </div>
  );
}

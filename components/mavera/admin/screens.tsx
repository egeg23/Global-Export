"use client";

import {
  FlatsScreen,
  MediaScreen,
  ProjectFormScreen,
  ProjectsScreen,
} from "@/components/mavera/admin/screens-catalog";
import {
  AnalyticsScreen,
  LeadsScreen,
  OverviewScreen,
} from "@/components/mavera/admin/screens-sales";
import { AuditScreen, UsersScreen } from "@/components/mavera/admin/screens-settings";
import { adminSections, type AdminScreenId } from "@/components/mavera/admin/model";

/**
 * Панель управления MAVERA — девять экранов, и все рабочие.
 *
 * За основу взята админка Global Export: те же приёмы, которые уже работают у
 * действующего клиента — язык переключается прямо в поле, точка на вкладке
 * показывает незаполненный перевод, файлы кидаются перетаскиванием, черновик
 * виден только в панели.
 *
 * Добавлено то, без чего застройщику нельзя: корпуса и квартиры с ценами и
 * статусами, планировки, роли сотрудников и аналитика поведения. Палитра
 * своя и тумблером вариантов не меняется: оформление сайта заказчик выбирает,
 * рабочий инструмент — нет.
 *
 * Экраны разложены по группам меню: каталог, продажи, настройки. Общее
 * состояние — в store.tsx, общие части корпуса — в ui.tsx.
 */

export { adminSections, type AdminScreenId };

const registry: Record<AdminScreenId, () => React.ReactNode> = {
  overview: OverviewScreen,
  projects: ProjectsScreen,
  "project-form": ProjectFormScreen,
  flats: FlatsScreen,
  leads: LeadsScreen,
  users: UsersScreen,
  analytics: AnalyticsScreen,
  media: MediaScreen,
  audit: AuditScreen,
};

export function AdminScreen({ id }: { id: AdminScreenId }) {
  const Body = registry[id];

  return (
    <div className="flex min-h-full flex-col text-[2.6cqw] @min-[40rem]:text-[1.25cqw]">
      <Body />
    </div>
  );
}

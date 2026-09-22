"use client";

import { ConfiguratorProvider } from "@/components/configurator/context";
import { useActiveScreen } from "@/components/mavera/admin/gallery";
import { adminSections } from "@/components/mavera/admin/model";
import { AdminScreen } from "@/components/mavera/admin/screens";
import { AdminProvider } from "@/components/mavera/admin/store";
import { maveraCatalog } from "@/content/mavera/catalog";
import { ghAudit, ghLeads, ghMedia, ghProjects } from "@/content/gh/panel";

/**
 * Панель управления Golden House.
 *
 * Экраны те же, что показывали MAVERA: обзор, каталог, шахматка, заявки,
 * роли, журнал действий с откатом. Разница в двух вещах. Внутри — их
 * собственные кварталы, а не чужие; и нет конструктора тарифов: у MAVERA он
 * был инструментом показа («включите допник и посмотрите цену»), здесь
 * разговор о другом, и дублировать его незачем.
 *
 * Конструктор всё же заведён провайдером, но без дока: экраны панели
 * спрашивают у него, включены ли отдельные блоки (импорт из Excel, роли,
 * связь с CRM). На пакете «премиум» включены все — панель показывается
 * целиком, а тумблеров в углу нет.
 */
export function PanelApp() {
  return (
    <ConfiguratorProvider
      catalog={maveraCatalog}
      tier="premium"
      page="admin"
      frame="none"
      hrefs={{}}
      dock={false}
    >
      <AdminProvider
        app={{
          exitHref: "/gh",
          tierLabel: "Golden House",
          brand: "GOLDEN HOUSE",
          exitLabel: "Выйти → на сайт",
        }}
        seed={{ projects: ghProjects, leads: ghLeads, media: ghMedia, audit: ghAudit }}
      >
        <Panel />
      </AdminProvider>
    </ConfiguratorProvider>
  );
}

function Panel() {
  const { activeId } = useActiveScreen();
  const active = adminSections.find((section) => section.id === activeId) ?? adminSections[0];

  return (
    <main className="min-h-screen bg-sand-100 text-forest-950">
      <div role="group" aria-label={`Экран панели: ${active.label}`}>
        <AdminScreen id={activeId} app />
      </div>
    </main>
  );
}

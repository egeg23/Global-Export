"use client";

import { ConfiguratorProvider } from "@/components/configurator/context";
import { useActiveScreen } from "@/components/mavera/admin/gallery";
import { adminSections } from "@/components/mavera/admin/model";
import { AdminScreen } from "@/components/mavera/admin/screens";
import { AdminProvider } from "@/components/mavera/admin/store";
import { tiers, type TierId } from "@/components/present/mavera/theme";
import { maveraCatalog, maveraHrefs } from "@/content/mavera/catalog";
import { projects } from "@/content/mavera/data";

/**
 * Панель управления на весь экран.
 *
 * Та же панель, что в рамке на странице презентации, но без презентации
 * вокруг: заказчик открывает адрес и работает, как работал бы у себя —
 * меню слева, поиск сверху, на телефоне меню в шторке. Конструктор внизу
 * справа остаётся: допники панели включаются и здесь, экран переключается
 * на нужный раздел.
 */
export function PanelApp({ variant }: { variant: TierId }) {
  const tier = tiers.find((entry) => entry.id === variant) ?? tiers[0];

  return (
    <ConfiguratorProvider
      catalog={maveraCatalog}
      tier={variant}
      page="admin"
      frame="studio"
      hrefs={maveraHrefs(variant, projects[0].slug)}
    >
      <AdminProvider
        app={{ exitHref: `/mavera/${variant}/admin`, tierLabel: tier.label }}
      >
        <Panel />
      </AdminProvider>
    </ConfiguratorProvider>
  );
}

function Panel() {
  const { activeId } = useActiveScreen();
  const active =
    adminSections.find((s) => s.id === activeId) ?? adminSections[0];

  return (
    <main className="min-h-screen bg-sand-100 text-forest-950">
      <div role="group" aria-label={`Экран панели: ${active.label}`}>
        <AdminScreen id={activeId} app />
      </div>
    </main>
  );
}

import Link from "next/link";

import { AdminGallery, PanelButton } from "@/components/mavera/admin/gallery";
import { ConfiguratorProvider } from "@/components/configurator/context";
import { maveraCatalog, maveraHrefs } from "@/content/mavera/catalog";
import { VariantBar } from "@/components/mavera/variant-bar";
import { tiers, type TierId } from "@/components/present/mavera/theme";
import { Container } from "@/components/ui/container";
import { addons, included } from "@/content/mavera/addons";
import { projects } from "@/content/mavera/data";

/**
 * Панель управления в составе пакета.
 *
 * Панель одна на три варианта, различается только тем, что в неё входит.
 * Страница нужна конструктору: допники панели — роли, CRM, импорт, Метрика,
 * журнал — включаются здесь, и тумблер с сайта переводит сюда. Оформление
 * наше, витринное, а не мира сайта: рабочий инструмент заказчик не выбирает.
 */
export function AdminPage({ variant }: { variant: TierId }) {
  const tier = tiers.find((entry) => entry.id === variant) ?? tiers[0];
  const adminAddons = addons.filter((addon) => addon.where === "admin");
  const inside = adminAddons.filter((addon) => included[variant].includes(addon.id));

  return (
    <ConfiguratorProvider catalog={maveraCatalog} tier={variant} page="admin" frame="studio" hrefs={maveraHrefs(variant, projects[0].slug)}>
      <VariantBar current={variant} admin />

      <main className="min-h-screen bg-[#0b0d10] pb-28 text-sand-50">
        <Container className="pt-14">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-harvest-300">
            Панель управления · пакет «{tier.label}»
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-3xl leading-tight sm:text-4xl">
            Одна панель на три варианта
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-sand-200/75">
            За основу взята админка Global Export, которая уже работает у действующего
            клиента. В пакете «{tier.label}» из допников панели{" "}
            {inside.length
              ? `уже есть: ${inside.map((addon) => addon.label).join(", ")}`
              : "ничего нет — базовые разделы без расширений"}
            . Остальное включается в конструкторе внизу справа: экран переключится
            сам, а у нового блока появится «было / стало».
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-sand-200/75">
            Это рабочий прототип, а не скриншоты. Все девять разделов нажимаются:
            выделяйте квартиры и меняйте цены, заводите проекты и сотрудников,
            ведите заявки по воронке, ищите через строку поиска. Панель считает
            одно и то же во всех разделах, а спорную правку возвращает кнопкой в
            журнале действий. Изменения живут до обновления страницы — базы за
            прототипом нет, она в составе работ.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <PanelButton />
            <p className="text-sm text-sand-300/55">
              Откроется на весь экран, как у вас в работе. Внизу — та же рамка для обзора.
            </p>
          </div>
        </Container>

        <Container className="pt-10">
          <AdminGallery />
        </Container>

        <Container className="pt-10">
          <p className="text-sm text-sand-300/55">
            <Link href={`/mavera/${variant}`} prefetch={false} className="text-harvest-300 transition-colors hover:text-harvest-200">
              ← Сайт «{tier.label}»
            </Link>
            <span className="mx-3 opacity-40">·</span>
            <Link href="/mavera" prefetch={false} className="transition-colors hover:text-sand-50">
              Все варианты и смета
            </Link>
          </p>
        </Container>
      </main>
    </ConfiguratorProvider>
  );
}

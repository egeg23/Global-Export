import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import type { TableName } from "@/lib/supabase/types";

const sections: { table: TableName; href: string; label: string; blurb: string }[] = [
  {
    table: "news",
    href: "/admin/news",
    label: "Новости",
    blurb: "Публикации компании",
  },
  {
    table: "products",
    href: "/admin/products",
    label: "Продукция",
    blurb: "Карточки товаров и характеристики",
  },
  {
    table: "categories",
    href: "/admin/categories",
    label: "Категории",
    blurb: "Разделы каталога",
  },
  {
    table: "certificates",
    href: "/admin/certificates",
    label: "Сертификаты",
    blurb: "Документы качества",
  },
  {
    table: "team_members",
    href: "/admin/team",
    label: "Команда",
    blurb: "Сотрудники на страницах «Команда» и «Контакты»",
  },
  {
    table: "media",
    href: "/admin/media",
    label: "Медиа",
    blurb: "Фотографии и файлы",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  // One HEAD request per table: the count comes back in a header, no rows cross
  // the wire.
  const counts = await Promise.all(
    sections.map(async (section) => {
      const { count } = await supabase
        .from(section.table)
        .select("id", { count: "exact", head: true });
      return count ?? 0;
    }),
  );

  const { count: drafts } = await supabase
    .from("news")
    .select("id", { count: "exact", head: true })
    .eq("is_published", false);

  return (
    <>
      <h1 className="text-xl font-medium text-forest-950">Обзор</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
        Изменения появляются на сайте сразу после сохранения — отдельной публикации
        сайта не требуется.
      </p>

      {drafts ? (
        <p className="mt-6 rounded-lg border border-harvest-300 bg-harvest-50 px-4 py-3 text-sm text-harvest-800">
          Черновиков в новостях: {drafts}. Они не видны посетителям.{" "}
          <Link href="/admin/news" className="underline underline-offset-2">
            Открыть
          </Link>
        </p>
      ) : null}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="flex h-full flex-col rounded-xl border border-forest-900/10 bg-white p-5 transition-colors hover:border-forest-700/40"
            >
              <span className="text-2xl font-medium text-forest-950">{counts[index]}</span>
              <span className="mt-1 text-sm font-medium text-forest-900">
                {section.label}
              </span>
              <span className="mt-0.5 text-xs text-ink-subtle">{section.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

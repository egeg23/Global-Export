import { EntryList } from "@/components/admin/entry-list";
import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import type { CategoryRow, ProductRow } from "@/lib/supabase/types";

import { toggleCategory } from "./actions";

export default async function CategoriesListPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("position", { ascending: true }),
    supabase.from("products").select("category_slug"),
  ]);

  const counts = new Map<string, number>();
  for (const product of (products as Pick<ProductRow, "category_slug">[] | null) ?? []) {
    counts.set(product.category_slug, (counts.get(product.category_slug) ?? 0) + 1);
  }

  const rows = ((categories as CategoryRow[] | null) ?? []).map((row) => ({
    id: row.id,
    title: row.name.ru || row.name.en || row.name.uz || "",
    subtitle: row.slug,
    meta: `${counts.get(row.slug) ?? 0} товаров`,
    isPublished: row.is_published,
  }));

  return (
    <>
      <PageHeader
        title="Категории"
        description="Разделы каталога. Категория, снятая с публикации, исчезает из меню и фильтров — товары в ней остаются."
        action={{ href: "/admin/categories/new", label: "Добавить категорию" }}
      />
      <EntryList
        rows={rows}
        basePath="/admin/categories"
        empty="Категорий пока нет."
        togglePublished={toggleCategory}
      />
    </>
  );
}

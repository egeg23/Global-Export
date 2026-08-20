import { EntryList } from "@/components/admin/entry-list";
import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import type { CategoryRow, ProductRow } from "@/lib/supabase/types";

import { toggleProduct } from "./actions";

export default async function ProductsListPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").order("position", { ascending: true }),
    supabase.from("categories").select("*"),
  ]);

  const categoryNames = new Map(
    ((categories as CategoryRow[] | null) ?? []).map((category) => [
      category.slug,
      category.short_name.ru || category.name.ru || category.name.en || category.slug,
    ]),
  );

  const rows = ((products as ProductRow[] | null) ?? []).map((row) => ({
    id: row.id,
    title: row.name.ru || row.name.en || row.name.uz || "",
    subtitle: categoryNames.get(row.category_slug) ?? row.category_slug,
    meta: row.availability === "soon" ? "Скоро" : undefined,
    isPublished: row.is_published,
  }));

  return (
    <>
      <PageHeader
        title="Продукция"
        description="Каталог: карточки товаров, их характеристики и фотографии."
        action={{ href: "/admin/products/new", label: "Добавить товар" }}
      />
      <EntryList
        rows={rows}
        basePath="/admin/products"
        empty="Товаров пока нет."
        togglePublished={toggleProduct}
      />
    </>
  );
}

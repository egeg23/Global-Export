import { EntryList } from "@/components/admin/entry-list";
import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import type { NewsRow } from "@/lib/supabase/types";

import { toggleNews } from "./actions";

export default async function NewsListPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  const rows = ((data as NewsRow[] | null) ?? []).map((row) => ({
    id: row.id,
    title: row.title.ru || row.title.en || row.title.uz || "",
    subtitle: row.slug,
    meta: new Date(row.published_at).toLocaleDateString("ru-RU"),
    isPublished: row.is_published,
  }));

  return (
    <>
      <PageHeader
        title="Новости"
        description="Публикации компании. Черновик виден только здесь — на сайт попадает то, что отмечено как опубликованное."
        action={{ href: "/admin/news/new", label: "Добавить новость" }}
      />
      <EntryList
        rows={rows}
        basePath="/admin/news"
        empty="Публикаций пока нет."
        togglePublished={toggleNews}
      />
    </>
  );
}

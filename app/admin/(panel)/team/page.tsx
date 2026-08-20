import { EntryList } from "@/components/admin/entry-list";
import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import type { TeamMemberRow } from "@/lib/supabase/types";

import { toggleTeamMember } from "./actions";

const groupNames: Record<string, string> = {
  board: "Правление",
  directors: "Директора",
  export: "Отдел экспорта",
};

export default async function TeamListPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("position", { ascending: true });

  const rows = ((data as TeamMemberRow[] | null) ?? []).map((row) => ({
    id: row.id,
    title: row.name,
    subtitle: row.position_title.ru || row.position_title.en || undefined,
    meta: groupNames[row.team_group] ?? row.team_group,
    isPublished: row.is_published,
  }));

  return (
    <>
      <PageHeader
        title="Команда"
        description="Сотрудники на страницах «Команда» и «Контакты», разделённые по группам."
        action={{ href: "/admin/team/new", label: "Добавить сотрудника" }}
      />
      <EntryList
        rows={rows}
        basePath="/admin/team"
        empty="Сотрудников пока нет."
        togglePublished={toggleTeamMember}
      />
    </>
  );
}

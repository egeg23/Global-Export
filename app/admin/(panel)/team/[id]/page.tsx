import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/delete-button";
import { EntryForm } from "@/components/admin/entry-form";
import { Checkbox, Field, Fieldset, Select, TextInput } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { LocalizedField } from "@/components/admin/localized-field";
import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import type { TeamMemberRow } from "@/lib/supabase/types";

import { deleteTeamMember, saveTeamMember } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function TeamEditorPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let row: TeamMemberRow | null = null;
  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    row = data as TeamMemberRow;
  }

  return (
    <>
      <PageHeader title={isNew ? "Новый сотрудник" : "Сотрудник"} />

      <EntryForm
        action={saveTeamMember}
        backHref="/admin/team"
        deleteSlot={
          row ? (
            <DeleteButton
              action={deleteTeamMember}
              confirm="Удалить сотрудника? Действие необратимо."
            />
          ) : null
        }
      >
        <input type="hidden" name="id" value={row?.id ?? "new"} />

        <Fieldset title="Сотрудник">
          <Field label="Имя и фамилия">
            <TextInput name="name" defaultValue={row?.name ?? ""} required />
          </Field>

          <LocalizedField
            name="position_title"
            label="Должность"
            value={row?.position_title}
          />

          <Field label="Группа">
            <Select name="team_group" defaultValue={row?.team_group ?? "directors"}>
              <option value="board">Правление</option>
              <option value="directors">Директора</option>
              <option value="export">Отдел экспорта</option>
            </Select>
          </Field>

          <Field label="Почта" hint="Необязательно. Публикуется на сайте как ссылка.">
            <TextInput type="email" name="email" defaultValue={row?.email ?? ""} />
          </Field>
        </Fieldset>

        <Fieldset title="Фотография">
          <ImageField
            name="photo_path"
            label="Портрет"
            hint="Квадратный кадр. Без фотографии показываются инициалы."
            value={row?.photo_path}
            folder="team"
          />
        </Fieldset>

        <Fieldset title="Публикация">
          <Field label="Порядок" hint="Меньше — выше в списке.">
            <TextInput type="number" name="position" defaultValue={row?.position ?? 0} />
          </Field>
          <Checkbox
            name="is_published"
            label="Опубликовать"
            defaultChecked={row?.is_published ?? true}
          />
        </Fieldset>
      </EntryForm>
    </>
  );
}

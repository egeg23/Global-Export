import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/delete-button";
import { EntryForm } from "@/components/admin/entry-form";
import { Checkbox, Field, Fieldset, TextInput } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { LocalizedField } from "@/components/admin/localized-field";
import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import type { NewsRow } from "@/lib/supabase/types";

import { deleteNews, saveNews } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function NewsEditorPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let row: NewsRow | null = null;
  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    row = data as NewsRow;
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader title={isNew ? "Новая публикация" : "Публикация"} />

      <EntryForm
        action={saveNews}
        backHref="/admin/news"
        deleteSlot={
          row ? (
            <DeleteButton
              action={deleteNews}
              confirm="Удалить публикацию? Действие необратимо."
            />
          ) : null
        }
      >
        <input type="hidden" name="id" value={row?.id ?? "new"} />

        <Fieldset title="Текст">
          <LocalizedField name="title" label="Заголовок" value={row?.title} required />
          <LocalizedField
            name="excerpt"
            label="Краткое описание"
            hint="Одно-два предложения для карточки и для поисковой выдачи."
            value={row?.excerpt}
            multiline
            rows={3}
          />
          <LocalizedField
            name="body"
            label="Текст"
            hint="Абзацы разделяются пустой строкой."
            value={row?.body}
            multiline
            rows={14}
          />
          <LocalizedField
            name="tag"
            label="Рубрика"
            hint="Необязательно: «Сертификация», «Экспорт», «Выставки»."
            value={row?.tag}
          />
        </Fieldset>

        <Fieldset title="Изображение">
          <ImageField
            name="image_path"
            label="Фотография"
            hint="Горизонтальная, от 1200 пикселей по ширине."
            value={row?.image_path}
            folder="news"
          />
        </Fieldset>

        <Fieldset title="Публикация">
          <Field label="Дата публикации">
            <TextInput
              type="date"
              name="published_at"
              defaultValue={row?.published_at ?? today}
              required
            />
          </Field>

          <Field
            label="Адрес страницы"
            hint="Оставьте пустым — составится из заголовка. У опубликованной новости менять не стоит: старые ссылки перестанут работать."
          >
            <TextInput
              name="slug"
              defaultValue={row?.slug ?? ""}
              placeholder="global-export-na-vystavke-biofach"
            />
          </Field>

          <Checkbox
            name="is_published"
            label="Опубликовать"
            hint="Снятая галочка — черновик: виден только в панели."
            defaultChecked={row?.is_published ?? false}
          />
        </Fieldset>
      </EntryForm>
    </>
  );
}

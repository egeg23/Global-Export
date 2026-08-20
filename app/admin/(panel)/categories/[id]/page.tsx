import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/delete-button";
import { EntryForm } from "@/components/admin/entry-form";
import { Checkbox, Field, Fieldset, TextInput } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { LocalizedField } from "@/components/admin/localized-field";
import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import type { CategoryRow } from "@/lib/supabase/types";

import { deleteCategory, saveCategory } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function CategoryEditorPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let row: CategoryRow | null = null;
  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    row = data as CategoryRow;
  }

  return (
    <>
      <PageHeader title={isNew ? "Новая категория" : "Категория"} />

      <EntryForm
        action={saveCategory}
        backHref="/admin/categories"
        deleteSlot={
          row ? (
            <DeleteButton
              action={deleteCategory}
              confirm="Удалить категорию? Товары в ней останутся, но потеряют раздел."
            />
          ) : null
        }
      >
        <input type="hidden" name="id" value={row?.id ?? "new"} />

        <Fieldset title="Название и описание">
          <LocalizedField name="name" label="Название" value={row?.name} required />
          <LocalizedField
            name="short_name"
            label="Короткое название"
            hint="Для плашки на карточке товара: «Бобовые», «Сухофрукты»."
            value={row?.short_name}
          />
          <LocalizedField
            name="description"
            label="Описание"
            value={row?.description}
            multiline
            rows={5}
          />
        </Fieldset>

        <Fieldset title="Изображение">
          <ImageField
            name="image_path"
            label="Фотография"
            hint="Горизонтальная — используется в плитке на главной."
            value={row?.image_path}
            folder="categories"
          />
        </Fieldset>

        <Fieldset title="Публикация">
          <Field label="Адрес (slug)" hint="Оставьте пустым — составится из названия.">
            <TextInput name="slug" defaultValue={row?.slug ?? ""} />
          </Field>
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

import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/delete-button";
import { EntryForm } from "@/components/admin/entry-form";
import { Checkbox, Field, Fieldset, Select, TextInput } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { LocalizedField } from "@/components/admin/localized-field";
import { PageHeader } from "@/components/admin/page-header";
import { SpecsEditor } from "@/components/admin/specs-editor";
import { createClient } from "@/lib/supabase/server";
import type { CategoryRow, ProductRow } from "@/lib/supabase/types";

import { deleteProduct, saveProduct } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function ProductEditorPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";
  const supabase = await createClient();

  const { data: categoryData } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true });
  const categories = (categoryData as CategoryRow[] | null) ?? [];

  let row: ProductRow | null = null;
  if (!isNew) {
    const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    row = data as ProductRow;
  }

  return (
    <>
      <PageHeader title={isNew ? "Новый товар" : "Товар"} />

      <EntryForm
        action={saveProduct}
        backHref="/admin/products"
        deleteSlot={
          row ? (
            <DeleteButton action={deleteProduct} confirm="Удалить товар? Действие необратимо." />
          ) : null
        }
      >
        <input type="hidden" name="id" value={row?.id ?? "new"} />

        <Fieldset title="Основное">
          <LocalizedField name="name" label="Название" value={row?.name} required />

          <Field label="Категория">
            <Select name="category_slug" defaultValue={row?.category_slug ?? ""} required>
              <option value="" disabled>
                Выберите категорию
              </option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name.ru || category.name.en || category.slug}
                </option>
              ))}
            </Select>
          </Field>

          <LocalizedField
            name="description"
            label="Описание"
            value={row?.description}
            multiline
            rows={6}
          />

          <Field label="Латинское название" hint="Необязательно: Vigna radiata.">
            <TextInput name="latin_name" defaultValue={row?.latin_name ?? ""} />
          </Field>
        </Fieldset>

        <SpecsEditor value={row?.specs} />

        <Fieldset title="Поставка">
          <LocalizedField
            name="packaging"
            label="Упаковка"
            value={row?.packaging}
            multiline
            rows={3}
          />
          <LocalizedField
            name="regions"
            label="Регионы выращивания"
            value={row?.regions}
            multiline
            rows={3}
          />
          <Field label="Код ТН ВЭД" hint="Необязательно.">
            <TextInput name="hs_code" defaultValue={row?.hs_code ?? ""} />
          </Field>
        </Fieldset>

        <Fieldset title="Изображение">
          <ImageField
            name="image_path"
            label="Фотография"
            value={row?.image_path}
            folder="products"
          />
        </Fieldset>

        <Fieldset title="Публикация">
          <Field
            label="Адрес страницы"
            hint="Оставьте пустым — составится из названия."
          >
            <TextInput name="slug" defaultValue={row?.slug ?? ""} />
          </Field>

          <Field label="Наличие">
            <Select name="availability" defaultValue={row?.availability ?? "available"}>
              <option value="available">В продаже</option>
              <option value="soon">Скоро — с пометкой на карточке</option>
            </Select>
          </Field>

          <Field label="Порядок" hint="Меньше — выше в списке.">
            <TextInput type="number" name="position" defaultValue={row?.position ?? 0} />
          </Field>

          <Checkbox
            name="is_featured"
            label="Показывать на главной"
            defaultChecked={row?.is_featured ?? false}
          />

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

import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/delete-button";
import { EntryForm } from "@/components/admin/entry-form";
import { Checkbox, Field, Fieldset, TextInput } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { LocalizedField } from "@/components/admin/localized-field";
import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import type { CertificateRow } from "@/lib/supabase/types";

import { deleteCertificate, saveCertificate } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function CertificateEditorPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  let row: CertificateRow | null = null;
  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    row = data as CertificateRow;
  }

  return (
    <>
      <PageHeader title={isNew ? "Новый сертификат" : "Сертификат"} />

      <EntryForm
        action={saveCertificate}
        backHref="/admin/certificates"
        deleteSlot={
          row ? (
            <DeleteButton
              action={deleteCertificate}
              confirm="Удалить сертификат? Действие необратимо."
            />
          ) : null
        }
      >
        <input type="hidden" name="id" value={row?.id ?? "new"} />

        <Fieldset title="Сертификат">
          <Field label="Название" hint="Как в документе: FSSC 22000, Halal.">
            <TextInput name="name" defaultValue={row?.name ?? ""} required />
          </Field>
          <Field label="Кем выдан" hint="Необязательно.">
            <TextInput name="issuer" defaultValue={row?.issuer ?? ""} />
          </Field>
          <LocalizedField
            name="description"
            label="Описание"
            hint="Что подтверждает сертификат — одно-два предложения."
            value={row?.description}
            multiline
            rows={4}
          />
        </Fieldset>

        <Fieldset title="Документ">
          <ImageField
            name="image_path"
            label="Скан или логотип"
            hint="Можно загрузить PDF — он откроется по ссылке."
            value={row?.image_path}
            folder="certificates"
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

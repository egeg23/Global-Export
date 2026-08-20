"use server";

import { redirect } from "next/navigation";

import {
  boolFromForm,
  intFromForm,
  localizedFromForm,
  nullableFromForm,
  slugify,
  textFromForm,
} from "@/lib/admin/form";
import { deleteRow, setPublished, writeRow, type SaveState } from "@/lib/admin/mutate";

export async function saveCertificate(
  _state: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const id = textFromForm(formData, "id") || "new";
  const name = textFromForm(formData, "name");

  if (!name) return { error: "Укажите название сертификата." };

  const slug = slugify(textFromForm(formData, "slug")) || slugify(name);

  const result = await writeRow("certificates", id, {
    slug,
    name,
    issuer: nullableFromForm(formData, "issuer"),
    description: localizedFromForm(formData, "description"),
    image_path: nullableFromForm(formData, "image_path"),
    position: intFromForm(formData, "position"),
    is_published: boolFromForm(formData, "is_published"),
  });

  if (result.error) return { error: result.error };
  redirect("/admin/certificates");
}

export async function deleteCertificate(
  _state: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const result = await deleteRow("certificates", textFromForm(formData, "id"));
  if (result.error) return { error: result.error };
  redirect("/admin/certificates");
}

export async function toggleCertificate(
  _state: SaveState,
  formData: FormData,
): Promise<SaveState> {
  return setPublished(
    "certificates",
    textFromForm(formData, "id"),
    textFromForm(formData, "published") === "true",
  );
}

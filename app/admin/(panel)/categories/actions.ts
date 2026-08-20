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

export async function saveCategory(_state: SaveState, formData: FormData): Promise<SaveState> {
  const id = textFromForm(formData, "id") || "new";
  const name = localizedFromForm(formData, "name");

  const slug =
    slugify(textFromForm(formData, "slug")) || slugify(name.en ?? name.ru ?? name.uz ?? "");
  if (!slug) return { error: "Укажите название категории." };

  const result = await writeRow("categories", id, {
    slug,
    name,
    short_name: localizedFromForm(formData, "short_name"),
    description: localizedFromForm(formData, "description"),
    image_path: nullableFromForm(formData, "image_path"),
    position: intFromForm(formData, "position"),
    is_published: boolFromForm(formData, "is_published"),
  });

  if (result.error) return { error: result.error };
  redirect("/admin/categories");
}

export async function deleteCategory(_state: SaveState, formData: FormData): Promise<SaveState> {
  const result = await deleteRow("categories", textFromForm(formData, "id"));
  if (result.error) return { error: result.error };
  redirect("/admin/categories");
}

export async function toggleCategory(_state: SaveState, formData: FormData): Promise<SaveState> {
  return setPublished(
    "categories",
    textFromForm(formData, "id"),
    textFromForm(formData, "published") === "true",
  );
}

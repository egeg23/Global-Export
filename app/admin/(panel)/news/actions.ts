"use server";

import { redirect } from "next/navigation";

import {
  boolFromForm,
  localizedFromForm,
  nullableFromForm,
  slugify,
  textFromForm,
} from "@/lib/admin/form";
import { deleteRow, setPublished, writeRow, type SaveState } from "@/lib/admin/mutate";

export async function saveNews(_state: SaveState, formData: FormData): Promise<SaveState> {
  const id = textFromForm(formData, "id") || "new";
  const title = localizedFromForm(formData, "title");

  // The address is derived from the title when the field is left empty, so the
  // owner never has to think about URLs — but stays editable, because changing
  // a published address breaks links that already point at it.
  const slug =
    slugify(textFromForm(formData, "slug")) ||
    slugify(title.en ?? title.ru ?? title.uz ?? "");

  if (!slug) return { error: "Укажите заголовок — из него будет составлен адрес страницы." };

  const published = textFromForm(formData, "published_at");
  if (!published) return { error: "Укажите дату публикации." };

  const result = await writeRow("news", id, {
    slug,
    published_at: published,
    title,
    excerpt: localizedFromForm(formData, "excerpt"),
    body: localizedFromForm(formData, "body"),
    tag: localizedFromForm(formData, "tag"),
    image_path: nullableFromForm(formData, "image_path"),
    is_published: boolFromForm(formData, "is_published"),
  });

  if (result.error) return { error: result.error };
  redirect("/admin/news");
}

export async function deleteNews(_state: SaveState, formData: FormData): Promise<SaveState> {
  const result = await deleteRow("news", textFromForm(formData, "id"));
  if (result.error) return { error: result.error };
  redirect("/admin/news");
}

export async function toggleNews(_state: SaveState, formData: FormData): Promise<SaveState> {
  return setPublished(
    "news",
    textFromForm(formData, "id"),
    textFromForm(formData, "published") === "true",
  );
}

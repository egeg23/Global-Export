"use server";

import { redirect } from "next/navigation";

import {
  boolFromForm,
  intFromForm,
  localizedFromForm,
  nullableFromForm,
  slugify,
  specsFromForm,
  textFromForm,
} from "@/lib/admin/form";
import { deleteRow, setPublished, writeRow, type SaveState } from "@/lib/admin/mutate";

export async function saveProduct(_state: SaveState, formData: FormData): Promise<SaveState> {
  const id = textFromForm(formData, "id") || "new";
  const name = localizedFromForm(formData, "name");

  const slug =
    slugify(textFromForm(formData, "slug")) ||
    slugify(name.en ?? name.ru ?? name.uz ?? "");

  if (!slug) return { error: "Укажите название — из него будет составлен адрес страницы." };

  const category = textFromForm(formData, "category_slug");
  if (!category) return { error: "Выберите категорию." };

  const availability = textFromForm(formData, "availability");

  const result = await writeRow("products", id, {
    slug,
    category_slug: category,
    name,
    latin_name: nullableFromForm(formData, "latin_name"),
    description: localizedFromForm(formData, "description"),
    specs: specsFromForm(formData),
    regions: localizedFromForm(formData, "regions"),
    packaging: localizedFromForm(formData, "packaging"),
    hs_code: nullableFromForm(formData, "hs_code"),
    image_path: nullableFromForm(formData, "image_path"),
    is_featured: boolFromForm(formData, "is_featured"),
    availability: availability === "soon" ? "soon" : "available",
    position: intFromForm(formData, "position"),
    is_published: boolFromForm(formData, "is_published"),
  });

  if (result.error) return { error: result.error };
  redirect("/admin/products");
}

export async function deleteProduct(_state: SaveState, formData: FormData): Promise<SaveState> {
  const result = await deleteRow("products", textFromForm(formData, "id"));
  if (result.error) return { error: result.error };
  redirect("/admin/products");
}

export async function toggleProduct(_state: SaveState, formData: FormData): Promise<SaveState> {
  return setPublished(
    "products",
    textFromForm(formData, "id"),
    textFromForm(formData, "published") === "true",
  );
}

"use server";

import { redirect } from "next/navigation";

import {
  boolFromForm,
  intFromForm,
  localizedFromForm,
  nullableFromForm,
  textFromForm,
} from "@/lib/admin/form";
import { deleteRow, setPublished, writeRow, type SaveState } from "@/lib/admin/mutate";

const groups = new Set(["board", "directors", "export"]);

export async function saveTeamMember(
  _state: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const id = textFromForm(formData, "id") || "new";
  const name = textFromForm(formData, "name");

  if (!name) return { error: "Укажите имя сотрудника." };

  const group = textFromForm(formData, "team_group");

  const result = await writeRow("team_members", id, {
    name,
    position_title: localizedFromForm(formData, "position_title"),
    team_group: groups.has(group) ? group : "directors",
    email: nullableFromForm(formData, "email"),
    photo_path: nullableFromForm(formData, "photo_path"),
    position: intFromForm(formData, "position"),
    is_published: boolFromForm(formData, "is_published"),
  });

  if (result.error) return { error: result.error };
  redirect("/admin/team");
}

export async function deleteTeamMember(
  _state: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const result = await deleteRow("team_members", textFromForm(formData, "id"));
  if (result.error) return { error: result.error };
  redirect("/admin/team");
}

export async function toggleTeamMember(
  _state: SaveState,
  formData: FormData,
): Promise<SaveState> {
  return setPublished(
    "team_members",
    textFromForm(formData, "id"),
    textFromForm(formData, "published") === "true",
  );
}

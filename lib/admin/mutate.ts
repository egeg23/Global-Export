import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { TableName } from "@/lib/supabase/types";

export type SaveState = { error?: string };

/**
 * Rebuilds the public pages after a change.
 *
 * Deliberately blunt: one call that invalidates the locale layout and
 * everything under it. The site is a few hundred static pages regenerated on
 * demand, and the alternative — listing the routes each table touches — is the
 * kind of mapping that silently goes stale the first time a component starts
 * reading something new. The footer alone lists categories on every page.
 */
export function revalidateSite() {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/sitemap.xml");
}

type Values = Record<string, unknown>;

/**
 * Inserts or updates one row and refreshes the site.
 *
 * `id` is the row's uuid, or `"new"` for a fresh entry — the editor uses one
 * route for both, so the caller does not branch.
 */
export async function writeRow(
  table: TableName,
  id: string,
  values: Values,
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();

  const query =
    id === "new"
      ? supabase.from(table).insert(values as never).select("id").single()
      : supabase.from(table).update(values as never).eq("id", id).select("id").single();

  const { data, error } = await query;

  if (error) {
    return { error: describe(error.message) };
  }

  revalidateSite();
  return { id: (data as { id: string }).id };
}

export async function deleteRow(table: TableName, id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) return { error: describe(error.message) };

  revalidateSite();
  return {};
}

/** Publish toggles from a list view, without opening the editor. */
export async function setPublished(
  table: TableName,
  id: string,
  isPublished: boolean,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from(table)
    .update({ is_published: isPublished } as never)
    .eq("id", id);

  if (error) return { error: describe(error.message) };

  revalidateSite();
  return {};
}

/** Postgres error text is precise but unreadable; translate the ones we cause. */
function describe(message: string): string {
  if (message.includes("duplicate key")) {
    return "Такой адрес (slug) уже занят — измените его.";
  }
  if (message.includes("violates check constraint")) {
    return "Одно из значений недопустимо. Проверьте выпадающие списки.";
  }
  if (message.includes("violates row-level security")) {
    return "Недостаточно прав. Войдите заново.";
  }
  return message;
}

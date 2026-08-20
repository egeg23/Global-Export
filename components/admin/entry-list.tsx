import Link from "next/link";

import type { SaveState } from "@/lib/admin/mutate";

import { PublishToggle } from "./publish-toggle";

export type EntryRow = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  isPublished?: boolean;
};

/**
 * The list every section opens on. Rows link to the editor; the publish switch
 * is a form of its own so it can be flipped without opening anything.
 */
export function EntryList({
  rows,
  basePath,
  empty,
  togglePublished,
}: {
  rows: EntryRow[];
  basePath: string;
  empty: string;
  togglePublished?: (state: SaveState, formData: FormData) => Promise<SaveState>;
}) {
  if (rows.length === 0) {
    return (
      <p className="mt-10 rounded-xl border border-dashed border-forest-900/15 px-6 py-12 text-center text-sm text-ink-muted">
        {empty}
      </p>
    );
  }

  return (
    <ul className="mt-8 divide-y divide-forest-900/8 overflow-hidden rounded-xl border border-forest-900/10 bg-white">
      {rows.map((row) => (
        <li key={row.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5">
          <Link
            href={`${basePath}/${row.id}`}
            className="min-w-0 flex-1 no-underline"
          >
            <span className="block truncate text-sm font-medium text-forest-950">
              {row.title || "Без названия"}
            </span>
            {row.subtitle ? (
              <span className="mt-0.5 block truncate text-xs text-ink-subtle">
                {row.subtitle}
              </span>
            ) : null}
          </Link>

          {row.meta ? (
            <span className="shrink-0 text-xs text-ink-subtle">{row.meta}</span>
          ) : null}

          {togglePublished && row.isPublished !== undefined ? (
            <PublishToggle
              id={row.id}
              isPublished={row.isPublished}
              action={togglePublished}
            />
          ) : null}

          <Link
            href={`${basePath}/${row.id}`}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-forest-800 hover:bg-forest-800/6"
          >
            Изменить
          </Link>
        </li>
      ))}
    </ul>
  );
}

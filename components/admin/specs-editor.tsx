"use client";

import { useState } from "react";

import type { SpecJson } from "@/lib/supabase/types";

import { LocalizedField } from "./localized-field";

/**
 * The specification table on a product — "Сорт и калибровка: 3.0–4.0 мм" and so
 * on — as an editable list.
 *
 * Rows keep a stable key across re-renders so that removing the second of four
 * does not make React reuse the wrong inputs. Deleted rows are dropped from the
 * form entirely; the server also discards any row left blank.
 */
export function SpecsEditor({ name = "specs", value }: { name?: string; value?: SpecJson[] }) {
  const [rows, setRows] = useState(() =>
    (value ?? []).map((spec, index) => ({ key: index, spec })),
  );
  const [nextKey, setNextKey] = useState(() => (value ?? []).length);

  return (
    <div className="rounded-xl border border-forest-900/10 bg-white p-5 lg:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-forest-950">Характеристики</h2>
          <p className="mt-1 text-xs text-ink-subtle">
            Пары «название — значение»: сорт, калибровка, влажность, упаковка.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRows((current) => [
              ...current,
              { key: nextKey, spec: { label: {}, value: {} } },
            ]);
            setNextKey((key) => key + 1);
          }}
          className="inline-flex h-9 shrink-0 items-center rounded-lg border border-forest-900/15 px-3 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-800/5"
        >
          Добавить строку
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">Характеристик пока нет.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {rows.map((row, index) => (
            <li
              key={row.key}
              className="rounded-lg border border-forest-900/10 bg-sand-50 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-ink-subtle">
                  Строка {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setRows((current) => current.filter((entry) => entry.key !== row.key))
                  }
                  className="text-xs font-medium text-red-700 hover:underline"
                >
                  Убрать
                </button>
              </div>

              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <LocalizedField
                  name={`${name}.${index}.label`}
                  label="Название"
                  value={row.spec.label}
                />
                <LocalizedField
                  name={`${name}.${index}.value`}
                  label="Значение"
                  value={row.spec.value}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

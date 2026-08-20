"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { SaveState } from "@/lib/admin/mutate";

import { SubmitButton } from "./submit-button";

/**
 * The shell every editor shares: the action wiring, the error line and the save
 * bar. Each section supplies only its own fields.
 */
export function EntryForm({
  action,
  backHref,
  children,
  deleteSlot,
}: {
  action: (state: SaveState, formData: FormData) => Promise<SaveState>;
  backHref: string;
  children: React.ReactNode;
  deleteSlot?: React.ReactNode;
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(action, {});

  return (
    <form action={formAction} className="mt-8 max-w-3xl space-y-5">
      {children}

      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 border-t border-forest-900/10 bg-sand-100/95 px-5 py-4 backdrop-blur lg:-mx-10 lg:px-10">
        <SubmitButton pendingLabel="Сохраняем…">Сохранить</SubmitButton>
        <Link
          href={backHref}
          className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-forest-800 hover:bg-forest-800/6"
        >
          Отмена
        </Link>
        {deleteSlot ? <div className="ml-auto">{deleteSlot}</div> : null}
      </div>
    </form>
  );
}

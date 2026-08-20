"use client";

import { useActionState } from "react";

import type { SaveState } from "@/lib/admin/mutate";

import { SubmitButton } from "./submit-button";

/**
 * Its own form rather than a second submit inside the editor: nesting forms is
 * invalid HTML, and a delete that shares a form with the fields would post the
 * whole draft along with it.
 */
export function DeleteButton({
  action,
  label = "Удалить",
  confirm,
}: {
  action: (state: SaveState, formData: FormData) => Promise<SaveState>;
  label?: string;
  confirm: string;
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(confirm)) event.preventDefault();
      }}
    >
      <SubmitButton variant="danger" pendingLabel="Удаляем…">
        {label}
      </SubmitButton>
      {state.error ? (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
